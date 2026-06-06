import { z } from 'zod';

export const createShowtimeSchema = z.object({
  movieId: z.string().cuid('ID phim không hợp lệ'),
  roomId: z.string().cuid('ID phòng chiếu không hợp lệ'),
  startTime: z.string().datetime('Thời gian bắt đầu không hợp lệ'),
});

export const updateShowtimeSchema = z.object({
  movieId: z.string().cuid('ID phim không hợp lệ').optional(),
  roomId: z.string().cuid('ID phòng chiếu không hợp lệ').optional(),
  startTime: z.string().datetime('Thời gian bắt đầu không hợp lệ').optional(),
});

export const idParamSchema = z.object({
  id: z.string().cuid('ID suất chiếu không hợp lệ'),
});

export const listShowtimeQuerySchema = z.object({
  movieId: z.string().cuid('ID phim không hợp lệ').optional(),
  roomId: z.string().cuid('ID phòng chiếu không hợp lệ').optional(),
  cinemaId: z.string().cuid('ID rạp chiếu không hợp lệ').optional(),
});
