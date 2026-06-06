"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIpnSchema = exports.createPaymentSchema = void 0;
var zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    bookingId: zod_1.z.string().cuid('ID đơn hàng không hợp lệ'),
    provider: zod_1.z.enum(['VNPAY', 'MOMO'], { invalid_type_error: 'Cổng thanh toán không hợp lệ', required_error: 'Cổng thanh toán không hợp lệ' }),
});
exports.paymentIpnSchema = zod_1.z.object({
    provider: zod_1.z.enum(['VNPAY', 'MOMO'], { invalid_type_error: 'Cổng thanh toán không hợp lệ', required_error: 'Cổng thanh toán không hợp lệ' }),
    requestId: zod_1.z.string().min(1, 'Thiếu requestId'),
    providerRef: zod_1.z.string().min(1).optional(),
    responseCode: zod_1.z.string().min(1).optional(),
    resultCode: zod_1.z.string().min(1).optional(),
    amount: zod_1.z.coerce.number().nonnegative().optional(),
    success: zod_1.z.coerce.boolean().optional(),
});
