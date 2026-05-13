import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { badRequest } from '@/utils/errors';

/**
 * Validate input bằng Zod. Trả 400 với chi tiết lỗi nếu fail.
 *
 * Cách dùng:
 *   router.post('/posts', validate({ body: createPostSchema }), handler)
 *
 * Sau khi validate, dữ liệu sạch nằm trong `req.body`, `req.query`, `req.params`.
 */
interface Schemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validate =
  (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) req.body = schemas.body.parse(req.body);
      if (schemas.query) req.query = schemas.query.parse(req.query) as any;
      if (schemas.params) req.params = schemas.params.parse(req.params) as any;
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return next(badRequest('Dữ liệu không hợp lệ', e.flatten()));
      }
      next(e);
    }
  };
