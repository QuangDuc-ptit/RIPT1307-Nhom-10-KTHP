import type { Request, Response } from 'express';
import { phimService } from '../services/phim.service';
import { created, noContent, ok } from '@/utils/response';

export const phimController = {
  listPublic: async (req: Request, res: Response) => {
    const { page, pageSize, search, locale, status, genreId, isActive } = req.query as any;
    const result = await phimService.listPublic({ page, pageSize, search, locale, status, genreId, isActive });
    ok(res, result);
  },

  getById: async (req: Request, res: Response) => {
    const { locale } = req.query as any;
    const result = await phimService.getById(req.params.id, locale);
    ok(res, result);
  },

  listAdmin: async (req: Request, res: Response) => {
    const { page, pageSize, search, locale, status, genreId, isActive } = req.query as any;
    const result = await phimService.listAdmin({ page, pageSize, search, locale, status, genreId, isActive });
    ok(res, result);
  },

  detailAdmin: async (req: Request, res: Response) => {
    const result = await phimService.detailAdmin(req.params.id);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await phimService.create(req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await phimService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await phimService.remove(req.params.id);
    noContent(res);
  },
};
