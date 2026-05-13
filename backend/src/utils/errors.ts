/**
 * Lớp lỗi tuỳ biến để service/controller dễ throw.
 * `errorHandler` sẽ map sang HTTP response chuẩn.
 *
 * Cách dùng:
 *   throw new HttpError(404, 'NOT_FOUND', 'Không tìm thấy bài viết');
 */
export class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const badRequest = (msg: string, details?: unknown) =>
  new HttpError(400, 'BAD_REQUEST', msg, details);

export const unauthorized = (msg = 'Cần đăng nhập') =>
  new HttpError(401, 'UNAUTHORIZED', msg);

export const forbidden = (msg = 'Không có quyền') =>
  new HttpError(403, 'FORBIDDEN', msg);

export const notFound = (msg = 'Không tìm thấy') => new HttpError(404, 'NOT_FOUND', msg);

export const conflict = (msg: string) => new HttpError(409, 'CONFLICT', msg);
