# Backend (Express + TS + Prisma + PostgreSQL)

## Yêu cầu
- Node.js >= 18
- PostgreSQL (có thể chạy nhanh bằng Docker: `docker compose up -d`)

## Cài đặt & chạy

```bash
cp .env.example .env             # sửa DATABASE_URL nếu cần
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed                     # tạo user mẫu + bài viết mẫu
npm run dev                      # http://localhost:4000/api
```

Sau seed:
- `admin@example.com / admin123` (ADMIN)
- `user@example.com  / user123`  (USER)

## Cấu trúc

```
src/
├── app.ts              # Tạo Express app, đăng ký middleware + route
├── server.ts           # Entry point: listen port, graceful shutdown
├── config/
│   ├── env.ts          # Validate biến môi trường bằng Zod
│   └── db.ts           # Prisma client (singleton)
├── middlewares/
│   ├── auth.ts         # requireAuth, requireRole
│   ├── validate.ts     # validate(body/query/params) bằng Zod
│   └── errorHandler.ts # Bắt mọi lỗi -> response chuẩn
├── modules/            # Mỗi feature 1 folder
│   ├── auth/           # register, login, refresh, logout, me, change-password
│   ├── users/          # /users/me + /admin/users CRUD
│   └── posts/          # /posts (public) + /admin/posts CRUD
├── utils/
│   ├── async.ts        # asyncHandler để catch lỗi trong async
│   ├── errors.ts       # HttpError + helpers (badRequest, notFound, ...)
│   ├── jwt.ts          # sign/verify access & refresh token
│   └── response.ts     # ok / created / fail / noContent
└── types/
```

## Endpoints

### Public auth (`/api/auth`)
| Method | Path                | Body                                | Mô tả |
| --- | --- | --- | --- |
| POST | `/auth/register`    | `{ email, password, name }`         | Đăng ký, trả tokens + user |
| POST | `/auth/login`       | `{ email, password }`               | Đăng nhập |
| POST | `/auth/refresh`     | `{ refreshToken }`                  | Cấp access token mới |
| POST | `/auth/logout`      | `{ refreshToken? }`                 | Revoke refresh token |
| GET  | `/auth/me`          | —                                   | Cần Bearer token |
| POST | `/auth/change-password` | `{ oldPassword, newPassword }`  | Cần Bearer token |

### Public posts (`/api/posts`)
| Method | Path | Mô tả |
| --- | --- | --- |
| GET | `/posts?page=1&pageSize=10&search=` | Danh sách bài đã publish |
| GET | `/posts/slug/:slug` | Chi tiết theo slug |
| GET | `/posts/:id` | Chi tiết theo id |

### User self (`/api/users`)
| Method | Path | Mô tả |
| --- | --- | --- |
| PATCH | `/users/me` | Cập nhật profile (name/avatar) |

### Admin (`/api/admin/*`) — yêu cầu role ADMIN
- `/admin/users` — CRUD user
- `/admin/posts` — CRUD post

## Cách thêm 1 module mới (ví dụ `comments`)

1. Cập nhật `prisma/schema.prisma`:
   ```prisma
   model Comment {
     id        String   @id @default(cuid())
     content   String
     postId    String
     post      Post     @relation(...)
     authorId  String
     author    User     @relation(...)
     createdAt DateTime @default(now())
   }
   ```
2. `npx prisma migrate dev --name add_comments`
3. Tạo folder `src/modules/comments/` với 4 file: `schema.ts`, `service.ts`, `controller.ts`, `route.ts` — copy y hệt cấu trúc `posts/`.
4. Mount route trong `src/app.ts`:
   ```ts
   import commentsRoutes from './modules/comments/comments.route';
   app.use('/api/comments', commentsRoutes);
   ```

## Định dạng response

Tất cả response đều bọc:

```json
// Thành công
{ "success": true, "data": ... }

// Lỗi
{ "success": false, "error": { "code": "NOT_FOUND", "message": "...", "details": {...} } }
```

Frontend đã có axios interceptor unwrap tự động.

## Production

```bash
npm run build           # tsc -> dist/
NODE_ENV=production npm start
# hoặc dùng Docker: docker build -t baseweb-backend .
```

Bắt buộc:
- Đổi JWT secrets sang chuỗi random dài >= 32 ký tự
- HTTPS qua reverse proxy (Nginx/Caddy)
- Backup DB định kỳ
- PM2 hoặc systemd để chạy nền, tự restart
