import type { Request, Response } from 'express';
import { theLoaiService } from '../services/the-loai.service';
import { created, noContent, ok } from '@/utils/response';

export const theLoaiController = {
  list: async (req: Request, res: Response) => {
    const { page, pageSize, search } = req.query as any;
    const result = await theLoaiService.list({ page, pageSize, search });
    ok(res, result);
  },

  getById: async (req: Request, res: Response) => {
    const result = await theLoaiService.getById(req.params.id);
    ok(res, result);
  },

  getBySlug: async (req: Request, res: Response) => {
    const result = await theLoaiService.getBySlug(req.params.slug);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await theLoaiService.create(req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await theLoaiService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await theLoaiService.remove(req.params.id);
    noContent(res);
  },
};
