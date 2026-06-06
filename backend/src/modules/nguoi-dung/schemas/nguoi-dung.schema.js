"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updateUserSchema = exports.createUserSchema = exports.listQuerySchema = exports.updateMeSchema = void 0;
var zod_1 = require("zod");
exports.updateMeSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120).optional(),
    avatar: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
});
exports.listQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).default(1),
    pageSize: zod_1.z.coerce.number().int().min(1).max(100).default(10),
    search: zod_1.z.string().trim().optional().default(''),
    sort: zod_1.z.string().optional(),
});
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().min(1).max(120),
    password: zod_1.z.string().min(6).max(72),
    role: zod_1.z.enum(['USER', 'ADMIN']).default('USER'),
});
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(120).optional(),
    password: zod_1.z.string().min(6).max(72).optional(),
    role: zod_1.z.enum(['USER', 'ADMIN']).optional(),
});
exports.idParamSchema = zod_1.z.object({ id: zod_1.z.string().min(1) });
