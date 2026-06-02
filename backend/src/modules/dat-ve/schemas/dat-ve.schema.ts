import { z } from 'zod';

export const giuGheSchema = z.object({
  showtimeSeatId: z.string().cuid('ID không hợp lệ'),
  version: z.number().int().min(1)
});
