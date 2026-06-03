import type { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { created } from '@/utils/response';

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await bookingService.createBooking(userId, req.body);
    created(res, { message: 'Tạo đơn hàng thành công', booking: result });
  }
};
