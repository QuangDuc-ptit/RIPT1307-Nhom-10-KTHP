import 'dotenv/config';
import { z } from 'zod';

/**
 * Validate biến môi trường lúc khởi động.
 * Nếu thiếu hoặc sai định dạng, app sẽ crash ngay -> phát hiện lỗi cấu hình sớm.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET phải >= 32 ký tự'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET phải >= 32 ký tự'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_RESET_SECRET: z.string().min(32).optional(),
  JWT_RESET_EXPIRES_IN: z.string().default('1h'),
  TICKET_SECRET: z.string().min(32, 'TICKET_SECRET phải >= 32 ký tự').default('ticket-secret-key-minimum-32-characters'),
  TICKET_EXPIRES_IN: z.string().default('2h'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  FIREBASE_SERVICE_ACCOUNT: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://localhost:5174'),
  PAYMENT_RETURN_URL: z.string().default('http://localhost:5173/payment/result'),
  PAYMENT_IPN_URL: z.string().default('http://localhost:4000/api/payments/ipn'),
  VNPAY_TMN_CODE: z.string().optional(),
  VNPAY_HASH_SECRET: z.string().optional(),
  VNPAY_BASE_URL: z.string().default('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
  MOMO_PARTNER_CODE: z.string().optional(),
  MOMO_ACCESS_KEY: z.string().optional(),
  MOMO_SECRET_KEY: z.string().optional(),
  MOMO_BASE_URL: z.string().default('https://test-payment.momo.vn/v2/gateway/api/create'),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  isProd: parsed.data.NODE_ENV === 'production',
};
