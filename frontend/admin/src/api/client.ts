import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

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

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];
const subscribe = (cb: (token: string | null) => void) => pendingQueue.push(cb);
const flushQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (body.success) return { ...response, data: body.data };
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    if (!error.response) {
      return Promise.reject({
        code: 'NETWORK_ERROR',
        message: 'Không kết nối được máy chủ. Vui lòng thử lại.',
      });
    }

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
        const res = await axios.post(`${env.apiBaseUrl}/auth/refresh`, { refreshToken });
        const newAccess = res.data?.data?.accessToken as string | undefined;
        const newRefresh = res.data?.data?.refreshToken as string | undefined;
        if (!newAccess) throw new Error('No access token');
        tokenStore.set(newAccess);
        if (newRefresh) tokenStore.setRefresh(newRefresh);
        flushQueue(newAccess);
        original.headers.set('Authorization', `Bearer ${newAccess}`);
        return apiClient(original);
      } catch (e) {
        flushQueue(null);
        tokenStore.clearAll();
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    const errBody = error.response.data?.error;
    return Promise.reject({
      code: errBody?.code || `HTTP_${status}`,
      message: errBody?.message || 'Có lỗi xảy ra.',
      details: errBody?.details,
      status,
    });
  },
);
