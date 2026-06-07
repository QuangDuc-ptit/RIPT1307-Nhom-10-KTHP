import { create } from 'zustand';
import { authApi, type LoginPayload } from '@/api/auth';
import { tokenStore } from '@/api/client';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  setUser: (user: User | null) => void;
}

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
    if (user.role !== 'ADMIN' && user.role !== 'STAFF') {
      throw { 
        code: 'FORBIDDEN', 
        message: 'Chuyển hướng đến trang Khách hàng...', 
        user, 
        accessToken, 
        refreshToken 
      };
    }
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      /* ignore */
    } finally {
      tokenStore.clearAll();
      set({ user: null });
    }
  },
}));
