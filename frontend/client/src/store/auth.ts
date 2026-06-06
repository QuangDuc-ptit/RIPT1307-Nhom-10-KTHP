import { create } from 'zustand';
import { authApi, type LoginPayload, type RegisterPayload } from '@/api/auth';
import { tokenStore } from '@/api/client';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  login: (payload: LoginPayload) => Promise<any>;
  socialLogin: (payload: { provider: string; idToken: string }) => Promise<any>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => {
    set({ user, initialized: true });
  },

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
    } catch (error) {
      console.error('Bootstrap failed:', error);
      tokenStore.clearAll();
      set({ user: null, initialized: true, loading: false });
    }
  },

  login: async (payload) => {
    const { accessToken, refreshToken, user } = await authApi.login(payload);
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user, initialized: true });
    return { user, accessToken, refreshToken };
  },

  socialLogin: async (payload) => {
    const { accessToken, refreshToken, user } = await authApi.socialLogin(payload);
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user, initialized: true });
    return { user, accessToken, refreshToken };
  },

  register: async (payload) => {
    const { accessToken, refreshToken, user } = await authApi.register(payload);
    tokenStore.set(accessToken);
    tokenStore.setRefresh(refreshToken);
    set({ user, initialized: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenStore.clearAll();
      set({ user: null, initialized: true });
    }
  },
}));