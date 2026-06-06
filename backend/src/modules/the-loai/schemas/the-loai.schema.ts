import { z } from 'zod';

export const listTheLoaiQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().default(''),
});

export const createTheLoaiSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
});

export const updateTheLoaiSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
