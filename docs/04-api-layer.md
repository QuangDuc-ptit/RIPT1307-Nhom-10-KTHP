# 04 — API Layer (axios)

## 1. Vì sao có `api/`?

Không gọi `axios.get(...)` rải rác trong component vì:
1. Khó tái sử dụng — 2 chỗ cùng gọi `/posts` sẽ duplicate code.
2. Không có type — phải gõ tay response shape.
3. Khó test — không thể mock 1 chỗ duy nhất.

→ Quy ước: mỗi resource 1 file trong `src/api/`, export 1 object có các phương thức.

```ts
// src/api/post.ts
export const postApi = {
  list: (params) => apiClient.get('/posts', { params }).then(r => r.data),
  bySlug: (slug) => apiClient.get(`/posts/slug/${slug}`).then(r => r.data),
};
```

Component chỉ cần `import { postApi } from '@/api/post'` và gọi.

## 2. Response envelope

Backend trả:
```json
{ "success": true, "data": { "items": [...], "total": 100 } }
```

Interceptor unwrap:
```ts
if (body?.success) return { ...response, data: body.data };
```

→ Trong code FE, `await postApi.list()` trả thẳng `{ items, total }` thay vì `response.data.data`. Sạch hơn.

## 3. Lỗi chuẩn

Backend trả khi fail:
```json
{ "success": false, "error": { "code": "NOT_FOUND", "message": "...", "details": {} } }
```

Interceptor map thành object `{ code, message, details, status }` rồi `Promise.reject(...)`.

Component xử lý:
```tsx
try {
  await postApi.create(payload);
} catch (e) {
  message.error(e.message); // hiện toast
  if (e.code === 'VALIDATION_ERROR') {
    // show field errors từ e.details
  }
}
```

## 4. AbortController (huỷ request)

Khi user navigate nhanh, request cũ vẫn đang chạy → cảnh báo "set state on unmounted component". Cách tránh:

```ts
useEffect(() => {
  const ctrl = new AbortController();
  apiClient.get('/posts', { signal: ctrl.signal }).then(...);
  return () => ctrl.abort();
}, []);
```

`useApi` trong base dùng cờ `mounted` để đơn giản. Cho dự án lớn nên dùng AbortController.

## 5. Upload file

```ts
const formData = new FormData();
formData.append('file', file);
await apiClient.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  onUploadProgress: (e) => setProgress((e.loaded / (e.total ?? 1)) * 100),
});
```

Backend của base chưa có upload — đó là phần mở rộng. Khi cần, dùng `multer` ở backend.

## 6. Loading & Error UX

| Trạng thái | UI |
| --- | --- |
| Đang tải lần đầu | `Skeleton` (xương) tốt hơn `Spin` xoay tròn |
| Refresh khi đã có data | `Spin` overlay nhẹ, vẫn cho thấy data cũ |
| Empty (rỗng) | `<Empty/>` của Antd với CTA |
| Error | Inline error + nút "Thử lại" |
| Optimistic | Cập nhật UI ngay, rollback nếu fail |

Đừng chỉ hiện `<Spin/>` toàn trang khi user đã ở trên trang — gây cảm giác chậm.

## 7. Debounce search

```tsx
useEffect(() => {
  const t = setTimeout(() => fetch(search), 300);
  return () => clearTimeout(t);
}, [search]);
```

→ Gõ liên tục chỉ gọi API sau 300ms ngừng gõ. Tránh quá nhiều request.

(Xem `pages/public/BlogListPage.tsx` trong client để thấy ví dụ.)
