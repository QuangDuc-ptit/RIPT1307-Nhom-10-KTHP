import { apiClient } from './client';
import type { ListQuery, Paginated, User } from '@/types';

// ==================== Client ====================
export const clientUserApi = {
  updateProfile: (payload: Partial<Pick<User, 'name' | 'avatar'>>) =>
    apiClient.patch<User>('/users/me', payload).then((r) => r.data),
};

// ==================== Admin ====================
export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  role: 'USER' | 'ADMIN';
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'email'>>;

export const adminUserApi = {
  list: (params: ListQuery = {}) =>
    apiClient.get<Paginated<User>>('/admin/users', { params }).then((r) => r.data),

  detail: (id: string) =>
    apiClient.get<User>(`/admin/users/${id}`).then((r) => r.data),

  create: (payload: CreateUserPayload) =>
    apiClient.post<User>('/admin/users', payload).then((r) => r.data),

  update: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<User>(`/admin/users/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/admin/users/${id}`).then((r) => r.data),
};