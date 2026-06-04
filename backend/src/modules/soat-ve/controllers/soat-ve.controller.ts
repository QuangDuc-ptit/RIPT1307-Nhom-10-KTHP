import type { Request, Response } from 'express';
import { soatVeService } from '../services/soat-ve.service';
import { ok } from '@/utils/response';

export const soatVeController = {
  scanTicket: async (req: Request, res: Response) => {
    const staffId = req.user!.id;
    const { token } = req.body;

    const result = await soatVeService.scanTicket(staffId, token);
    ok(res, { message: 'Soát vé thành công, mời khách qua cổng.', booking: result });
  }
};
