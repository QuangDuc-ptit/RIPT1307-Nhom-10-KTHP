# 03 — State Management với Zustand

## 1. Có những loại state nào?

| Loại | Ví dụ | Để ở đâu |
| --- | --- | --- |
| **Local state** | giá trị input, modal open/close | `useState` |
| **Derived state** | tính ra từ state khác (vd full name) | `useMemo` hoặc tính trực tiếp khi render |
| **Server state** | data lấy từ API (list bài viết) | `useApi` (base này) hoặc TanStack Query |
| **Global state** | user đã đăng nhập, theme, locale | Zustand store |
| **URL state** | filter, page hiện tại | URL query params |

**Nguyên tắc**: chỉ đưa vào Zustand những gì dùng ở NHIỀU chỗ trong app. Đừng nhồi mọi state vào store.

## 2. Vì sao Zustand thay vì Redux?

- Không cần boilerplate (`actions`, `reducers`, `dispatch`, ...)
- API đơn giản: `const useStore = create(set => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }))`
- Có thể access từ ngoài React (`useAuthStore.getState()`)
- Type-safe với TS

Redux Toolkit vẫn ổn nếu team đã quen, nhưng Zustand viết ít code hơn ~3x.

## 3. Đọc code base

```ts
// src/store/auth.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  login: async (payload) => {
    const { user, accessToken, refreshToken } = await authApi.login(payload);
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user });
  },
  // ...
}));
```

Cách dùng trong component:
```tsx
// Cách 1: subscribe slice (chỉ re-render khi slice đổi -- KHUYÊN DÙNG)
const user = useAuthStore((s) => s.user);

// Cách 2: nhiều slice
const { user, logout } = useAuthStore((s) => ({ user: s.user, logout: s.logout }));
// !!! Cẩn thận: cách trên trả về object MỚI mỗi lần -> re-render mọi lúc.
// Cách đúng: dùng shallow:
import { shallow } from 'zustand/shallow';
const [user, logout] = useAuthStore((s) => [s.user, s.logout], shallow);
```

## 4. Truy cập store ngoài React

Ví dụ: trong axios interceptor cần biết user:
```ts
const user = useAuthStore.getState().user;
// hoặc setState:
useAuthStore.setState({ user: null });
```
→ Không cần hook, không cần Provider.

## 5. Persist (giữ state khi reload)

Base này **không persist** `user` (sẽ load lại qua `/auth/me`). Nhưng nếu muốn lưu theme, locale:

```ts
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      darkMode: false,
      toggle: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'ui-store' }, // key trong localStorage
  ),
);
```

## 6. Khi nào cần TanStack Query?

Nếu app có nhiều API call và cần:
- Cache + dedupe (nhiều component cùng hỏi 1 endpoint chỉ gọi 1 lần)
- Auto refetch khi window focus
- Optimistic update mạnh
- Pagination/infinite query có sẵn

→ Cân nhắc thay `useApi` của base bằng TanStack Query. Cài: `npm i @tanstack/react-query`.

Còn ở mức nhỏ-vừa, `useApi` đơn giản này là đủ.
