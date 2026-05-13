import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      name: 'Admin',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      name: 'Người dùng mẫu',
      role: Role.USER,
    },
  });

  console.log('✓ Users:', admin.email, user.email);

  const samplePosts = [
    {
      title: 'Chào mừng đến với Base Web',
      content:
        'Đây là bài viết mẫu đầu tiên. Bạn có thể chỉnh sửa hoặc xoá nó từ trang admin.\n\nBase Web được thiết kế để giúp bạn khởi động dự án thật nhanh.',
      excerpt: 'Bài viết chào mừng người dùng mới của Base Web.',
      published: true,
    },
    {
      title: 'Hướng dẫn cài đặt dự án',
      content:
        'Bước 1: clone repo.\nBước 2: cài deps.\nBước 3: chạy `npm run dev`.\nBước 4: mở trình duyệt.',
      excerpt: 'Cách bắt đầu dự án trong 4 bước.',
      published: true,
    },
    {
      title: 'Bài viết nháp (chưa xuất bản)',
      content: 'Bài này chưa public, sẽ không hiện ở trang client.',
      excerpt: '',
      published: false,
    },
  ];

  for (const p of samplePosts) {
    const slug = slugify(p.title, { lower: true, strict: true, locale: 'vi' });
    await prisma.post.upsert({
      where: { slug },
      update: {},
      create: { ...p, slug, authorId: admin.id },
    });
  }

  console.log('✓ Posts seeded');
  console.log('\nĐăng nhập với:');
  console.log('  admin@example.com / admin123  (ADMIN)');
  console.log('  user@example.com  / user123   (USER)\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
