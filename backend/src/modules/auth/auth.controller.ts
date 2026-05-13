import type { Request, Response } from 'express';
import { authService } from './auth.service';
import { created, noContent, ok } from '@/utils/response';

/**
 * Controller chỉ làm:
 *  - lấy input từ req
 *  - gọi service
 *  - trả response
 *
 * Logic nghiệp vụ nằm hết trong service -> dễ test, dễ tái sử dụng.
 */
export const authController = {
  register: async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    created(res, result);
  },

  login: async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    ok(res, result);
  },

  refresh: async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body);
    ok(res, tokens);
  },

  logout: async (req: Request, res: Response) => {
    await authService.logout(req.body?.refreshToken);
    noContent(res);
  },

  me: async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    ok(res, user);
  },

  changePassword: async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body);
    noContent(res);
  },
};
