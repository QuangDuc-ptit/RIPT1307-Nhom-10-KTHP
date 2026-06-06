"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentProviderSchema = exports.createBookingSchema = void 0;
var zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    showtimeId: zod_1.z.string().cuid('ID suất chiếu không hợp lệ'),
    showtimeSeatIds: zod_1.z.array(zod_1.z.string().cuid('ID ghế không hợp lệ')).min(1, 'Phải chọn ít nhất 1 ghế'),
    foods: zod_1.z.array(zod_1.z.object({
        foodId: zod_1.z.string().cuid('ID đồ ăn không hợp lệ'),
        quantity: zod_1.z.number().int().min(1)
    })).optional().default([])
});
exports.paymentProviderSchema = zod_1.z.object({
    provider: zod_1.z.enum(['VNPAY', 'MOMO'], { invalid_type_error: 'Cổng thanh toán không hợp lệ', required_error: 'Cổng thanh toán không hợp lệ' })
});
