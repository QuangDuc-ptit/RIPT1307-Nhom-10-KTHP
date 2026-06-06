"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listShowtimeQuerySchema = exports.idParamSchema = exports.updateShowtimeSchema = exports.createShowtimeSchema = void 0;
var zod_1 = require("zod");
exports.createShowtimeSchema = zod_1.z.object({
    movieId: zod_1.z.string().cuid('ID phim không hợp lệ'),
    roomId: zod_1.z.string().cuid('ID phòng chiếu không hợp lệ'),
    startTime: zod_1.z.string().datetime('Thời gian bắt đầu không hợp lệ'),
});
exports.updateShowtimeSchema = zod_1.z.object({
    movieId: zod_1.z.string().cuid('ID phim không hợp lệ').optional(),
    roomId: zod_1.z.string().cuid('ID phòng chiếu không hợp lệ').optional(),
    startTime: zod_1.z.string().datetime('Thời gian bắt đầu không hợp lệ').optional(),
});
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('ID suất chiếu không hợp lệ'),
});
exports.listShowtimeQuerySchema = zod_1.z.object({
    movieId: zod_1.z.string().cuid('ID phim không hợp lệ').optional(),
    roomId: zod_1.z.string().cuid('ID phòng chiếu không hợp lệ').optional(),
    cinemaId: zod_1.z.string().cuid('ID rạp chiếu không hợp lệ').optional(),
});
