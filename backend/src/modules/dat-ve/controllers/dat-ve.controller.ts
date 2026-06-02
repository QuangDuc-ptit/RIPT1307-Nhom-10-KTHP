import type { Request, Response } from 'express';
import { datVeService } from '../services/dat-ve.service';
import { ok } from '@/utils/response';

export const datVeController = {
  giuGhe: async (req: Request, res: Response) => {
    const { showtimeSeatId, version } = req.body;
    // req.user được gán từ middleware requireAuth
    const userId = req.user!.id;

    const result = await datVeService.giuGhe(userId, showtimeSeatId, version);
    ok(res, { message: 'Đã giữ ghế thành công', seat: result });
  }
};
