import bcrypt from 'bcryptjs';
import { prisma } from '@/config/db';
import { conflict, notFound } from '@/utils/errors';

const publicSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatar: true,
  createdAt: true,
} as const;

const toPublic = <T extends { createdAt: Date }>(u: T) => ({
  ...u,
  createdAt: u.createdAt.toISOString(),
});

export const usersService = {
  /**
   * Update profile của chính user đang đăng nhập.
   */
  async updateMe(userId: string, input: { name?: string; avatar?: string }) {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.avatar !== undefined
          ? { avatar: input.avatar === '' ? null : input.avatar }
          : {}),
      },
      select: publicSelect,
    });
    return toPublic(updated);
  },

  /* ---------- Admin endpoints ---------- */

  async list(params: { page: number; pageSize: number; search: string }) {
    const { page, pageSize, search } = params;
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : undefined;
    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: publicSelect,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.user.count({ where }),
    ]);
    return { items: items.map(toPublic), total, page, pageSize };
  },

  async detail(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: publicSelect });
    if (!user) throw notFound('Không tìm thấy người dùng');
    return toPublic(user);
  },

  async create(input: { email: string; name: string; password: string; role: 'USER' | 'ADMIN' }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw conflict('Email đã tồn tại');
    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
        role: input.role,
      },
      select: publicSelect,
    });
    return toPublic(user);
  },

  async update(
    id: string,
    input: { name?: string; password?: string; role?: 'USER' | 'ADMIN' },
  ) {
    const data: any = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.role !== undefined) data.role = input.role;
    if (input.password) {
      data.passwordHash = await bcrypt.hash(input.password, 10);
      await prisma.refreshToken.updateMany({
        where: { userId: id, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }

    try {
      const user = await prisma.user.update({ where: { id }, data, select: publicSelect });
      return toPublic(user);
    } catch {
      throw notFound('Không tìm thấy người dùng');
    }
  },

  async remove(id: string) {
    try {
      await prisma.user.delete({ where: { id } });
    } catch {
      throw notFound('Không tìm thấy người dùng');
    }
  },
};
