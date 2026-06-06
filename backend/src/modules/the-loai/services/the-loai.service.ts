import slugify from 'slugify';
import { prisma } from '@/config/db';
import { notFound, conflict } from '@/utils/errors';

const toPublic = <T extends { createdAt: Date; updatedAt: Date }>(g: T) => ({
  ...g,
  createdAt: g.createdAt.toISOString(),
  updatedAt: g.updatedAt.toISOString(),
});

export const theLoaiService = {
  async list(params: { page: number; pageSize: number; search: string }) {
    const { page, pageSize, search } = params;
    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [items, total] = await prisma.$transaction([
      prisma.genre.findMany({
        where,
        include: { _count: { select: { movies: true } } },
        orderBy: { name: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.genre.count({ where }),
    ]);

    return {
      items: items.map((g) => ({
        ...toPublic(g),
        movieCount: g._count.movies,
      })),
      total,
      page,
      pageSize,
    };
  },

  async getById(id: string) {
    const genre = await prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { movies: true } } },
    });
    if (!genre) throw notFound('Không tìm thấy thể loại');
    return { ...toPublic(genre), movieCount: genre._count.movies };
  },

  async getBySlug(slug: string) {
    const genre = await prisma.genre.findUnique({
      where: { slug },
      include: { _count: { select: { movies: true } } },
    });
    if (!genre) throw notFound('Không tìm thấy thể loại');
    return { ...toPublic(genre), movieCount: genre._count.movies };
  },

  async create(input: { name: string; slug: string }) {
    const slugified = slugify(input.slug || input.name, { lower: true, strict: true, locale: 'vi' });

    const existingSlug = await prisma.genre.findUnique({ where: { slug: slugified } });
    if (existingSlug) throw conflict('Slug đã tồn tại');

    const existingName = await prisma.genre.findUnique({ where: { name: input.name } });
    if (existingName) throw conflict('Tên thể loại đã tồn tại');

    const genre = await prisma.genre.create({
      data: { name: input.name, slug: slugified },
    });
    return toPublic(genre);
  },

  async update(id: string, input: { name?: string; slug?: string }) {
    const existing = await prisma.genre.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy thể loại');

    const data: { name?: string; slug?: string } = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.slug !== undefined) {
      data.slug = slugify(input.slug, { lower: true, strict: true, locale: 'vi' });
      const conflictSlug = await prisma.genre.findUnique({ where: { slug: data.slug } });
      if (conflictSlug && conflictSlug.id !== id) throw conflict('Slug đã tồn tại');
    }

    const genre = await prisma.genre.update({ where: { id }, data });
    return toPublic(genre);
  },

  async remove(id: string) {
    try {
      await prisma.genre.delete({ where: { id } });
    } catch {
      throw notFound('Không tìm thấy thể loại');
    }
  },
};
