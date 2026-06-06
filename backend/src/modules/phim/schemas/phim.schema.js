"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updatePhimSchema = exports.createPhimSchema = exports.listPhimQuerySchema = void 0;
var zod_1 = require("zod");
exports.listPhimQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().trim().optional().default(''),
    locale: zod_1.z.string().optional().default('vi'),
    status: zod_1.z.string().optional(),
    genreId: zod_1.z.string().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    sort: zod_1.z.string().optional(),
});
exports.createPhimSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    poster: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    backdrop: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    overview: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().min(1).optional(),
    releaseDate: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
    isActive: zod_1.z.boolean().optional().default(true),
    translations: zod_1.z
        .array(zod_1.z.object({
        locale: zod_1.z.string().min(2).max(5),
        title: zod_1.z.string().min(1).max(255),
        overview: zod_1.z.string().optional(),
    }))
        .min(1),
    genreIds: zod_1.z.array(zod_1.z.string().min(1)).optional().default([]),
});
exports.updatePhimSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255).optional(),
    poster: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    backdrop: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    overview: zod_1.z.string().optional(),
    duration: zod_1.z.number().int().min(1).optional(),
    releaseDate: zod_1.z.string().datetime().optional(),
    status: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
    isActive: zod_1.z.boolean().optional(),
    translations: zod_1.z
        .array(zod_1.z.object({
        locale: zod_1.z.string().min(2).max(5),
        title: zod_1.z.string().min(1).max(255),
        overview: zod_1.z.string().optional(),
    }))
        .optional(),
    genreIds: zod_1.z.array(zod_1.z.string().min(1)).optional(),
});
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.string().min(1) });
