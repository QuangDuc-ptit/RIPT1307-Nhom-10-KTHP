import bcrypt from 'bcryptjs';
import { prisma } from '@/config/db';
import { env } from '@/config/env';
import { conflict, unauthorized } from '@/utils/errors';
import {
  parseDuration,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { admin } from '@/config/firebase';
import crypto from 'crypto';
import { signResetToken, verifyResetToken } from '@/utils/jwt';
import { sendResetEmail } from '@/utils/email';

const toPublicUser = (u: { id: string; email: string; name: string; role: 'USER' | 'ADMIN'; avatar: string | null; createdAt: Date }) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
  avatar: u.avatar,
  createdAt: u.createdAt.toISOString(),
});

const issueTokens = async (userId: string, role: 'USER' | 'ADMIN') => {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId, role });
  const expiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN));
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });
  return { accessToken, refreshToken };
};

export const xacThucService = {
  async register(input: { email: string; password: string; name: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw conflict('Email đã được sử dụng');

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: { email: input.email, passwordHash, name: input.name, role: 'USER' },
    });

    const tokens = await issueTokens(user.id, user.role);
    return { user: toPublicUser(user), ...tokens };
  },

  async socialLogin(input: { provider: string; idToken: string }) {
    if (input.provider !== 'google') throw unauthorized('Provider không hỗ trợ');

    let payload: any;
    try {
      payload = await admin.auth().verifyIdToken(input.idToken);
    } catch (e) {
      throw unauthorized('Token provider không hợp lệ');
    }

    const email: string | undefined = payload.email;
    const name: string | undefined = payload.name || payload.displayName;
    const avatar: string | undefined = payload.picture || payload.photoURL;

    if (!email) throw unauthorized('Provider token không chứa email');

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Tạo mật khẩu ngẫu nhiên vì trường passwordHash bắt buộc
      const random = crypto.randomBytes(16).toString('hex');
      const passwordHash = await bcrypt.hash(random, 10);
      user = await prisma.user.create({
        data: { email, name: name ?? email.split('@')[0], avatar, passwordHash, role: 'USER' },
      });
    } else {
      // Update tên/ảnh nếu chưa có
      const data: any = {};
      if (!user.name && name) data.name = name;
      if (!user.avatar && avatar) data.avatar = avatar;
      if (Object.keys(data).length) {
        user = await prisma.user.update({ where: { id: user.id }, data });
      }
    }

    const tokens = await issueTokens(user.id, user.role);
    return { user: toPublicUser(user), ...tokens };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw unauthorized('Email hoặc mật khẩu không đúng');

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw unauthorized('Email hoặc mật khẩu không đúng');

    const tokens = await issueTokens(user.id, user.role);
    return { user: toPublicUser(user), ...tokens };
  },

  async refresh(input: { refreshToken: string }) {
    let payload;
    try {
      payload = verifyRefreshToken(input.refreshToken);
    } catch {
      throw unauthorized('Refresh token không hợp lệ');
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: input.refreshToken } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw unauthorized('Refresh token đã bị thu hồi hoặc hết hạn');
    }

    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return issueTokens(payload.sub, payload.role);
  },

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    await prisma.refreshToken
      .updateMany({
        where: { token: refreshToken, revokedAt: null },
        data: { revokedAt: new Date() },
      })
      .catch(() => undefined);
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw unauthorized();
    return toPublicUser(user);
  },

  async changePassword(userId: string, input: { oldPassword: string; newPassword: string }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw unauthorized();
    const ok = await bcrypt.compare(input.oldPassword, user.passwordHash);
    if (!ok) throw unauthorized('Mật khẩu hiện tại không đúng');
    const newHash = await bcrypt.hash(input.newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
    await prisma.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  },

  async quenMatKhau(input: { email: string }) {
    // Luôn trả 204 để không tiết lộ email tồn tại hay không
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) return;

    // Tạo reset token
    const resetToken = signResetToken({ sub: user.id });
    // Gửi email (nếu SMTP không cấu hình, hàm sẽ log vào console)
    await sendResetEmail(user.email, resetToken).catch(() => undefined);
  },

  async datLaiMatKhau(input: { token: string; newPassword: string }) {
    let payload;
    try {
      payload = verifyResetToken(input.token);
    } catch {
      throw unauthorized('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw unauthorized('Người dùng không tồn tại');

    const newHash = await bcrypt.hash(input.newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

    // Revoke tất cả refresh tokens
    await prisma.refreshToken.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  },
};
