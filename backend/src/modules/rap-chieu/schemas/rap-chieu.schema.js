"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParamSchema = exports.updateCinemaSchema = exports.createCinemaSchema = void 0;
var zod_1 = require("zod");
exports.createCinemaSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tên rạp không được để trống'),
    address: zod_1.z.string().min(1, 'Địa chỉ không được để trống'),
});
exports.updateCinemaSchema = exports.createCinemaSchema.partial();
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('ID không hợp lệ'),
});
