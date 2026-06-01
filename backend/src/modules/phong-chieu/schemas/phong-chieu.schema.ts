import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Tên phòng không được để trống'),
  cinemaId: z.string().cuid('ID rạp chiếu không hợp lệ'),
});

export const updateRoomSchema = z.object({
  name: z.string().min(1, 'Tên phòng không được để trống'),
});

export const idParamSchema = z.object({
  id: z.string().cuid('ID không hợp lệ'),
});

export const generateSeatsSchema = z.object({
  rowCount: z.number().int().min(1).max(26), // A-Z
  seatsPerRow: z.number().int().min(1).max(50),
  vipRows: z.array(z.string()).optional(),
  sweetboxRows: z.array(z.string()).optional(),
});
