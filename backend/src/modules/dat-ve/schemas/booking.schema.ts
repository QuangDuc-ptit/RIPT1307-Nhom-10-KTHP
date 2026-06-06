import { z } from 'zod';

export const createBookingSchema = z.object({
  showtimeId: z.string().cuid('ID suất chiếu không hợp lệ'),
  showtimeSeatIds: z.array(z.string().cuid('ID ghế không hợp lệ')).min(1, 'Phải chọn ít nhất 1 ghế'),
  foods: z.array(
    z.object({
      foodId: z.string().cuid('ID đồ ăn không hợp lệ'),
      quantity: z.number().int().min(1)
    })
  ).optional().default([])
});

export const paymentProviderSchema = z.object({
  provider: z.enum(['VNPAY', 'MOMO'], 'Cổng thanh toán không hợp lệ')
});
