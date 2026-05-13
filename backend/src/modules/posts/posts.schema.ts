import { z } from 'zod';

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().default(''),
  published: z.coerce.boolean().optional(),
  sort: z.string().optional(),
});

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional().default(''),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

export const updatePostSchema = createPostSchema.partial();

export const idParamSchema = z.object({ id: z.string().min(1) });
export const slugParamSchema = z.object({ slug: z.string().min(1) });
