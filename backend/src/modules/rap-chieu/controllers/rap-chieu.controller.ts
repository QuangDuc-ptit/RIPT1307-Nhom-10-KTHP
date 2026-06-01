import type { Request, Response } from 'express';
import { rapChieuService } from '../services/rap-chieu.service';
import { created, noContent, ok } from '@/utils/response';

export const rapChieuController = {
  list: async (_req: Request, res: Response) => {
    const result = await rapChieuService.list();
    ok(res, result);
  },

  detail: async (req: Request, res: Response) => {
    const result = await rapChieuService.detail(req.params.id);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await rapChieuService.create(req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await rapChieuService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await rapChieuService.remove(req.params.id);
    noContent(res);
  }
};
