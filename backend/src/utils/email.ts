import nodemailer from 'nodemailer';
import { env } from '@/config/env';

let transporter: nodemailer.Transporter | null = null;
if (env.SMTP_HOST && env.SMTP_PORT) {
  transporter = nodemailer.createTransport({
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

export const sendResetEmail = async (to: string, token: string) => {
  const url = `${env.FRONTEND_URL.replace(/\/$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}`;
  const subject = 'Đặt lại mật khẩu';
  const text = `Bạn yêu cầu đặt lại mật khẩu. Mở link sau để đặt lại: ${url}`;
  const html = `<p>Bạn yêu cầu đặt lại mật khẩu.</p><p>Nhấn vào liên kết để đặt lại: <a href="${url}">Đặt lại mật khẩu</a></p>`;

  if (!transporter) {
    // Dev fallback: log to console
    console.info('Send reset email (dev) to:', to);
    console.info('Subject:', subject);
    console.info('URL:', url);
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM || `no-reply@${new URL(env.FRONTEND_URL).hostname}`,
    to,
    subject,
    text,
    html,
  });
};
