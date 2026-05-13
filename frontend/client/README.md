# Client (Public + User)

Frontend cho người dùng cuối. Stack: **Vite + React 18 + TypeScript + Antd 5 + Zustand + React Router v6**.

## Chạy

```bash
cp .env.example .env
npm install
npm run dev          # http://localhost:5173
```

## Cấu trúc

```
src/
├── api/             # axios + endpoints (auth.ts, post.ts, user.ts)
├── components/      # UI tái sử dụng (để bạn tự thêm)
├── config/          # env.ts, theme.ts
├── hooks/           # useApi (template gọi API có loading/error)
├── layouts/         # PublicLayout, AuthLayout, UserLayout
├── pages/
│   ├── public/      # Trang public (Home, About, Blog, NotFound)
│   ├── auth/        # Login, Register
│   └── user/        # Dashboard, Profile, ChangePassword (yêu cầu auth)
├── routes/          # Routes config + ProtectedRoute
├── store/           # Zustand: auth
├── styles/          # CSS global
├── types/           # TS types dùng chung
└── utils/           # Helper format date, currency
```

## Thêm trang mới

1. Tạo file: `src/pages/<group>/MyPage.tsx`
2. Đăng ký route trong `src/routes/index.tsx`:
   ```tsx
   const MyPage = lazy(() => import('@/pages/<group>/MyPage'));
   <Route path='my-page' element={<MyPage />} />
   ```
3. Nếu cần đăng nhập, đặt bên trong `<Route element={<ProtectedRoute />}>`.

## Thêm 1 module CRUD mới (vd `comment`)

1. **API**: tạo `src/api/comment.ts` với `commentApi.list/create/update/delete`.
2. **Type**: thêm `Comment` vào `src/types/index.ts`.
3. **Page**: tạo `src/pages/.../CommentsPage.tsx` dùng `useApi` để fetch.
4. **Route**: đăng ký.
5. **Backend**: phải có endpoint `/api/comments` ở `../../backend/`.

## Lưu ý quan trọng

- **Không** gọi `axios` trực tiếp trong page. Luôn qua `apiClient` để dính interceptor.
- **Không** lưu token trong Zustand store. Token nằm ở `localStorage` (qua `tokenStore`).
- **Không** đặt logic gọi API trong `useEffect` không có cleanup (gây race condition khi user navigate nhanh). Dùng `useApi` hoặc `AbortController`.
- Mỗi prop `Link to={...}` phải có `key` khi nằm trong `map`.
