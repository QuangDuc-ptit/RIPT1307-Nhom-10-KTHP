# 07 — Backend Architecture

## 1. Kiến trúc layered

Mỗi module gồm 4 layer:

```
Route       ── nhận HTTP, gắn middleware (auth, validate)
  ↓
Controller  ── parse req, gọi service, trả response
  ↓
Service     ── logic nghiệp vụ, gọi DB, throw HttpError
  ↓
Prisma      ── ORM, query DB
```

Lý do tách:
- **Route** chỉ biết URL + middleware → dễ thấy "đường vào" của API.
- **Controller** chỉ "translate" giữa HTTP và service. Mỏng, không có if-else nghiệp vụ.
- **Service** là nơi đặt logic. **TEST chỉ cần unit test service**, không cần spin up server.
- **Prisma** đóng gói access DB.

→ Mỗi class/file có 1 trách nhiệm duy nhất (SRP).

## 2. Đọc code mẫu

```ts
// posts.route.ts
router.post('/', validate({ body: createPostSchema }), asyncHandler(postsController.create));

// posts.controller.ts
create: async (req, res) => {
  const result = await postsService.create(req.user!.id, req.body);
  created(res, result);
};

// posts.service.ts
async create(authorId, input) {
  const slug = await buildUniqueSlug(input.title);
  const post = await prisma.post.create({ data: { ...input, slug, authorId } });
  return toPublic(post);
}
```

**Controller mỏng, service dày**.

## 3. asyncHandler — vì sao cần?

Express 4 không tự catch promise rejection:

```ts
router.get('/x', async (req, res) => {
  throw new Error('oops'); // <-- KHÔNG về client, treo request, server vẫn chạy
});
```

→ Phải wrap mỗi async handler:
```ts
router.get('/x', asyncHandler(async (req, res) => { ... }));
```
→ Lỗi tự đi vào `errorHandler`.

(Express 5 sẽ tự catch — nhưng hiện tại đa số dự án vẫn dùng 4.)

## 4. Error handler tập trung

```ts
app.use(errorHandler);  // ĐẶT CUỐI CÙNG
```

Mọi `next(err)` hoặc throw trong asyncHandler đều rơi vào đây:
- `HttpError` → map sang status + code chuẩn
- Lỗi khác → 500 (production thì ẩn message thật)

Lợi: 1 chỗ duy nhất format lỗi → response luôn nhất quán.

## 5. Module structure

```
src/modules/<entity>/
├── <entity>.route.ts       # Router + middleware + asyncHandler
├── <entity>.controller.ts  # Lấy req, gọi service, trả res
├── <entity>.service.ts     # Logic nghiệp vụ
└── <entity>.schema.ts      # Zod schemas (body/query/params)
```

Khi cần thêm:
- `<entity>.repository.ts` — tách Prisma query khỏi service (cho dự án lớn)
- `<entity>.event.ts` — event listener (post created → gửi notification)

## 6. Tách public vs admin

Quy ước trong base:
- `/api/posts` — public, không cần auth
- `/api/admin/posts` — chỉ ADMIN

→ Trong `posts.route.ts`, export 2 router:
```ts
const publicRouter = Router();
export const adminPostsRouter = Router();
adminPostsRouter.use(requireAuth, requireRole('ADMIN'));

export default publicRouter;
```

`app.ts` mount:
```ts
app.use('/api/posts', postsRoutes);
app.use('/api/admin/posts', adminPostsRouter);
```

## 7. Nguyên tắc bảo mật cơ bản

| Việc | Tại sao |
| --- | --- |
| Validate input ở backend | FE có thể bị bypass |
| Hash mật khẩu bằng bcrypt cost >= 10 | Chống brute force |
| Dùng prepared statement (Prisma làm sẵn) | Chống SQL injection |
| `helmet` middleware | Set security headers (X-Frame, CSP, ...) |
| CORS whitelist origin | Chống abuse từ domain lạ |
| Rate limit (chưa có sẵn) | Chống brute force login |
| Log audit | Truy vết khi có sự cố |

→ Nên thêm `express-rate-limit` cho `/auth/login`:
```ts
import rateLimit from 'express-rate-limit';
app.use('/api/auth/login', rateLimit({ windowMs: 60_000, max: 5 }));
```

## 8. Logging

Dev: `morgan('dev')` đã có sẵn.

Production: nên dùng `pino` (nhanh, JSON log) + chuyển ra file:
```ts
import pino from 'pino';
const logger = pino({ level: 'info' });
logger.info({ userId, action: 'login' }, 'user logged in');
```

Tránh `console.log` rải rác — không có level, không có context.
