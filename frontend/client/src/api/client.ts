import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

/**
 * Axios instance dùng chung cho toàn app.
 *
 * Tính năng đã cài:
 *  - tự gắn Bearer token vào header
 *  - tự refresh token khi gặp 401 (1 lần duy nhất, gom request đang chờ)
 *  - unwrap response: trả thẳng `data` thay vì `response.data`
 *
 * Ý tưởng quan trọng: KHÔNG gọi `axios` trực tiếp trong page/component.
 * Mọi gọi API phải đi qua `apiClient` để dính interceptor.
 */

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

/* ----------------------------- Token helpers ----------------------------- */

export const tokenStore = {
  get: () => localStorage.getItem(env.tokenKey),
  set: (t: string) => localStorage.setItem(env.tokenKey, t),
  clear: () => localStorage.removeItem(env.tokenKey),
  getRefresh: () => localStorage.getItem(env.refreshTokenKey),
  setRefresh: (t: string) => localStorage.setItem(env.refreshTokenKey, t),
  clearRefresh: () => localStorage.removeItem(env.refreshTokenKey),
  clearAll: () => {
    localStorage.removeItem(env.tokenKey);
    localStorage.removeItem(env.refreshTokenKey);
  },
};

/* ----------------------------- Request interceptor ----------------------------- */

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

/* ----------------------------- Refresh-token queue ----------------------------- */

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const subscribe = (cb: (token: string | null) => void) => pendingQueue.push(cb);
const flushQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

/* ----------------------------- Response interceptor ----------------------------- */

apiClient.interceptors.response.use(
  // Unwrap "success" envelope. Backend trả { success: true, data }.
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success) {
        // Trả thẳng `data` để trong code chỉ cần: `const user = await api.get(...)`
        return { ...response, data: body.data };
      }
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // Không có response => network error
    if (!error.response) {
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Không kết nối được máy chủ. Vui lòng thử lại.',
      });
    }

    // 401 -> thử refresh 1 lần
    if (status === 401 && !original._retry && tokenStore.getRefresh()) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribe((newToken) => {
            if (!newToken) return reject(error);
            original.headers.set('Authorization', `Bearer ${newToken}`);
            resolve(apiClient(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = tokenStore.getRefresh()!;
        // Dùng axios thuần để tránh đệ quy interceptor
        const res = await axios.post(`${env.apiBaseUrl}/auth/refresh`, { refreshToken });
        const newAccess = res.data?.data?.accessToken as string | undefined;
        const newRefresh = res.data?.data?.refreshToken as string | undefined;
        if (!newAccess) throw new Error('No access token returned');

        tokenStore.set(newAccess);
        if (newRefresh) tokenStore.setRefresh(newRefresh);
        flushQueue(newAccess);
        original.headers.set('Authorization', `Bearer ${newAccess}`);
        return apiClient(original);
      } catch (e) {
        flushQueue(null);
        tokenStore.clearAll();
        // Force về login. Dùng location để tránh phụ thuộc react-router ở đây.
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // Trả về error chuẩn cho UI dễ dùng
    const errBody = error.response.data?.error;
    return Promise.reject({
      code: errBody?.code || `HTTP_${status}`,
      message: errBody?.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      details: errBody?.details,
      status,
    });
  },
);
