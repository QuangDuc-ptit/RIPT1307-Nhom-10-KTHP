import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().default(''),
  sort: z.string().optional(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  password: z.string().min(6).max(72),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  password: z.string().min(6).max(72).optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
