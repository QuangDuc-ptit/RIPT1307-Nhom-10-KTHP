# 10 — Validation & Error Handling

## 1. Vì sao validate ở backend?

FE đã validate rồi, nhưng FE có thể bị:
- User tắt JS, dùng Postman gọi trực tiếp
- Attacker bypass logic
- Phiên bản FE cũ chưa update rule mới

→ **Backend là phòng tuyến cuối cùng**, validate lại MỌI input.

## 2. Zod schema

Đặt trong `src/modules/<entity>/<entity>.schema.ts`:

```ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional().default(''),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional().default(false),
});

// Tự sinh type TS
export type CreatePostInput = z.infer<typeof createPostSchema>;
```

→ Khi validate qua middleware, `req.body` sẽ có type chuẩn (sau khi cast).

## 3. Middleware validate

```ts
// middlewares/validate.ts
export const validate = (schemas) => (req, _res, next) => {
  try {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) req.query = schemas.query.parse(req.query);
    if (schemas.params) req.params = schemas.params.parse(req.params);
    next();
  } catch (e) {
    if (e instanceof ZodError) return next(badRequest('Dữ liệu không hợp lệ', e.flatten()));
    next(e);
  }
};
```

Dùng:
```ts
router.post('/posts', validate({ body: createPostSchema }), handler);
```

→ Vào tới `handler` thì `req.body` đã sạch.

## 4. Validate query (pagination, search)

```ts
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional().default(''),
});
```

`z.coerce.number()` — query string là string `"1"`, cần chuyển sang số tự động.

## 5. Throw lỗi từ service

Đừng `res.status(404).send(...)` trong service — service không biết về Express. Thay vào đó **throw `HttpError`**:

```ts
import { notFound, conflict } from '@/utils/errors';

const post = await prisma.post.findUnique({ where: { id } });
if (!post) throw notFound('Không tìm thấy bài viết');

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) throw conflict('Email đã tồn tại');
```

Error handler tập trung sẽ map sang HTTP response.

## 6. Error handler

```ts
// middlewares/errorHandler.ts
export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }
  console.error('[UNHANDLED]', err);
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: env.isProd ? 'Đã xảy ra lỗi' : err.message,
    },
  });
};
```

→ Đặt CUỐI CÙNG sau tất cả route trong `app.ts`.

⚠️ Production phải ẩn `err.message` thật vì có thể lộ thông tin internal (path file, query SQL).

## 7. Format response chuẩn

```json
// Thành công
{ "success": true, "data": { ... } }

// Lỗi
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": { "fieldErrors": { "email": ["Email không hợp lệ"] } }
  }
}
```

Helper trong `utils/response.ts`:
```ts
ok(res, data)          // 200
created(res, data)     // 201
noContent(res)         // 204
fail(res, 404, 'NOT_FOUND', 'Không tìm thấy')
```

## 8. Lỗi & status code chuẩn

| Status | Khi nào |
| --- | --- |
| 200 | OK |
| 201 | Tạo mới thành công |
| 204 | OK, không có body (vd DELETE) |
| 400 | Bad Request — input sai (validate) |
| 401 | Unauthorized — chưa đăng nhập / token sai |
| 403 | Forbidden — đã đăng nhập nhưng không đủ quyền |
| 404 | Not Found — resource không tồn tại |
| 409 | Conflict — vd email đã tồn tại |
| 422 | Unprocessable Entity — input hợp lệ format nhưng sai nghiệp vụ |
| 429 | Too Many Requests — rate limit |
| 500 | Internal Server Error — lỗi server |

→ Đừng trả 200 với `{ success: false }`. Phải dùng status đúng.

## 9. Validate ở FE — vẫn cần

FE validate để UX tốt hơn (hiện lỗi ngay khi user gõ, không cần đợi round-trip). Nhưng FE validate **không thay thế** BE validate.

→ Lặp logic: FE Antd rules + BE Zod schema. Có thể share schema (cùng dùng Zod cả 2 bên).
