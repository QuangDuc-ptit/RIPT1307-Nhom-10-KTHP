import { z } from 'zod';

export const scanTicketSchema = z.object({
  token: z.string().min(1, 'Token soát vé không hợp lệ')
});
