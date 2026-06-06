import { z } from 'zod';

export const listPhimQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().default(''),
  locale: z.string().optional().default('vi'),
  status: z.string().optional(),
  genreId: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sort: z.string().optional(),
});

export const createPhimSchema = z.object({
  title: z.string().min(1).max(255),
  poster: z.string().url().optional().or(z.literal('')),
  backdrop: z.string().url().optional().or(z.literal('')),
  overview: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  releaseDate: z.string().datetime().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isActive: z.boolean().optional().default(true),
  translations: z
    .array(
      z.object({
        locale: z.string().min(2).max(5),
        title: z.string().min(1).max(255),
        overview: z.string().optional(),
      }),
    )
    .min(1),
  genreIds: z.array(z.string().min(1)).optional().default([]),
});

export const updatePhimSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  poster: z.string().url().optional().or(z.literal('')),
  backdrop: z.string().url().optional().or(z.literal('')),
  overview: z.string().optional(),
  duration: z.number().int().min(1).optional(),
  releaseDate: z.string().datetime().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  isActive: z.boolean().optional(),
  translations: z
    .array(
      z.object({
        locale: z.string().min(2).max(5),
        title: z.string().min(1).max(255),
        overview: z.string().optional(),
      }),
    )
    .optional(),
  genreIds: z.array(z.string().min(1)).optional(),
});

export const idParamSchema = z.object({ id: z.string().min(1) });
