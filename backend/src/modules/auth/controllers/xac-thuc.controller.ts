import type { Request, Response } from 'express';
import { xacThucService } from '../services/xac-thuc.service';
import { created, noContent, ok } from '@/utils/response';

export const xacThucController = {
  register: async (req: Request, res: Response) => {
    const result = await xacThucService.register(req.body);
    created(res, result);
  },

  login: async (req: Request, res: Response) => {
    const result = await xacThucService.login(req.body);
    ok(res, result);
  },

  socialLogin: async (req: Request, res: Response) => {
    const result = await xacThucService.socialLogin(req.body);
    ok(res, result);
  },

  quenMatKhau: async (req: Request, res: Response) => {
    await xacThucService.quenMatKhau(req.body);
    res.status(204).send();
  },

  datLaiMatKhau: async (req: Request, res: Response) => {
    await xacThucService.datLaiMatKhau(req.body);
    res.status(204).send();
  },

  // Dev-only: send reset email preview without DB (only in non-prod)
  devSendReset: async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') return res.status(404).send();
    const { email } = req.body as { email: string };
    const result = await xacThucService.devSendReset(email);
    ok(res, result);
  },

  refresh: async (req: Request, res: Response) => {
    const tokens = await xacThucService.refresh(req.body);
    ok(res, tokens);
  },

  logout: async (req: Request, res: Response) => {
    await xacThucService.logout(req.body?.refreshToken);
    noContent(res);
  },

  me: async (req: Request, res: Response) => {
    const user = await xacThucService.me(req.user!.id);
    ok(res, user);
  },

  changePassword: async (req: Request, res: Response) => {
    await xacThucService.changePassword(req.user!.id, req.body);
    noContent(res);
  },
};
