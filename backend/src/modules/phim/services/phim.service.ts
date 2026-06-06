import { prisma } from '@/config/db';
import { notFound } from '@/utils/errors';
import type { MovieStatus } from '@prisma/client';

const toPublic = <T extends { createdAt: Date; updatedAt: Date }>(p: T) => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

export const phimService = {
  /* ----- Public: client xem danh sách phim ----- */
  async listPublic(params: {
    page: number;
    pageSize: number;
    search: string;
    locale: string;
    status?: string;
    genreId?: string;
    isActive?: boolean;
  }) {
    const { page, pageSize, search, locale, status, genreId, isActive } = params;

    const where: any = {
      isActive: isActive !== undefined ? isActive : true,
      ...(status ? { status: status as MovieStatus } : { status: 'PUBLISHED' }),
      ...(search
        ? {
            translations: {
              some: {
                locale,
                title: { contains: search, mode: 'insensitive' },
              },
            },
          }
        : {}),
      ...(genreId
        ? {
            genres: {
              some: { genreId },
            },
          }
        : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where,
        include: {
          translations: { where: { locale } },
          genres: { include: { genre: true } },
        },
        orderBy: { releaseDate: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.movie.count({ where }),
    ]);

    return {
      items: items.map((m) => {
        const t = m.translations[0];
        return {
          id: m.id,
          title: t?.title ?? m.title,
          overview: t?.overview ?? m.overview,
          poster: m.poster,
          backdrop: m.backdrop,
          duration: m.duration,
          releaseDate: m.releaseDate?.toISOString() ?? null,
          status: m.status,
          isActive: m.isActive,
          genres: m.genres.map((g) => ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug })),
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString(),
        };
      }),
      total,
      page,
      pageSize,
    };
  },

  async getById(id: string, locale = 'vi') {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        translations: true,
        genres: { include: { genre: true } },
      },
    });
    if (!movie || !movie.isActive) throw notFound('Không tìm thấy phim');

    const t = movie.translations.find((tr) => tr.locale === locale);
    return {
      id: movie.id,
      title: t?.title ?? movie.title,
      overview: t?.overview ?? movie.overview,
      poster: movie.poster,
      backdrop: movie.backdrop,
      duration: movie.duration,
      releaseDate: movie.releaseDate?.toISOString() ?? null,
      status: movie.status,
      isActive: movie.isActive,
      translations: movie.translations,
      genres: movie.genres.map((g) => ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug })),
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
    };
  },

  /* ----- Admin ----- */
  async listAdmin(params: {
    page: number;
    pageSize: number;
    search: string;
    locale: string;
    status?: string;
    genreId?: string;
    isActive?: boolean;
  }) {
    const { page, pageSize, search, locale, status, genreId, isActive } = params;

    const where: any = {
      ...(status ? { status: status as MovieStatus } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { translations: { some: { locale, title: { contains: search, mode: 'insensitive' } } } },
            ],
          }
        : {}),
      ...(genreId ? { genres: { some: { genreId } } } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.movie.findMany({
        where,
        include: {
          translations: true,
          genres: { include: { genre: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.movie.count({ where }),
    ]);

    return {
      items: items.map((m) => {
        const t = m.translations.find((tr) => tr.locale === locale);
        return {
          id: m.id,
          title: t?.title ?? m.title,
          overview: t?.overview ?? m.overview,
          poster: m.poster,
          backdrop: m.backdrop,
          duration: m.duration,
          releaseDate: m.releaseDate?.toISOString() ?? null,
          status: m.status,
          isActive: m.isActive,
          translations: m.translations,
          genres: m.genres.map((g) => ({ id: g.genre.id, name: g.genre.name, slug: g.genre.slug })),
          createdAt: m.createdAt.toISOString(),
          updatedAt: m.updatedAt.toISOString(),
        };
      }),
      total,
      page,
      pageSize,
    };
  },

  async detailAdmin(id: string) {
    return this.getById(id, 'vi');
  },

  async create(input: {
    title: string;
    poster?: string;
    backdrop?: string;
    overview?: string;
    duration?: number;
    releaseDate?: string;
    status?: MovieStatus;
    isActive?: boolean;
    translations: Array<{ locale: string; title: string; overview?: string }>;
    genreIds?: string[];
  }) {
    const { translations, genreIds, releaseDate, ...rest } = input;

    const movie = await prisma.movie.create({
      data: {
        ...rest,
        ...(releaseDate ? { releaseDate: new Date(releaseDate) } : {}),
        translations: {
          create: translations.map((t) => ({
            locale: t.locale,
            title: t.title,
            overview: t.overview ?? null,
          })),
        },
        genres: genreIds?.length
          ? {
              create: genreIds.map((genreId) => ({ genreId })),
            }
          : undefined,
      },
      include: {
        translations: true,
        genres: { include: { genre: true } },
      },
    });

    return toPublic(movie);
  },

  async update(
    id: string,
    input: {
      title?: string;
      poster?: string;
      backdrop?: string;
      overview?: string;
      duration?: number;
      releaseDate?: string;
      status?: MovieStatus;
      isActive?: boolean;
      translations?: Array<{ locale: string; title: string; overview?: string }>;
      genreIds?: string[];
    },
  ) {
    const existing = await prisma.movie.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy phim');

    const { translations, genreIds, releaseDate, ...rest } = input;

    const data: any = { ...rest };
    if (releaseDate !== undefined) data.releaseDate = releaseDate ? new Date(releaseDate) : null;

    const movie = await prisma.movie.update({
      where: { id },
      data: {
        ...data,
        ...(translations
          ? {
              translations: {
                upsert: translations.map((t) => ({
                  where: { movieId_locale: { movieId: id, locale: t.locale } },
                  create: { locale: t.locale, title: t.title, overview: t.overview ?? null },
                  update: { title: t.title, overview: t.overview ?? null },
                })),
              },
            }
          : {}),
        ...(genreIds !== undefined
          ? {
              genres: {
                deleteMany: {},
                ...(genreIds.length > 0
                  ? {
                      create: genreIds.map((genreId) => ({ genreId })),
                    }
                  : {}),
              },
            }
          : {}),
      },
      include: {
        translations: true,
        genres: { include: { genre: true } },
      },
    });

    return toPublic(movie);
  },

  async remove(id: string) {
    try {
      await prisma.movie.delete({ where: { id } });
    } catch {
      throw notFound('Không tìm thấy phim');
    }
  },
};
