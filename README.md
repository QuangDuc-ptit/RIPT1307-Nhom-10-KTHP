# Base Web — Frontend (Client + Admin) + Backend

Đây là một bộ **base web full-stack** sẵn sàng dùng để triển khai dự án thực tế, được tách thành 2 nhóm rõ ràng:

```
base-web/
├── frontend/              # FRONTEND (web hiển thị cho người dùng)
│   ├── client/            #   ├── Trang cho người dùng cuối (public + user dashboard)
│   └── admin/             #   └── Trang quản trị (admin panel)
├── backend/               # BACKEND (API server REST)
└── docs/                  # Tài liệu học tập & hướng dẫn
```

> Base này được thiết kế lại từ `base-web-umi` (Umi 3 + Antd 4) thành stack hiện đại hơn:
> **Vite + React 18 + TypeScript + Antd 5 + Zustand + Axios** cho frontend, và
> **Node.js + Express + TypeScript + Prisma + PostgreSQL** cho backend.

## Vì sao chia frontend làm 2 app (client + admin)?

Đây là pattern chuẩn cho web có cả phần public + admin:
- **Bundle nhỏ cho user** — họ không phải tải code admin
- **Deploy 2 domain riêng** — `example.com` (client) và `admin.example.com` (admin)
- **Bảo mật tốt hơn** — admin có thể chặn IP, đặt sau VPN, không lộ qua URL công khai
- **Team chia rõ** — nhóm làm client và nhóm làm admin không xung đột code

Cả 2 app dùng chung stack và cấu trúc → học 1 lần dùng được cả 2. Xem chi tiết ở [`frontend/README.md`](./frontend/README.md).

---

## 1. Mục tiêu của base này

- **Tách bạch rõ ràng** giữa frontend của người dùng (`client`) và frontend quản trị (`admin`). Hai app này chạy độc lập, deploy độc lập, có thể dùng chung 1 backend.
- **Code dễ đọc, dễ mở rộng**: cấu trúc thư mục theo "feature" (mỗi tính năng có folder riêng gồm API, page, store, type).
- **Có sẵn các phần khó**: routing có bảo vệ, auth bằng JWT, axios interceptor (tự gắn token, tự refresh), state management, layout có sidebar/header, error boundary, form validation, gọi API mẫu, phân quyền (RBAC).
- **Có backend mẫu** để bạn không phải tự dựng server từ đầu — chỉ cần `npm install`, chạy migration, là có API hoàn chỉnh.

---

## 2. Bắt đầu nhanh (Quick start)

### Yêu cầu
- Node.js >= 18
- pnpm hoặc npm (khuyến nghị **pnpm** vì nhanh hơn)
- PostgreSQL 14+ (có thể chạy bằng Docker)

### Cài đặt

```bash
# 1. Backend (terminal 1)
cd backend
cp .env.example .env       # sửa DATABASE_URL theo DB của bạn
docker compose up -d       # khởi Postgres (nếu chưa có DB sẵn)
npm install
npx prisma migrate dev     # tạo bảng trong DB
npm run seed               # tạo user mẫu (admin/admin123, user/user123)
npm run dev                # http://localhost:4000

# 2. Client (terminal 2)
cd frontend/client
cp .env.example .env
npm install
npm run dev                # http://localhost:5173

# 3. Admin (terminal 3)
cd frontend/admin
cp .env.example .env
npm install
npm run dev                # http://localhost:5174
```

---

## 3. Lộ trình học (rất quan trọng đọc kỹ)

Mục tiêu là sau khi đọc và làm theo các tài liệu dưới, bạn **hiểu** chứ không chỉ "copy code".

### Bước 1 — Nền tảng (phải nắm chắc trước khi đụng base)

| Chủ đề | Bạn cần hiểu | Tài liệu |
|---|---|---|
| JavaScript ES6+ | `let/const`, arrow function, destructuring, spread, async/await, Promise, modules | [MDN JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |
| TypeScript | type/interface, generic, union, type narrowing, utility types (Partial, Pick, Omit) | [TS Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) |
| React | function component, hooks (`useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`), props, children, key, controlled input | [react.dev](https://react.dev/learn) |
| HTTP & REST | request/response, status code, header, JSON body, GET/POST/PUT/DELETE, query vs body, CORS | [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) |
| Cấu trúc dự án | tại sao chia folder theo feature/layer, import alias `@/`, lazy loading | đọc `docs/01-frontend-architecture.md` |

### Bước 2 — Frontend (đọc song song với code)

Mở `docs/` và đọc theo thứ tự:

1. **`docs/01-frontend-architecture.md`** — Cấu trúc thư mục, dòng chảy dữ liệu, vì sao thiết kế như vậy.
2. **`docs/02-routing-and-auth.md`** — Cách routing hoạt động, protected route, lưu token, refresh token.
3. **`docs/03-state-management.md`** — Zustand là gì, khi nào dùng store global vs `useState` cục bộ.
4. **`docs/04-api-layer.md`** — Axios instance, interceptor, error handling, gọi API có loading state.
5. **`docs/05-antd-and-forms.md`** — Antd 5 cơ bản, Form với validation, Table có pagination/filter/sort.
6. **`docs/06-deployment.md`** — Build, biến môi trường, deploy lên Vercel/Nginx/Docker.

### Bước 3 — Backend

7. **`docs/07-backend-architecture.md`** — Kiến trúc layered (route → controller → service → repository), tách trách nhiệm.
8. **`docs/08-database-prisma.md`** — Prisma ORM, schema, migration, query, relation.
9. **`docs/09-auth-jwt.md`** — Cách backend sinh JWT, verify, middleware, bcrypt mật khẩu, refresh token.
10. **`docs/10-validation-error-handling.md`** — Zod để validate input, error handler tập trung, format response chuẩn.
11. **`docs/11-backend-deployment.md`** — Deploy bằng Docker, PM2, biến môi trường production.

### Bước 4 — Kiến thức nâng cao (sau khi đã làm chủ base)

- **Testing**: Vitest + React Testing Library (frontend), Jest + Supertest (backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry, log file, healthcheck
- **Performance**: code splitting, memoization, DB index, caching (Redis)
- **Security**: CSRF, XSS, SQL injection, rate limit, helmet
- **Realtime**: Socket.IO (cho chat/notification)

---

## 4. Bạn cần học gì về Backend cho web?

Nếu bạn mới chỉ làm frontend, đây là checklist **TỐI THIỂU** cần hiểu để build full-stack được:

### 4.1. Khái niệm cốt lõi
- [ ] **Server vs Client**: ai chạy ở đâu, vì sao không thể chỉ dùng frontend
- [ ] **API REST**: endpoint, resource, method, status code (200, 201, 400, 401, 403, 404, 500)
- [ ] **JSON**: format dữ liệu trao đổi
- [ ] **CORS**: vì sao bị chặn khi frontend khác origin với backend
- [ ] **Cookie vs LocalStorage vs SessionStorage**: lưu token ở đâu cho an toàn
- [ ] **HTTPS**: vì sao bắt buộc trên production

### 4.2. Node.js & Express
- [ ] Event loop là gì, vì sao Node.js single-thread mà vẫn nhanh
- [ ] `npm`/`pnpm`, `package.json`, `node_modules`
- [ ] Express: `app.use`, `app.get/post`, middleware, `req/res/next`
- [ ] Async/await trong route handler, try/catch

### 4.3. Database (PostgreSQL + Prisma)
- [ ] SQL cơ bản: SELECT, INSERT, UPDATE, DELETE, JOIN
- [ ] Quan hệ: 1-1, 1-n, n-n, foreign key
- [ ] Index để query nhanh
- [ ] Migration: vì sao không tự sửa DB thủ công
- [ ] Prisma schema, generate client, query, relation include

### 4.4. Authentication & Authorization
- [ ] Hash mật khẩu bằng **bcrypt** (KHÔNG BAO GIỜ lưu plaintext)
- [ ] JWT: cấu trúc (header.payload.signature), sign, verify, hết hạn
- [ ] Access token vs Refresh token
- [ ] Middleware bảo vệ route, lấy `req.user` từ token
- [ ] RBAC (Role-Based Access Control): admin/user, kiểm tra quyền

### 4.5. Validation & Error
- [ ] Validate input ở **backend** (không tin frontend)
- [ ] Zod hoặc Joi để định nghĩa schema
- [ ] Error handler tập trung, format response chuẩn `{ success, data, error }`

### 4.6. Deployment
- [ ] Biến môi trường (`.env`), khác nhau giữa dev/staging/prod
- [ ] Docker cơ bản (Dockerfile, docker-compose)
- [ ] PM2 hoặc systemd để chạy Node liên tục
- [ ] Nginx reverse proxy
- [ ] Backup DB

---

## 5. Bạn cần học gì về Frontend base này?

### 5.1. Stack & lý do chọn
- [ ] **Vite**: build tool nhanh hơn Webpack/CRA. Hiểu `vite.config.ts`, alias `@/`, biến `VITE_*`
- [ ] **React 18**: function component, hooks, `<StrictMode>`, Suspense
- [ ] **TypeScript**: type, interface, generic, ép kiểu safely
- [ ] **React Router v6**: `<Routes>`, `<Route>`, `Outlet`, `useNavigate`, `useParams`, nested routes, protected route
- [ ] **Antd 5**: ConfigProvider, theme tokens, Form, Table, Modal, message, notification
- [ ] **Zustand**: store đơn giản hơn Redux, không cần boilerplate
- [ ] **Axios**: instance, interceptor, hủy request, FormData upload

### 5.2. Kiến trúc trong base
- [ ] Tại sao tách `api/`, `store/`, `pages/`, `components/`, `layouts/`?
- [ ] Khác biệt **page** (1 route) vs **component** (tái sử dụng)?
- [ ] Khi nào tạo custom hook (`hooks/`)?
- [ ] Layout là gì, vì sao có `PublicLayout`, `UserLayout`, `AdminLayout`?
- [ ] Protected route hoạt động ra sao (kiểm tra token + role)?

### 5.3. Pattern hay dùng
- [ ] Form handling với Antd Form + validate
- [ ] Table có pagination/sort/filter từ server
- [ ] Modal CRUD (Create/Edit chung 1 form)
- [ ] Upload file lên backend
- [ ] Hiển thị loading skeleton thay vì spinner
- [ ] Toast/message khi success/error
- [ ] Optimistic update

### 5.4. Tránh các sai lầm hay gặp
- Đặt logic gọi API trực tiếp trong component → tách ra `api/` hoặc custom hook
- Lưu access token trong Redux/Zustand mà không persist → reload là mất → dùng localStorage (có lưu ý XSS)
- Quên `key` khi map list → React warning + bug
- Không clean up trong `useEffect` (subscribe socket, timer) → memory leak
- Gọi API trong render → infinite loop
- Truyền function inline làm prop quá nhiều → re-render → dùng `useCallback` đúng chỗ (không phải bừa bãi)

---

## 6. Cấu trúc tổng quan

```
base-web/
├── frontend/                            # === FRONTEND ===
│   │
│   ├── client/                          # App cho người dùng cuối
│   │   └── src/
│   │       ├── api/                     # Mỗi resource 1 file (auth.ts, post.ts, ...)
│   │       ├── components/              # UI tái sử dụng
│   │       ├── config/                  # env.ts, theme.ts
│   │       ├── hooks/                   # Custom hooks (useApi, ...)
│   │       ├── layouts/                 # PublicLayout, AuthLayout, UserLayout
│   │       ├── pages/                   # Trang theo nhóm: public/, auth/, user/
│   │       ├── routes/                  # Route config + ProtectedRoute
│   │       ├── store/                   # Zustand stores (auth, ...)
│   │       ├── styles/                  # CSS global
│   │       ├── types/                   # TS types dùng chung
│   │       └── utils/                   # Helper (date, format, ...)
│   │
│   ├── admin/                           # App quản trị (sidebar + CRUD)
│   │   └── src/                         # Cấu trúc tương tự client/, thêm:
│   │       ├── config/menu.tsx          #   menu sidebar có filter theo role
│   │       ├── layouts/AdminLayout.tsx  #   layout 2 cột có sidebar
│   │       └── pages/users|posts/       #   CRUD mẫu: <Entity>Page + <Entity>FormModal
│   │
│   └── README.md                        # Giải thích chi tiết 2 app & cách phối hợp
│
├── backend/                             # === BACKEND ===
│   └── src/
│       ├── config/                      # env.ts, db.ts (Prisma client)
│       ├── middlewares/                 # auth, validate, errorHandler
│       ├── modules/                     # Mỗi feature 1 folder
│       │   ├── auth/                    #   register, login, refresh, logout, me
│       │   ├── users/                   #   /users/me + /admin/users CRUD
│       │   └── posts/                   #   public posts + /admin/posts CRUD
│       │       ├── posts.controller.ts  #     translate HTTP <-> service
│       │       ├── posts.service.ts     #     business logic
│       │       ├── posts.route.ts       #     URL + middleware
│       │       └── posts.schema.ts      #     Zod validation
│       ├── utils/                       # jwt, errors, response, async
│       ├── app.ts                       # Express app + middleware
│       └── server.ts                    # Entry point + graceful shutdown
│
└── docs/                                # === TÀI LIỆU ===
    ├── 01..06 — Frontend (kiến trúc, routing, auth, state, API, Antd, deploy)
    └── 07..11 — Backend (architecture, Prisma, JWT, validation, deploy)
```

---

## 7. Quy tắc commit & code style

- ESLint + Prettier đã cấu hình sẵn — chạy `npm run lint` và `npm run format` trước khi commit.
- Commit theo Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`...
- Mỗi PR nên nhỏ, mô tả rõ "tại sao" thay vì "làm gì".

---

## 8. Sau khi đọc xong base này, bạn có thể tự build:

- Trang public hiển thị danh sách bài viết, chi tiết bài viết
- Đăng ký / đăng nhập / quên mật khẩu
- Trang user: profile, đổi mật khẩu, danh sách hoạt động
- Trang admin: CRUD bài viết, quản lý user, phân quyền, dashboard thống kê
- Backend API có auth, validation, phân trang, search, upload ảnh

Chúc bạn học vui! Khi bí, hãy đọc `docs/` trước khi search Google.
