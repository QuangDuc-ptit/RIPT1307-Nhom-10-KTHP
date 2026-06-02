import { prisma } from '@/config/db';
import { conflict } from '@/utils/errors';

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

    return updatedSeat;
  }
};
