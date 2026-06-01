import type { Request, Response } from 'express';
import { phongChieuService } from '../services/phong-chieu.service';
import { created, noContent, ok } from '@/utils/response';

export const phongChieuController = {
  list: async (req: Request, res: Response) => {
    const { cinemaId } = req.query as { cinemaId?: string };
    const result = await phongChieuService.list(cinemaId);
    ok(res, result);
  },

  detail: async (req: Request, res: Response) => {
    const result = await phongChieuService.detail(req.params.id);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await phongChieuService.create(req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await phongChieuService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await phongChieuService.remove(req.params.id);
    noContent(res);
  },

  generateSeats: async (req: Request, res: Response) => {
    const result = await phongChieuService.generateSeats(req.params.id, req.body);
    ok(res, result);
  }
};
