import { prisma } from '@/config/db';
import { badRequest, conflict } from '@/utils/errors';
import jwt from 'jsonwebtoken';

const TICKET_SECRET = process.env.TICKET_SECRET || 'secret-ticket-key-123';

export const soatVeService = {
  // Service phụ: Mã hóa bookingId thành token JWT (Sẽ dùng lúc sinh QR Code cho Khách hàng)
  generateTicketToken: (bookingId: string) => {
    return jwt.sign({ bookingId }, TICKET_SECRET, { expiresIn: '7d' });
  },

  // Service chính: Giải mã và quét vé
  scanTicket: async (staffId: string, token: string) => {
    let payload;
    try {
      payload = jwt.verify(token, TICKET_SECRET) as { bookingId: string };
    } catch (error) {
      throw badRequest('Mã vé không hợp lệ hoặc đã hết hạn.');
    }

    const { bookingId } = payload;

    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        throw badRequest('Không tìm thấy đơn hàng này trong hệ thống.');
      }

      if (booking.status !== 'SUCCESS') {
        throw conflict(`Đơn hàng chưa thanh toán hoặc đã hủy (Trạng thái: ${booking.status}). Không thể soát vé.`);
      }

      if (booking.isCheckedIn) {
        throw conflict('Vé này đã được sử dụng qua cổng trước đó!');
      }

      // Cập nhật trạng thái
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { isCheckedIn: true }
      });

      // Ghi log
      await tx.staffLog.create({
        data: {
          staffId,
          bookingId,
          action: 'CHECK_IN'
        }
      });

      return updatedBooking;
    });
  }
};
