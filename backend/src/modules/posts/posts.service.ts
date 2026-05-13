import slugify from 'slugify';
import { prisma } from '@/config/db';
import { notFound } from '@/utils/errors';

const authorSelect = { id: true, name: true, avatar: true } as const;

const toPublic = <T extends { createdAt: Date; updatedAt: Date }>(p: T) => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

/**
 * Tạo slug duy nhất từ title. Nếu trùng, thêm hậu tố random ngắn.
 */
const buildUniqueSlug = async (title: string, excludeId?: string) => {
  const base = slugify(title, { lower: true, strict: true, locale: 'vi' });
  let slug = base;
  let suffix = 0;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
    if (suffix > 50) {
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      return slug;
    }
  }
};

export const postsService = {
  /* ----- Public ----- */
  async listPublic(params: { page: number; pageSize: number; search: string }) {
    const { page, pageSize, search } = params;
    const where = {
      published: true,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { excerpt: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        include: { author: { select: authorSelect } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ]);
    return { items: items.map(toPublic), total, page, pageSize };
  },

  async getBySlug(slug: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: { author: { select: authorSelect } },
    });
    if (!post || !post.published) throw notFound('Không tìm thấy bài viết');
    return toPublic(post);
  },

  async getById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: authorSelect } },
    });
    if (!post || !post.published) throw notFound('Không tìm thấy bài viết');
    return toPublic(post);
  },

  /* ----- Admin ----- */
  async listAdmin(params: {
    page: number;
    pageSize: number;
    search: string;
    published?: boolean;
  }) {
    const { page, pageSize, search, published } = params;
    const where = {
      ...(typeof published === 'boolean' ? { published } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { excerpt: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        include: { author: { select: authorSelect } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ]);
    return { items: items.map(toPublic), total, page, pageSize };
  },

  async detailAdmin(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { author: { select: authorSelect } },
    });
    if (!post) throw notFound('Không tìm thấy bài viết');
    return toPublic(post);
  },

  async create(
    authorId: string,
    input: {
      title: string;
      content: string;
      excerpt?: string;
      coverImage?: string;
      published?: boolean;
    },
  ) {
    const slug = await buildUniqueSlug(input.title);
    const post = await prisma.post.create({
      data: {
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt || null,
        coverImage: input.coverImage || null,
        published: !!input.published,
        authorId,
      },
      include: { author: { select: authorSelect } },
    });
    return toPublic(post);
  },

  async update(
    id: string,
    input: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      published?: boolean;
    },
  ) {
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) throw notFound('Không tìm thấy bài viết');

    const data: any = {};
    if (input.title !== undefined && input.title !== existing.title) {
      data.title = input.title;
      data.slug = await buildUniqueSlug(input.title, id);
    }
    if (input.content !== undefined) data.content = input.content;
    if (input.excerpt !== undefined) data.excerpt = input.excerpt || null;
    if (input.coverImage !== undefined)
      data.coverImage = input.coverImage === '' ? null : input.coverImage;
    if (input.published !== undefined) data.published = input.published;

    const post = await prisma.post.update({
      where: { id },
      data,
      include: { author: { select: authorSelect } },
    });
    return toPublic(post);
  },

  async remove(id: string) {
    try {
      await prisma.post.delete({ where: { id } });
    } catch {
      throw notFound('Không tìm thấy bài viết');
    }
  },
};
