import { prisma } from '@/config/db';
import { conflict, badRequest } from '@/utils/errors';
import { SeatType } from '@prisma/client';

export const bookingService = {
  createBooking: async (userId: string, data: {
    showtimeId: string;
    showtimeSeatIds: string[];
    foods: { foodId: string; quantity: number }[];
  }) => {
    // Sử dụng Transaction để đảm bảo tính toàn vẹn (ACID)
    return await prisma.$transaction(async (tx) => {
      // 1. Xác minh các ghế truyền lên có đang được user này giữ (RESERVED) không
      const seats = await tx.showtimeSeat.findMany({
        where: {
          id: { in: data.showtimeSeatIds },
          showtimeId: data.showtimeId
        },
        include: { seat: true }
      });

      if (seats.length !== data.showtimeSeatIds.length) {
        throw badRequest('Một số ghế không hợp lệ hoặc không thuộc suất chiếu này');
      }

      const now = new Date();
      let totalSeatAmount = 0;
      const bookingSeatsData: any[] = [];

      for (const stSeat of seats) {
        // Kiểm tra chặt chẽ ghế có đúng là của user này giữ và chưa hết hạn không
        if (stSeat.status !== 'RESERVED' || stSeat.userId !== userId || (stSeat.expiresAt && stSeat.expiresAt < now)) {
          throw conflict(`Ghế ${stSeat.seat.row}${stSeat.seat.number} chưa được giữ hoặc đã hết hạn giữ chỗ! Vui lòng giữ ghế trước khi tạo đơn.`);
        }

        // Tính giá ghế (Hardcode theo thỏa thuận)
        let price = 0;
        if (stSeat.seat.type === SeatType.NORMAL) price = 80000;
        else if (stSeat.seat.type === SeatType.VIP) price = 120000;
        else if (stSeat.seat.type === SeatType.SWEETBOX) price = 200000;

        totalSeatAmount += price;
        bookingSeatsData.push({
          showtimeSeatId: stSeat.id,
          price: price // Lưu cứng giá
        });
      }

      // 2. Xác minh đồ ăn và tính giá
      let totalFoodAmount = 0;
      const bookingFoodsData: any[] = [];
      
      if (data.foods.length > 0) {
        const foodIds = data.foods.map(f => f.foodId);
        const foodsDb = await tx.food.findMany({
          where: { id: { in: foodIds } }
        });

        if (foodsDb.length !== data.foods.length) {
          throw badRequest('Một số đồ ăn không tồn tại trong hệ thống');
        }

        for (const reqFood of data.foods) {
          const foodDb = foodsDb.find(f => f.id === reqFood.foodId);
          if (foodDb) {
            const amount = foodDb.price * reqFood.quantity;
            totalFoodAmount += amount;
            bookingFoodsData.push({
              foodId: foodDb.id,
              quantity: reqFood.quantity,
              price: foodDb.price // Lưu cứng giá
            });
          }
        }
      }

      const totalAmount = totalSeatAmount + totalFoodAmount;

      // 3. Gia hạn thời gian giữ ghế thêm 10 phút để người dùng thanh toán
      await tx.showtimeSeat.updateMany({
        where: { id: { in: data.showtimeSeatIds } },
        data: {
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      });

      // 4. Khởi tạo Đơn hàng (Booking)
      const booking = await tx.booking.create({
        data: {
          userId,
          showtimeId: data.showtimeId,
          totalAmount,
          status: 'PENDING',
          bookingSeats: {
            create: bookingSeatsData
          },
          bookingFoods: {
            create: bookingFoodsData
          }
        },
        include: {
          bookingSeats: true,
          bookingFoods: true
        }
      });

      return booking;
    });
  }
};
