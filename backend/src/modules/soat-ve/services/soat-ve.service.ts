import crypto from 'crypto';
import { prisma } from '@/config/db';
import { badRequest, conflict } from '@/utils/errors';
import { signTicketToken, verifyTicketToken } from '@/utils/jwt';

function buildTicketFingerprint(input: {
  bookingId: string;
  userId: string;
  showtimeId: string;
  seatIds: string[];
  totalAmount: number;
}) {
  return crypto
    .createHash('sha256')
    .update(
      [
        input.bookingId,
        input.userId,
        input.showtimeId,
        [...input.seatIds].sort().join(','),
        String(input.totalAmount),
      ].join('|'),
    )
    .digest('hex');
}

async function generateTicketToken(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      bookingSeats: {
        select: {
          showtimeSeatId: true,
        },
      },
    },
  });

  if (!booking) {
    throw badRequest('Không tìm thấy đơn hàng để tạo mã vé.');
  }

  if (booking.status !== 'SUCCESS') {
    throw conflict('Chỉ có thể tạo mã vé khi đơn hàng đã thanh toán thành công.');
  }

  const seatIds = booking.bookingSeats.map((item) => item.showtimeSeatId);
  const fingerprint = buildTicketFingerprint({
    bookingId: booking.id,
    userId: booking.userId,
    showtimeId: booking.showtimeId,
    seatIds,
    totalAmount: booking.totalAmount,
  });

  return signTicketToken({
    bookingId: booking.id,
    userId: booking.userId,
    showtimeId: booking.showtimeId,
    seatIds,
    totalAmount: booking.totalAmount,
    status: 'SUCCESS',
    isCheckedIn: booking.isCheckedIn,
    issuedAtMs: Date.now(),
    fingerprint,
    jti: crypto.randomUUID(),
  });
}

export const soatVeService = {
  generateTicketToken,

  scanTicket: async (staffId: string, token: string) => {
    let payload;
    try {
      payload = verifyTicketToken(token);
    } catch {
      throw badRequest('Mã vé không hợp lệ hoặc đã hết hạn.');
    }

    const { bookingId } = payload;

    return await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          bookingSeats: {
            select: {
              showtimeSeatId: true,
            },
          },
        },
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

      const actualSeatIds = booking.bookingSeats.map((item) => item.showtimeSeatId);
      const expectedFingerprint = buildTicketFingerprint({
        bookingId: booking.id,
        userId: booking.userId,
        showtimeId: booking.showtimeId,
        seatIds: actualSeatIds,
        totalAmount: booking.totalAmount,
      });

      const hasSeatMismatch =
        actualSeatIds.length !== payload.seatIds.length ||
        [...actualSeatIds].sort().join(',') !== [...payload.seatIds].sort().join(',');

      if (
        payload.userId !== booking.userId ||
        payload.showtimeId !== booking.showtimeId ||
        payload.totalAmount !== booking.totalAmount ||
        payload.status !== 'SUCCESS' ||
        payload.isCheckedIn !== false ||
        hasSeatMismatch ||
        payload.fingerprint !== expectedFingerprint
      ) {
        throw badRequest('Mã vé không hợp lệ hoặc đã bị thay đổi dữ liệu bảo mật.');
      }

      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: { isCheckedIn: true },
      });

      await tx.staffLog.create({
        data: {
          staffId,
          bookingId,
          action: 'CHECK_IN',
        },
      });

      return updatedBooking;
    });
  },
};
