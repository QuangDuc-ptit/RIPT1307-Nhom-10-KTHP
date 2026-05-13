import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '@/utils/errors';
import { env } from '@/config/env';

/**
 * Error handler tập trung. Đặt CUỐI CÙNG sau tất cả route.
 *
 * - HttpError -> map sang status + code chuẩn
 * - Lỗi khác -> 500, ẩn chi tiết khi production
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  console.error('[UNHANDLED ERROR]', err);

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isProd
        ? 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau.'
        : (err as Error)?.message || 'Internal server error',
    },
  });
};

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { code: 'ROUTE_NOT_FOUND', message: 'Không tìm thấy endpoint' },
  });
};
