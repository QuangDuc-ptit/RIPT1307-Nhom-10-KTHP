# Frontend

Phần frontend của Base Web được tách thành **2 app độc lập** cùng dùng chung 1 backend:

```
frontend/
├── client/     # Trang cho NGƯỜI DÙNG CUỐI (public + user dashboard)
│   └── chạy ở http://localhost:5173
└── admin/      # Trang QUẢN TRỊ (admin panel có sidebar, CRUD)
    └── chạy ở http://localhost:5174
```

## 1. Vì sao tách 2 app thay vì 1 app có 2 phần?

Đây là pattern chuẩn cho web có cả phần public + admin. Lợi ích:

| Tách 2 app | Gộp 1 app |
| --- | --- |
| ✅ Bundle nhỏ cho user (không tải code admin) | ❌ User cũng phải tải code admin |
| ✅ Deploy 2 domain riêng (`example.com` + `admin.example.com`) | ❌ Mất công routing |
| ✅ Bảo mật tốt hơn — admin có thể chặn IP, đặt sau VPN | ❌ Phải route check phức tạp |
| ✅ Team có thể chia: 1 nhóm làm client, 1 nhóm làm admin, không xung đột | ❌ Code chung dễ đụng nhau |
| ✅ Tự do về stack — sau này admin có thể đổi framework không ảnh hưởng client | ❌ Bị khoá chung 1 stack |
| ❌ Phải maintain 2 `package.json`, có 1 chút code lặp | ✅ DRY tuyệt đối |

→ Với base này, ưu điểm nhiều hơn nhược. Phần lặp lại (api/client, types) bạn có thể trích ra `packages/shared` nếu muốn — xem phần 5 bên dưới.

## 2. Stack chung của 2 app

Cả 2 đều dùng:
- **Vite 5** — bundler/dev server
- **React 18** + **TypeScript 5**
- **Antd 5** — UI library
- **Zustand** — global state
- **React Router v6** — routing
- **Axios** — HTTP client (có sẵn interceptor + auto refresh token)
- **dayjs** — date format
- **react-helmet-async** — set `<title>`/SEO meta

→ Học 1 lần dùng được cả 2 app.

## 3. Sự khác nhau giữa `client/` và `admin/`

| | `client/` | `admin/` |
| --- | --- | --- |
| Đối tượng | Khách + user thường | Chỉ ADMIN |
| Theme color | Xanh dương `#1677ff` | Tím chàm `#3f51b5` |
| Layouts | `PublicLayout`, `AuthLayout`, `UserLayout` | `AdminLayout` (sidebar), `AuthLayout` |
| Trang sẵn | Home, About, Blog, Login, Register, Profile, ChangePwd | Login, Dashboard, Users CRUD, Posts CRUD, Settings |
| Bảo vệ route | `<ProtectedRoute />` (chỉ check đã login) | `<ProtectedRoute requiredRole="ADMIN" />` |
| API endpoints | `/api/posts`, `/api/auth/*`, `/api/users/me` | `/api/admin/users`, `/api/admin/posts`, `/api/auth/*` |
| Port dev | 5173 | 5174 |

## 4. Chạy đồng thời

Mỗi app là 1 dự án độc lập, có `node_modules` riêng:

```bash
# Terminal 1
cd frontend/client
npm install
npm run dev          # http://localhost:5173

# Terminal 2
cd frontend/admin
npm install
npm run dev          # http://localhost:5174

# Terminal 3 (backend, ở thư mục base-web/backend)
cd backend
npm install
npm run dev          # http://localhost:4000
```

Cả 2 app FE đều trỏ tới backend tại `http://localhost:4000` (set trong `.env`).

## 5. Khi muốn chia sẻ code giữa 2 app (tuỳ chọn)

Hiện tại `client/src/types/index.ts` và `admin/src/types/index.ts` có code lặp. Đây là **đánh đổi cố ý** để base đơn giản, không cần monorepo.

Nếu sau này muốn share:
1. Cài pnpm workspace:
   ```yaml
   # pnpm-workspace.yaml ở root base-web/
   packages:
     - 'frontend/*'
     - 'packages/*'
   ```
2. Tạo `packages/shared/` chứa types + utils dùng chung.
3. `client/` và `admin/` thêm `"@base/shared": "workspace:*"` vào dependencies.

Khi project nhỏ, **không cần** phức tạp hoá. Chấp nhận lặp 1 chút thôi.

## 6. Cấu trúc bên trong mỗi app

Đọc README riêng của từng app:
- [`client/README.md`](./client/README.md)
- [`admin/README.md`](./admin/README.md)

Cả 2 đều theo cùng cấu trúc:
```
src/
├── api/         # axios + endpoints
├── components/  # UI tái sử dụng
├── config/      # env, theme, (admin: menu)
├── hooks/       # custom hooks
├── layouts/     # layout wrappers
├── pages/       # trang
├── routes/      # route config + ProtectedRoute
├── store/       # Zustand stores
├── styles/      # CSS global
├── types/       # TS types
└── utils/       # helpers
```

→ Học cấu trúc 1 app là biết app còn lại.

## 7. Build production

```bash
cd frontend/client && npm run build   # ra dist/
cd ../admin && npm run build           # ra dist/
```

Deploy:
- `client/dist` → `https://example.com`
- `admin/dist`  → `https://admin.example.com`

Xem `docs/06-deployment.md` để biết chi tiết.
