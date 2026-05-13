# 08 — Database + Prisma

## 1. SQL kiến thức tối thiểu

Bạn phải đọc được & viết được các câu sau:

```sql
SELECT id, name FROM users WHERE role = 'ADMIN' ORDER BY created_at DESC LIMIT 10;

INSERT INTO users (email, name) VALUES ('a@b.com', 'A');

UPDATE users SET name = 'B' WHERE id = 'xxx';

DELETE FROM users WHERE id = 'xxx';

-- JOIN: lấy post + tên author
SELECT p.title, u.name AS author
FROM posts p
JOIN users u ON u.id = p.author_id;
```

Khái niệm:
- **Primary key**: id duy nhất trong bảng
- **Foreign key**: chỉ tới id của bảng khác (vd `posts.author_id` → `users.id`)
- **Index**: cấu trúc giúp query nhanh trên column hay filter/sort
- **Transaction**: chuỗi câu lệnh, hoặc cùng thành công, hoặc cùng rollback

## 2. Quan hệ giữa bảng

| Loại | Ví dụ |
| --- | --- |
| 1-1 | user ↔ profile |
| 1-n | user → posts (1 user có nhiều post) |
| n-n | post ↔ tag (post có nhiều tag, tag thuộc nhiều post) — cần bảng nối |

Trong Prisma:
```prisma
model Post {
  id       String @id @default(cuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
  tags     Tag[]  @relation("PostTags")
}

model Tag {
  id    String @id @default(cuid())
  posts Post[] @relation("PostTags")
}
```

→ Prisma tự tạo bảng nối `_PostTags`.

## 3. Workflow Prisma chuẩn

```bash
# 1. Sửa schema.prisma
# 2. Tạo migration (chỉ dev)
npx prisma migrate dev --name add_comments_table

# 3. Production: apply migration đã sinh
npx prisma migrate deploy

# 4. Sau khi sửa schema, generate lại client để có type
npx prisma generate

# 5. Xem DB qua UI
npx prisma studio
```

⚠️ **KHÔNG tự sửa DB bằng tay** (chạy SQL trực tiếp) — schema và DB sẽ lệch nhau. Mọi thay đổi phải đi qua migration.

## 4. Query với Prisma

```ts
// SELECT
const user = await prisma.user.findUnique({ where: { email: 'a@b.com' } });

// JOIN qua include
const post = await prisma.post.findUnique({
  where: { id },
  include: { author: { select: { id: true, name: true } } },
});

// WHERE phức tạp
const posts = await prisma.post.findMany({
  where: {
    published: true,
    OR: [{ title: { contains: 'react', mode: 'insensitive' } }],
    createdAt: { gte: new Date('2025-01-01') },
  },
  orderBy: { createdAt: 'desc' },
  skip: 20,
  take: 10,
});

// INSERT
await prisma.user.create({ data: { email, name, passwordHash } });

// UPDATE
await prisma.user.update({ where: { id }, data: { name: 'New' } });

// DELETE (cẩn thận!)
await prisma.user.delete({ where: { id } });

// COUNT
const total = await prisma.user.count({ where: { role: 'ADMIN' } });

// TRANSACTION — vd đếm và lấy data 1 lần
const [items, total] = await prisma.$transaction([
  prisma.user.findMany({ take: 10 }),
  prisma.user.count(),
]);
```

## 5. Select vs Include

- **`select`**: chỉ chọn field cụ thể → trả về chính xác → an toàn không lộ field nhạy cảm
- **`include`**: thêm relation vào kết quả

Quy ước an toàn: dùng `select` để **NEVER** trả `passwordHash`:
```ts
const publicSelect = { id: true, email: true, name: true, role: true } as const;
prisma.user.findMany({ select: publicSelect });
```

(Đây là cách base này làm — xem `users.service.ts`.)

## 6. Index — khi nào cần?

Add `@@index` khi:
- Hay filter / sort theo column đó
- Bảng có > 10k row

Ví dụ trong base:
```prisma
@@index([published, createdAt])
@@index([authorId])
```

Đừng index bừa: mỗi index làm INSERT chậm hơn + tốn disk.

## 7. Seeding

`prisma/seed.ts` chạy bằng `npm run seed`. Mục đích:
- Tạo data mẫu cho dev (user admin, post mẫu)
- Tạo data mặc định cho production (vd: bảng `settings`)

Dùng `upsert` để chạy nhiều lần không lỗi.

## 8. Database trong production

- **Backup hàng ngày** (pg_dump → S3)
- **Connection pool**: Prisma mặc định OK, nhưng nếu deploy serverless, dùng `pgbouncer` hoặc `prisma accelerate`
- **Migration**: chỉ chạy `migrate deploy` (đã có file sẵn), KHÔNG chạy `migrate dev` trên prod
- **Đừng để credentials trong code**: dùng `DATABASE_URL` qua biến môi trường
