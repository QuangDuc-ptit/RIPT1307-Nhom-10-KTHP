import type { Request, Response } from 'express';
import { postsService } from '../services/bai-viet.service';
import { created, noContent, ok } from '@/utils/response';

export const postsController = {
  listPublic: async (req: Request, res: Response) => {
    const { page, pageSize, search } = req.query as any;
    const result = await postsService.listPublic({ page, pageSize, search });
    ok(res, result);
  },

  getBySlug: async (req: Request, res: Response) => {
    const result = await postsService.getBySlug(req.params.slug);
    ok(res, result);
  },

  getById: async (req: Request, res: Response) => {
    const result = await postsService.getById(req.params.id);
    ok(res, result);
  },

  listAdmin: async (req: Request, res: Response) => {
    const { page, pageSize, search, published } = req.query as any;
    const result = await postsService.listAdmin({ page, pageSize, search, published });
    ok(res, result);
  },

  detailAdmin: async (req: Request, res: Response) => {
    const result = await postsService.detailAdmin(req.params.id);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await postsService.create(req.user!.id, req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await postsService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await postsService.remove(req.params.id);
    noContent(res);
  },
};
