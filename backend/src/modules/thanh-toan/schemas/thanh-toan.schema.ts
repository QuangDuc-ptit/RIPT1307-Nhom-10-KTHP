import { z } from 'zod';

export const createPaymentSchema = z.object({
  bookingId: z.string().cuid('ID đơn hàng không hợp lệ'),
  provider: z.enum(['VNPAY', 'MOMO'], 'Cổng thanh toán không hợp lệ'),
});

export const paymentIpnSchema = z.object({
  provider: z.enum(['VNPAY', 'MOMO'], 'Cổng thanh toán không hợp lệ'),
  requestId: z.string().min(1, 'Thiếu requestId'),
  providerRef: z.string().min(1).optional(),
  responseCode: z.string().min(1).optional(),
  resultCode: z.string().min(1).optional(),
  amount: z.coerce.number().nonnegative().optional(),
  success: z.coerce.boolean().optional(),
});
