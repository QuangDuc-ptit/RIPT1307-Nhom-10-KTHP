# Admin Panel

Trang quản trị. Stack giống `client/` nhưng có sidebar + CRUD mẫu.

## Chạy

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:5174
```

Đăng nhập với tài khoản ADMIN do backend seed (`admin@example.com / admin123`).

## Cấu trúc đặc biệt so với client

- `src/config/menu.tsx` — menu sidebar, hỗ trợ filter theo role
- `src/layouts/AdminLayout.tsx` — layout 2 cột (sidebar + nội dung), collapsible
- `src/pages/users/`, `src/pages/posts/` — **mẫu CRUD chuẩn** (Table + Modal + Pagination + Search)
- `src/pages/ForbiddenPage.tsx` — 403 cho user không phải ADMIN

## Pattern CRUD chuẩn (làm theo cho mọi entity mới)

1. **Type**: thêm `src/types/index.ts`
2. **API**: tạo `src/api/<entity>.ts` với `list/detail/create/update/remove`
3. **Page**: tạo folder `src/pages/<entity>/`:
   - `<Entity>Page.tsx` — Table + filter + pagination + nút Thêm/Sửa/Xoá
   - `<Entity>FormModal.tsx` — Modal dùng chung cho Create/Edit
4. **Menu**: thêm vào `src/config/menu.tsx`
5. **Route**: đăng ký trong `src/routes/index.tsx`
6. **Backend**: phải có endpoint tương ứng (xem `../../backend/src/modules/`)

Pattern này tránh duplicate code và dễ scale.

## Phân quyền

- Bảo vệ route bằng `<ProtectedRoute requiredRole="ADMIN" />`
- Menu tự ẩn item nếu thiếu role (xem `filterMenuByRole`)
- Backend cũng kiểm tra role qua middleware `requireAdmin` — **không tin frontend**

## Build production

```bash
npm run build
# output: dist/
# Deploy lên Nginx, Vercel, hoặc Docker (xem docs/06-deployment.md)
```
