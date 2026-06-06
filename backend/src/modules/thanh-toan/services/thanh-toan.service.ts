import crypto from 'crypto';
import { prisma } from '@/config/db';
import { env } from '@/config/env';
import { badRequest, conflict, notFound } from '@/utils/errors';
import type { PaymentProvider } from '@prisma/client';

const PAYMENT_HOLD_MINUTES = 10;

function generateRequestId(provider: PaymentProvider) {
  return `${provider}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function buildInvoiceNumber() {
  return `INV-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function normalizeProviderSuccess(provider: PaymentProvider, payload: {
  success?: boolean;
  responseCode?: string;
  resultCode?: string;
}) {
  if (typeof payload.success === 'boolean') return payload.success;
  if (provider === 'VNPAY') return payload.responseCode === '00';
  return payload.resultCode === '0' || payload.responseCode === '0';
}

function buildPaymentUrl(provider: PaymentProvider, requestId: string, bookingId: string, amount: number) {
  const returnUrl = new URL(env.PAYMENT_RETURN_URL);
  returnUrl.searchParams.set('provider', provider);
  returnUrl.searchParams.set('requestId', requestId);
  returnUrl.searchParams.set('bookingId', bookingId);

  if (provider === 'VNPAY') {
    const url = new URL(env.VNPAY_BASE_URL);
    url.searchParams.set('vnp_TxnRef', requestId);
    url.searchParams.set('vnp_Amount', String(Math.round(amount * 100)));
    url.searchParams.set('vnp_OrderInfo', `Thanh toan don ${bookingId}`);
    url.searchParams.set('vnp_ReturnUrl', returnUrl.toString());
    if (env.VNPAY_TMN_CODE) url.searchParams.set('vnp_TmnCode', env.VNPAY_TMN_CODE);
    return url.toString();
  }

  const url = new URL(env.PAYMENT_RETURN_URL);
  url.searchParams.set('provider', provider);
  url.searchParams.set('requestId', requestId);
  url.searchParams.set('bookingId', bookingId);
  url.searchParams.set('momoAmount', String(amount));
  return url.toString();
}

export const thanhToanService = {
  async createPayment(userId: string, data: { bookingId: string; provider: PaymentProvider }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        bookingSeats: {
          include: {
            showtimeSeat: true,
          },
        },
      },
    });

    if (!booking || booking.userId !== userId) {
      throw notFound('Không tìm thấy đơn hàng');
    }

    if (booking.status !== 'PENDING') {
      throw conflict('Đơn hàng không ở trạng thái chờ thanh toán');
    }

    const now = new Date();
    const invalidSeat = booking.bookingSeats.find(
      (item) =>
        item.showtimeSeat.status !== 'RESERVED' ||
        item.showtimeSeat.userId !== userId ||
        (item.showtimeSeat.expiresAt ? item.showtimeSeat.expiresAt < now : true),
    );

    if (invalidSeat) {
      throw conflict('Đơn hàng có ghế không còn được giữ hợp lệ để thanh toán');
    }

    const requestId = generateRequestId(data.provider);
    const paymentUrl = buildPaymentUrl(data.provider, requestId, booking.id, booking.totalAmount);
    const expiresAt = new Date(Date.now() + PAYMENT_HOLD_MINUTES * 60 * 1000);

    const payment = await prisma.$transaction(async (tx) => {
      await tx.showtimeSeat.updateMany({
        where: { id: { in: booking.bookingSeats.map((item) => item.showtimeSeatId) } },
        data: { expiresAt },
      });

      return tx.payment.create({
        data: {
          bookingId: booking.id,
          provider: data.provider,
          amount: booking.totalAmount,
          requestId,
          paymentUrl,
          redirectPayload: {
            bookingId: booking.id,
            provider: data.provider,
            amount: booking.totalAmount,
            returnUrl: env.PAYMENT_RETURN_URL,
            ipnUrl: env.PAYMENT_IPN_URL,
          },
        },
      });
    });

    return {
      message: 'Khởi tạo thanh toán thành công',
      payment: {
        id: payment.id,
        bookingId: payment.bookingId,
        provider: payment.provider,
        status: payment.status,
        amount: payment.amount,
        requestId: payment.requestId,
        paymentUrl: payment.paymentUrl,
        redirectPayload: payment.redirectPayload,
        createdAt: payment.createdAt.toISOString(),
      },
    };
  },

  async handleIpn(payload: {
    provider: PaymentProvider;
    requestId: string;
    providerRef?: string;
    responseCode?: string;
    resultCode?: string;
    amount?: number;
    success?: boolean;
  }) {
    const payment = await prisma.payment.findUnique({
      where: { requestId: payload.requestId },
      include: {
        booking: {
          include: {
            bookingSeats: true,
            bookingFoods: true,
          },
        },
        invoice: true,
      },
    });

    if (!payment || payment.provider !== payload.provider) {
      throw notFound('Không tìm thấy giao dịch thanh toán');
    }

    if (payment.status === 'SUCCESS') {
      return {
        message: 'Giao dịch đã được xử lý trước đó',
        bookingId: payment.bookingId,
        paymentId: payment.id,
        invoiceId: payment.invoice?.id ?? null,
      };
    }

    const isSuccess = normalizeProviderSuccess(payload.provider, payload);

    if (payload.amount !== undefined && Math.round(payload.amount) !== Math.round(payment.amount)) {
      throw badRequest('Số tiền thanh toán không khớp');
    }

    if (!isSuccess) {
      const failed = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          providerRef: payload.providerRef,
          responseCode: payload.responseCode ?? payload.resultCode ?? null,
        },
      });

      return {
        message: 'Giao dịch thanh toán thất bại',
        paymentId: failed.id,
        bookingId: failed.bookingId,
        status: failed.status,
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'SUCCESS',
          providerRef: payload.providerRef,
          responseCode: payload.responseCode ?? payload.resultCode ?? 'SUCCESS',
          paidAt: new Date(),
        },
      });

      const updatedBooking = await tx.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'SUCCESS' },
      });

      await tx.showtimeSeat.updateMany({
        where: { id: { in: payment.booking.bookingSeats.map((item) => item.showtimeSeatId) } },
        data: {
          status: 'BOOKED',
          expiresAt: null,
        },
      });

      const invoice = payment.invoice
        ? payment.invoice
        : await tx.invoice.create({
            data: {
              bookingId: payment.bookingId,
              paymentId: updatedPayment.id,
              invoiceNumber: buildInvoiceNumber(),
              amount: updatedPayment.amount,
              issuedAt: new Date(),
            },
          });

      return { updatedPayment, updatedBooking, invoice };
    });

    return {
      message: 'Xử lý IPN thành công',
      booking: {
        id: result.updatedBooking.id,
        status: result.updatedBooking.status,
      },
      payment: {
        id: result.updatedPayment.id,
        status: result.updatedPayment.status,
        providerRef: result.updatedPayment.providerRef,
      },
      invoice: {
        id: result.invoice.id,
        invoiceNumber: result.invoice.invoiceNumber,
        amount: result.invoice.amount,
        issuedAt: result.invoice.issuedAt.toISOString(),
      },
    };
  },
};
