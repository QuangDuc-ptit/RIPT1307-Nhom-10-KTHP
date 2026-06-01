import { z } from 'zod';

export const createCinemaSchema = z.object({
  name: z.string().min(1, 'Tên rạp không được để trống'),
  address: z.string().min(1, 'Địa chỉ không được để trống'),
});

export const updateCinemaSchema = createCinemaSchema.partial();

export const idParamSchema = z.object({
  id: z.string().cuid('ID không hợp lệ'),
});
