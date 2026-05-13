import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type JwtPayload } from '@/utils/jwt';
import { forbidden, unauthorized } from '@/utils/errors';

/**
 * Gắn `req.user` nếu request có Bearer token hợp lệ. Nếu không có hoặc sai -> 401.
 *
 * Dùng cho route bắt buộc đăng nhập.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(unauthorized());
  }
  const token = header.slice('Bearer '.length);
  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = { id: decoded.sub, role: decoded.role } satisfies AuthUser;
    next();
  } catch {
    next(unauthorized('Token không hợp lệ hoặc đã hết hạn'));
  }
};

/**
 * Sau khi `requireAuth` đã chạy, kiểm tra role.
 */
export const requireRole =
  (...roles: JwtPayload['role'][]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;
    if (!user) return next(unauthorized());
    if (!roles.includes(user.role)) return next(forbidden());
    next();
  };

export interface AuthUser {
  id: string;
  role: JwtPayload['role'];
}

/**
 * Mở rộng kiểu Request để dùng `req.user` không bị lỗi TS.
 */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
