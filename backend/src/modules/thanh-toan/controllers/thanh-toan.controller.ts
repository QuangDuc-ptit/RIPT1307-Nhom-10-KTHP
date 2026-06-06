import type { Request, Response } from 'express';
import { thanhToanService } from '../services/thanh-toan.service';
import { created, ok } from '@/utils/response';

export const thanhToanController = {
  createPayment: async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const result = await thanhToanService.createPayment(userId, req.body);
    created(res, result);
  },

  handleIpn: async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      ...req.query,
    } as any;

    const result = await thanhToanService.handleIpn(payload);
    ok(res, result);
  },
};
