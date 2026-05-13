# Tài liệu học tập

Bộ tài liệu này dạy bạn **hiểu** code base — không chỉ "biết chạy".

## Lộ trình đọc

Đọc theo thứ tự để mỗi bài bổ trợ cho bài sau.

### Phần 1 — Frontend
1. **[01-frontend-architecture.md](./01-frontend-architecture.md)** — Cấu trúc thư mục, dòng chảy dữ liệu, layer vs feature
2. **[02-routing-and-auth.md](./02-routing-and-auth.md)** — React Router, Protected Route, JWT, axios interceptor, refresh token
3. **[03-state-management.md](./03-state-management.md)** — Zustand vs Redux, khi nào dùng store global, khi nào local state
4. **[04-api-layer.md](./04-api-layer.md)** — axios instance, error handling, debounce, abort, optimistic update
5. **[05-antd-and-forms.md](./05-antd-and-forms.md)** — Antd 5, ConfigProvider, Form validation, Table chuẩn, Modal Create/Edit chung
6. **[06-deployment.md](./06-deployment.md)** — Build, Vercel, Nginx, Docker, HTTPS

### Phần 2 — Backend
7. **[07-backend-architecture.md](./07-backend-architecture.md)** — Layered architecture, Route → Controller → Service, asyncHandler
8. **[08-database-prisma.md](./08-database-prisma.md)** — SQL cơ bản, Prisma schema, relation, migration, query
9. **[09-auth-jwt.md](./09-auth-jwt.md)** — bcrypt, JWT, access/refresh token, role check, OAuth
10. **[10-validation-error-handling.md](./10-validation-error-handling.md)** — Zod, middleware validate, HttpError, response chuẩn
11. **[11-backend-deployment.md](./11-backend-deployment.md)** — PM2, Docker, Nginx, healthcheck, monitoring, backup

## Mẹo học

- Đọc tài liệu **đồng thời mở code base** lên — đối chiếu từng đoạn.
- Sau mỗi phần, thử sửa nhỏ: thêm 1 field vào User, thêm 1 endpoint, thêm 1 page mới.
- Dùng `npx prisma studio` để xem DB trực quan khi đang test.
- Mở DevTools → Network → xem request/response thực tế.

## Khi gặp vấn đề

Trước khi search Google:
1. Đọc lại tài liệu liên quan
2. Xem code có chỗ nào tương tự không
3. Đọc kỹ error message (đừng bỏ qua)
4. In `console.log` để hiểu flow

Khi vẫn không ra, mới search — và search bằng error message chứ không phải "tại sao react không chạy".
