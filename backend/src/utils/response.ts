import type { Response } from 'express';

/**
 * Helper trả về response theo format chuẩn:
 *   - thành công: { success: true, data }
 *   - thất bại:   { success: false, error: { code, message, details? } }
 *
 * Lý do dùng format này:
 *   - frontend luôn biết chỗ nào là data, chỗ nào là error
 *   - axios interceptor unwrap tự động (xem client/admin)
 */
export const ok = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({ success: true, data });

export const created = <T>(res: Response, data: T) => ok(res, data, 201);

export const noContent = (res: Response) => res.status(204).send();

export const fail = (
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) => res.status(status).json({ success: false, error: { code, message, details } });
