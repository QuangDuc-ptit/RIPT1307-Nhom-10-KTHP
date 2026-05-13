import type { Request, Response } from 'express';
import { usersService } from './users.service';
import { created, noContent, ok } from '@/utils/response';

export const usersController = {
  updateMe: async (req: Request, res: Response) => {
    const result = await usersService.updateMe(req.user!.id, req.body);
    ok(res, result);
  },

  list: async (req: Request, res: Response) => {
    const { page, pageSize, search } = req.query as any;
    const result = await usersService.list({ page, pageSize, search });
    ok(res, result);
  },

  detail: async (req: Request, res: Response) => {
    const result = await usersService.detail(req.params.id);
    ok(res, result);
  },

  create: async (req: Request, res: Response) => {
    const result = await usersService.create(req.body);
    created(res, result);
  },

  update: async (req: Request, res: Response) => {
    const result = await usersService.update(req.params.id, req.body);
    ok(res, result);
  },

  remove: async (req: Request, res: Response) => {
    await usersService.remove(req.params.id);
    noContent(res);
  },
};
