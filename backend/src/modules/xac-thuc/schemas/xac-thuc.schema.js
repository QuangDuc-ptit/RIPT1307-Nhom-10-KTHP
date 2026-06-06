"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.refreshSchema = exports.datLaiMatKhauSchema = exports.quenMatKhauSchema = exports.socialLoginSchema = exports.loginSchema = exports.registerSchema = void 0;
var zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(72),
    name: zod_1.z.string().min(1).max(120),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.socialLoginSchema = zod_1.z.object({
    provider: zod_1.z.string(),
    idToken: zod_1.z.string().min(1),
});
exports.quenMatKhauSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
});
exports.datLaiMatKhauSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6).max(72),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.changePasswordSchema = zod_1.z.object({
    oldPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(6).max(72),
});
