import type { Request, Response } from 'express';
import { suatChieuService } from '../services/suat-chieu.service';
import { created, noContent, ok } from '@/utils/response';

export const suatChieuController = {
  list: async (req: Request, res: Response) => {
    const result = await suatChieuService.list(req.query as { movieId?: string; roomId?: string; cinemaId?: string });
    ok(res, result);
  },

  detail: async (req: Request, res: Response) => {
    const result = await suatChieuService.detail(req.params.id);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await suatChieuService.create(req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await suatChieuService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await suatChieuService.remove(req.params.id);
    noContent(res);
  },
};
