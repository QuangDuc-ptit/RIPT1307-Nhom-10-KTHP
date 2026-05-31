import nodemailer from 'nodemailer';
import { env } from '@/config/env';

let transporter: nodemailer.Transporter | null = null;

const createTransporterFromEnv = () => {
  if (env.SMTP_HOST && env.SMTP_PORT) {
    return nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT),
      auth: env.SMTP_USER
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
          }
        : undefined,
    });
  }
  return null;
};

const ensureTransporter = async () => {
  if (transporter) return transporter;
  transporter = createTransporterFromEnv();
  if (transporter) return transporter;

  // Create Ethereal test account when no SMTP configured (dev only)
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
};

export const sendResetEmail = async (to: string, token: string) => {
  const url = `${env.FRONTEND_URL.replace(/\/$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const subject = 'Đặt lại mật khẩu';
  const text = `Bạn yêu cầu đặt lại mật khẩu. Mở link sau để đặt lại: ${url}`;
  const html = `<p>Bạn yêu cầu đặt lại mật khẩu.</p><p>Nhấn vào liên kết để đặt lại: <a href="${url}">Đặt lại mật khẩu</a></p>`;

  const t = await ensureTransporter();
  const info = await t.sendMail({
    from: env.EMAIL_FROM || `no-reply@${new URL(env.FRONTEND_URL).hostname}`,
    to,
    subject,
    text,
    html,
  });

  // If using Ethereal, provide preview URL in logs
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.info('Preview URL:', preview);
};
