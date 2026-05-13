# 01 — Frontend Architecture

> Mục tiêu: hiểu **tại sao** chia folder như base này, để khi dự án lớn lên không bị rối.

## 1. Triết lý chia folder

Có 2 cách phổ biến để chia code frontend:

### Cách 1: theo "loại" (layer-based)
```
src/
├── components/    # mọi component
├── pages/         # mọi page
├── hooks/         # mọi hook
└── api/           # mọi API
```
- Dễ tìm khi dự án nhỏ.
- **Khó scale**: dự án to thì mỗi folder có hàng trăm file không liên quan, sửa 1 tính năng phải mở 5 folder.

### Cách 2: theo "tính năng" (feature-based)
```
src/features/
├── auth/
│   ├── components/
│   ├── api.ts
│   ├── store.ts
│   └── routes.tsx
├── post/
│   ├── components/
│   ├── api.ts
│   └── ...
```
- Dễ tìm theo nghiệp vụ.
- Có thể tách rời / xoá cả 1 feature mà không ảnh hưởng feature khác.

### Base này dùng "hybrid"
- Layer cho hạ tầng: `api/`, `store/`, `hooks/`, `utils/`, `layouts/`, `routes/`
- Feature trong `pages/` (nhóm theo `public/`, `auth/`, `user/`)

→ Tốt cho dự án nhỏ-vừa. Khi dự án vượt ~30 page, **migrate sang feature-based** bằng cách gộp api+store+pages của cùng tính năng vào `src/features/<name>/`.

## 2. Dòng chảy dữ liệu (data flow)

```
[User action]
     ↓
  Page/Component (UI)
     ↓ gọi
  api/* (axios)
     ↓ trả về
  setState / store update
     ↓
  re-render
```

Quy tắc:
1. **Component KHÔNG biết gì về axios.** Chỉ biết gọi `api.<endpoint>()`.
2. **API layer KHÔNG biết gì về UI.** Chỉ biết payload in/out.
3. **Store** chỉ giữ state global (user, theme, ...). State chỉ dùng 1 chỗ thì giữ trong `useState`.

## 3. Component vs Page

- **Page**: ứng với 1 route. Tên ghép `<Tên>Page`. Lo: layout của trang, gọi API, ghép sub-component.
- **Component**: tái sử dụng, không gắn route. Nhận `props`, không gọi API trực tiếp (trừ component "container" nhúng vào page).

Nếu 1 page > 300 dòng → tách bớt thành sub-component đặt cạnh nó:

```
pages/posts/
├── PostsPage.tsx          # page chính
├── PostFormModal.tsx      # sub-component
└── PostTable.tsx          # sub-component
```

## 4. Layout

Layout là wrapper bọc nhiều page (thường có header/sidebar/footer). React Router v6 nhận `<Outlet/>` để render page con vào trong layout.

Base có 3 layout:
- `PublicLayout` — Home, Blog, About
- `AuthLayout` — Login, Register (nền gradient)
- `UserLayout` — sau khi đăng nhập

→ Khi cần thêm 1 vùng UI khác (ví dụ Marketing campaign), tạo `MarketingLayout` và đăng ký trong `routes/`.

## 5. Import alias `@/`

Để tránh `../../../components/Foo`, base đã cấu hình `@/*` → `src/*`:
- `vite.config.ts` → resolve.alias
- `tsconfig.json` → paths

→ Luôn import `@/components/Foo` thay vì relative dài.

## 6. Lazy load route

```tsx
const HomePage = lazy(() => import('@/pages/public/HomePage'));
```

Lý do:
- First load chỉ tải Layout + page hiện tại → web nhẹ hơn.
- Vite tự tách thành chunk riêng.

Khi nào KHÔNG lazy: page rất nhỏ (NotFound) và đã có user lên gần như 100% lần truy cập đầu.
