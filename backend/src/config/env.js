"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
var zod_1 = require("zod");
/**
 * Validate biến môi trường lúc khởi động.
 * Nếu thiếu hoặc sai định dạng, app sẽ crash ngay -> phát hiện lỗi cấu hình sớm.
 */
var schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    JWT_ACCESS_SECRET: zod_1.z.string().min(32, 'JWT_ACCESS_SECRET phải >= 32 ký tự'),
    JWT_REFRESH_SECRET: zod_1.z.string().min(32, 'JWT_REFRESH_SECRET phải >= 32 ký tự'),
    JWT_ACCESS_EXPIRES_IN: zod_1.z.string().default('15m'),
    JWT_REFRESH_EXPIRES_IN: zod_1.z.string().default('7d'),
    JWT_RESET_SECRET: zod_1.z.string().min(32).optional(),
    JWT_RESET_EXPIRES_IN: zod_1.z.string().default('1h'),
    TICKET_SECRET: zod_1.z.string().min(32, 'TICKET_SECRET phải >= 32 ký tự').default('ticket-secret-key-minimum-32-characters'),
    TICKET_EXPIRES_IN: zod_1.z.string().default('2h'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    FIREBASE_SERVICE_ACCOUNT: zod_1.z.string().optional(),
    SMTP_HOST: zod_1.z.string().optional(),
    SMTP_PORT: zod_1.z.string().optional(),
    SMTP_USER: zod_1.z.string().optional(),
    SMTP_PASS: zod_1.z.string().optional(),
    EMAIL_FROM: zod_1.z.string().optional(),
    CORS_ORIGINS: zod_1.z.string().default('http://localhost:5173,http://localhost:5174'),
    PAYMENT_RETURN_URL: zod_1.z.string().default('http://localhost:5173/payment/result'),
    PAYMENT_IPN_URL: zod_1.z.string().default('http://localhost:4000/api/payments/ipn'),
    VNPAY_TMN_CODE: zod_1.z.string().optional(),
    VNPAY_HASH_SECRET: zod_1.z.string().optional(),
    VNPAY_BASE_URL: zod_1.z.string().default('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    MOMO_PARTNER_CODE: zod_1.z.string().optional(),
    MOMO_ACCESS_KEY: zod_1.z.string().optional(),
    MOMO_SECRET_KEY: zod_1.z.string().optional(),
    MOMO_BASE_URL: zod_1.z.string().default('https://test-payment.momo.vn/v2/gateway/api/create'),
});
var parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = __assign(__assign({}, parsed.data), { corsOrigins: parsed.data.CORS_ORIGINS.split(',')
        .map(function (s) { return s.trim(); })
        .filter(Boolean), isProd: parsed.data.NODE_ENV === 'production' });
