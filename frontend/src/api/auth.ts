import { apiClient } from './client';
import type { AuthTokens, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<LoginResponse>('/auth/register', payload).then((r) => r.data),

  socialLogin: (payload: { provider: string; idToken: string }) =>
    apiClient.post<LoginResponse>('/auth/social-login', payload).then((r) => r.data),

  forgotPassword: (payload: { email: string }) =>
    apiClient.post('/auth/quen-mat-khau', payload).then((r) => r.data),

  resetPassword: (payload: { token: string; newPassword: string }) =>
    apiClient.post('/auth/dat-lai-mat-khau', payload).then((r) => r.data),

  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),

  logout: () => apiClient.post('/auth/logout').then((r) => r.data),

  changePassword: (payload: { oldPassword: string; newPassword: string }) =>
    apiClient.post('/auth/change-password', payload).then((r) => r.data),
};