import { prisma } from '@/config/db';
import { conflict, badRequest } from '@/utils/errors';
import { getIO } from '@/config/socket';

export const datVeService = {
  giuGhe: async (userId: string, showtimeSeatId: string, version: number) => {
    // 1. Dùng Optimistic Locking để cập nhật.
    const result = await prisma.showtimeSeat.updateMany({
      where: {
        id: showtimeSeatId,
        version: version, // Kiểm tra version hiện tại
        OR: [
          { status: 'AVAILABLE' },
          { status: 'RESERVED', expiresAt: { lt: new Date() } } // Cho phép đè lên ghế đã hết hạn
        ]
      },
      data: {
        status: 'RESERVED',
        userId: userId,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // Giữ 5 phút
        version: { increment: 1 } // Tăng version lên
      }
    });

    if (result.count === 0) {
      throw conflict('Ghế đã bị người khác chọn hoặc dữ liệu version không đồng bộ!');
    }

    // 2. Lấy lại thông tin ghế vừa update để trả về
    const updatedSeat = await prisma.showtimeSeat.findUnique({
      where: { id: showtimeSeatId },
      include: { seat: true }
    });

    // 3. Emit sự kiện cho các client khác trong room showtime
    if (updatedSeat) {
      getIO().to(`showtime_${updatedSeat.showtimeId}`).emit('seat_status_change', {
        showtimeSeatId: updatedSeat.id,
        status: 'RESERVED',
        userId: updatedSeat.userId,
        version: updatedSeat.version
      });
    }

    return updatedSeat;
  },

  huyGhe: async (userId: string, showtimeSeatId: string) => {
    // Chỉ cho phép user nhả ghế do chính họ giữ và đang ở trạng thái RESERVED
    const result = await prisma.showtimeSeat.updateMany({
      where: {
        id: showtimeSeatId,
        userId: userId,
        status: 'RESERVED'
      },
      data: {
        status: 'AVAILABLE',
        userId: null,
        expiresAt: null,
        version: { increment: 1 }
      }
    });

    if (result.count === 0) {
      throw badRequest('Ghế không thuộc quyền giữ của bạn hoặc đã bị hủy trước đó');
    }

    const updatedSeat = await prisma.showtimeSeat.findUnique({
      where: { id: showtimeSeatId }
    });

    if (updatedSeat) {
      getIO().to(`showtime_${updatedSeat.showtimeId}`).emit('seat_status_change', {
        showtimeSeatId: updatedSeat.id,
        status: 'AVAILABLE',
        userId: null,
        version: updatedSeat.version
      });
    }

    return { success: true };
  }
};
