"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSeatsSchema = exports.idParamSchema = exports.updateRoomSchema = exports.createRoomSchema = void 0;
var zod_1 = require("zod");
exports.createRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tên phòng không được để trống'),
    cinemaId: zod_1.z.string().cuid('ID rạp chiếu không hợp lệ'),
});
exports.updateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Tên phòng không được để trống'),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('ID không hợp lệ'),
});
exports.generateSeatsSchema = zod_1.z.object({
    rowCount: zod_1.z.number().int().min(1).max(26), // A-Z
    seatsPerRow: zod_1.z.number().int().min(1).max(50),
    vipRows: zod_1.z.array(zod_1.z.string()).optional(),
    sweetboxRows: zod_1.z.array(zod_1.z.string()).optional(),
});
