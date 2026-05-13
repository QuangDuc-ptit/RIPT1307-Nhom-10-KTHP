# 02 — Routing và Authentication

> Phần này giải thích cách routing + bảo vệ route + lưu trữ token + auto refresh.

## 1. React Router v6 cơ bản

```tsx
<Routes>
  <Route element={<PublicLayout />}>      {/* layout */}
    <Route index element={<Home />} />     {/* path: / */}
    <Route path='about' element={<About />} />
  </Route>

  <Route path='auth' element={<AuthLayout />}>
    <Route path='login' element={<Login />} />
  </Route>
</Routes>
```

Khái niệm cần nắm:
- **Nested routes**: `<Route element={<Layout/>}>` bọc các `<Route>` con. Layout phải có `<Outlet/>` để render child.
- **`index`**: route mặc định khi đúng path cha.
- **`path` không bắt đầu bằng `/`** trong nested route → tự ghép với path cha.
- **`useNavigate()`**: chuyển hướng trong code (ví dụ sau khi login).
- **`useParams()`**: lấy params từ URL (`:slug` → `params.slug`).
- **`Navigate`**: redirect khi component render.

## 2. Protected Route

```tsx
function ProtectedRoute() {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to='/auth/login' replace />;
  return <Outlet />;
}
```

Dùng như:
```tsx
<Route element={<ProtectedRoute />}>
  <Route path='me' element={<UserLayout />}>
    <Route index element={<Dashboard />} />
  </Route>
</Route>
```

→ Mọi route con phải đăng nhập mới vào được. Nếu không, redirect về `/auth/login`.

**Lưu ý**: phải bootstrap user (gọi `/auth/me` để khôi phục) trước khi render — vì khi reload, app chưa biết user là ai. Xem `App.tsx`:
```tsx
useEffect(() => { bootstrap(); }, []);
```
Trong khi `initialized` chưa true → ProtectedRoute hiển thị spinner thay vì redirect (nếu redirect ngay, user mở `/me` lúc đang load sẽ bị đá ra `/auth/login` oan).

## 3. Cách JWT hoạt động

JWT (JSON Web Token) là 1 chuỗi 3 phần `header.payload.signature` mã hoá base64. Khi:
1. **Login**: server tạo 2 token:
   - **Access token**: ngắn (15 phút). Gửi kèm mọi request. Hết hạn thì gọi refresh.
   - **Refresh token**: dài (7 ngày). Chỉ dùng để xin access token mới.
2. **Mỗi request**: gắn `Authorization: Bearer <accessToken>` vào header.
3. **Hết hạn (401)**: dùng refresh token gọi `/auth/refresh` → nhận token mới → retry request gốc.
4. **Logout**: gọi `/auth/logout` để server revoke refresh token, FE xoá localStorage.

## 4. Lưu token ở đâu?

3 chỗ phổ biến:

| Chỗ lưu | An toàn? | Tiện dùng? |
| --- | --- | --- |
| `localStorage` | Bị tấn công XSS (JS đọc được) | Dễ — reload vẫn còn |
| `sessionStorage` | Tương tự nhưng mất khi đóng tab | Ít dùng |
| `httpOnly Cookie` | An toàn nhất với XSS, dễ bị CSRF | Cần backend set cookie + double-submit token |

Base này lưu trong `localStorage` vì:
- Đơn giản, không cần backend set cookie phức tạp.
- XSS bảo vệ bằng cách dùng Antd (không render HTML thô), Helmet headers ở backend, validate input.

Nếu app có dữ liệu nhạy cảm cao (ngân hàng, y tế) → chuyển sang httpOnly Cookie + CSRF token.

## 5. Axios interceptor (đọc kỹ phần này)

File: `src/api/client.ts`

```ts
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});
```
→ Mọi request đều gắn token tự động. Không cần nhớ gắn ở từng `api.xxx()`.

```ts
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap { success, data } -> trả thẳng data
    if (response.data?.success) return { ...response, data: response.data.data };
    return response;
  },
  async (error) => {
    // Nếu 401, dùng refresh token xin access mới, rồi retry
  }
);
```

**Cơ chế chống "thundering herd" khi refresh**:
- Khi nhiều request cùng 401, chỉ có 1 request gọi `/auth/refresh`.
- Các request khác được "treo" vào hàng đợi `pendingQueue`.
- Khi refresh xong, flush hàng đợi với token mới → tất cả retry.

→ Đây là pattern hay gặp; bạn nên đọc kỹ phần `isRefreshing` + `pendingQueue` trong code.

## 6. Roles & permissions

Base có 2 role: `USER`, `ADMIN`. Cách check:

**Frontend**:
- `ProtectedRoute` của admin yêu cầu `requiredRole='ADMIN'`.
- Menu admin tự ẩn item theo role (`filterMenuByRole`).

**Backend** (quan trọng hơn):
- Middleware `requireRole('ADMIN')` gắn vào route admin.
- **Không bao giờ tin frontend**: dù FE ẩn nút, attacker vẫn có thể gọi API trực tiếp.

→ Khi cần thêm role mới (ví dụ `EDITOR`):
1. Sửa enum `Role` trong `prisma/schema.prisma`
2. `npx prisma migrate dev`
3. Cập nhật type ở FE
4. Thêm vào `requireRole(...)` ở backend route tương ứng

## 7. Lỗi hay gặp

- **"redirect liên tục"**: do bootstrap chưa xong nhưng đã render ProtectedRoute. Đảm bảo có check `initialized`.
- **"401 lặp vô tận"**: refresh token cũng hết hạn. Phải `tokenStore.clearAll()` rồi đưa về login (base này đã xử lý).
- **"token bị mất sau reload"**: bạn lưu vào state thay vì localStorage. Phải qua `tokenStore`.
