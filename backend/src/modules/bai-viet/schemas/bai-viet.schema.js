"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugParamSchema = exports.idParamSchema = exports.updatePostSchema = exports.createPostSchema = exports.listQuerySchema = void 0;
var zod_1 = require("zod");
exports.listQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().trim().optional().default(''),
    published: zod_1.z.coerce.boolean().optional(),
    sort: zod_1.z.string().optional(),
});
exports.createPostSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(255),
    content: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().max(500).optional().default(''),
    coverImage: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    published: zod_1.z.boolean().optional().default(false),
});
exports.updatePostSchema = exports.createPostSchema.partial();
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.string().min(1) });
exports.slugParamSchema = zod_1.z.object({ slug: zod_1.z.string().min(1) });
