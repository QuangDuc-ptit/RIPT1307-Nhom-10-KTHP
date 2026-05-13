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

/**
 * Quy ước trả về cho client: dạng public user (KHÔNG có passwordHash).
 */
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
  // Lưu refresh token vào DB để có thể revoke khi logout
  const expiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN));
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });
  return { accessToken, refreshToken };
};

export const authService = {
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

    // Phải còn tồn tại trong DB và chưa revoke
    const stored = await prisma.refreshToken.findUnique({
      where: { token: input.refreshToken },
    });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw unauthorized('Refresh token đã bị thu hồi hoặc hết hạn');
    }

    // Rotate: tạo mới + huỷ cũ (giảm rủi ro nếu refresh token bị lộ)
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });
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
    // Revoke toàn bộ refresh token cũ -> bắt đăng nhập lại trên các thiết bị khác
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
};
