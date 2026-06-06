"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.giuGheSchema = void 0;
var zod_1 = require("zod");
exports.giuGheSchema = zod_1.z.object({
    showtimeSeatId: zod_1.z.string().cuid('ID không hợp lệ'),
    version: zod_1.z.number().int().min(1)
});
