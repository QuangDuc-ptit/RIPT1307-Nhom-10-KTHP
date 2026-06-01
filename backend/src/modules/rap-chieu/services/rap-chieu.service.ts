import { prisma } from '@/config/db';
import { notFound } from '@/utils/errors';

export const rapChieuService = {
  list: async () => {
    return prisma.cinema.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  detail: async (id: string) => {
    const cinema = await prisma.cinema.findUnique({
      where: { id },
      include: { rooms: true },
    });
    if (!cinema) throw notFound('Không tìm thấy rạp chiếu');
    return cinema;
  },

  create: async (data: { name: string; address: string }) => {
    return prisma.cinema.create({ data });
  },

  update: async (id: string, data: { name?: string; address?: string }) => {
    const existing = await prisma.cinema.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy rạp chiếu');
    return prisma.cinema.update({ where: { id }, data });
  },

  remove: async (id: string) => {
    const existing = await prisma.cinema.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy rạp chiếu');
    return prisma.cinema.delete({ where: { id } });
  }
};
