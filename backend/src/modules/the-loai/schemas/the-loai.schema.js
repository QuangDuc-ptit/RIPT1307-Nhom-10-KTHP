"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updateTheLoaiSchema = exports.createTheLoaiSchema = exports.listTheLoaiQuerySchema = void 0;
var zod_1 = require("zod");
exports.listTheLoaiQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().trim().optional().default(''),
});
exports.createTheLoaiSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    slug: zod_1.z.string().min(1).max(100),
});
exports.updateTheLoaiSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    slug: zod_1.z.string().min(1).max(100).optional(),
});
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.string().min(1) });
