import type { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';
import { soatVeService } from '../../soat-ve/services/soat-ve.service';
import { created } from '@/utils/response';

export const bookingController = {
  createBooking: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await bookingService.createBooking(userId, req.body);
    created(res, { message: 'Tạo đơn hàng thành công', booking: result });
  },

  mockPayment: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { bookingId } = req.body;
    const result = await bookingService.mockPayment(userId, bookingId);
    
    // Also generate ticket token
    const ticketToken = await soatVeService.generateTicketToken(result.id);
    
    res.json({ message: 'Giả lập thanh toán thành công', booking: { ...result, ticketToken } });
  }
};
