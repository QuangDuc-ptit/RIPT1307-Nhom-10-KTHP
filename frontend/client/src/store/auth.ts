import { create } from 'zustand';
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth';
import { tokenStore } from '@/api/client';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean; // loading khi bootstrap (load lại app)
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  setUser: (user: User | null) => void;
  // Hàm đổi mật khẩu
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

/**
 * Auth store. Lý do dùng Zustand thay vì Context:
 * - không re-render toàn cây khi state đổi
 * - dễ access từ ngoài React (ví dụ trong axios interceptor)
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  bootstrap: async () => {
    const token = tokenStore.get();
    if (!token) {
      set({ initialized: true });
      return;
    }
    set({ loading: true });
    try {
      const user = await authApi.me();
      set({ user, initialized: true, loading: false });
    } catch {
      tokenStore.clearAll();
      set({ user: null, initialized: true, loading: false });
    }
  },

  login: async (payload) => {
    const { accessToken, refreshToken, user } = await authApi.login(payload);
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user });
  },

  register: async (payload) => {
    const { accessToken, refreshToken, user } = await authApi.register(payload);
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // bỏ qua lỗi logout
    } finally {
      tokenStore.clearAll();
      set({ user: null });
    }
  },

  // Triển khai hàm changePassword
  changePassword: async (oldPassword, newPassword) => {
    // Nếu bạn có API thật:
    // await authApi.changePassword(oldPassword, newPassword);
    
    // Nếu chỉ làm Frontend, dùng giả lập này để tránh lỗi:
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Đã giả lập đổi mật khẩu thành công:', { oldPassword, newPassword });
  },
}));