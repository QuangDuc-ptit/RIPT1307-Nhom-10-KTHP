import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wrap async handler để tự đẩy lỗi vào errorHandler.
 *
 * Lý do: Express 4 không tự catch promise rejection trong async function.
 * Nếu không wrap, lỗi sẽ rớt vào unhandledRejection -> không trả về cho client.
 *
 * Cách dùng:
 *   router.get('/me', asyncHandler(async (req, res) => { ... }));
 */
export const asyncHandler =
  <T extends RequestHandler>(fn: T): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
