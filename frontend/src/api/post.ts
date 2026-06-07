import { apiClient } from './client';
import type { ListQuery, Paginated, Post } from '@/types';

// ==================== Client ====================
export const clientPostApi = {
  list: (params: ListQuery = {}) =>
    apiClient.get<Paginated<Post>>('/posts', { params }).then((r) => r.data),

  bySlug: (slug: string) =>
    apiClient.get<Post>(`/posts/slug/${slug}`).then((r) => r.data),

  byId: (id: string) =>
    apiClient.get<Post>(`/posts/${id}`).then((r) => r.data),
};

// ==================== Admin ====================
export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export const adminPostApi = {
  list: (params: ListQuery & { published?: boolean } = {}) =>
    apiClient.get<Paginated<Post>>('/admin/posts', { params }).then((r) => r.data),

  detail: (id: string) =>
    apiClient.get<Post>(`/admin/posts/${id}`).then((r) => r.data),

  create: (payload: CreatePostPayload) =>
    apiClient.post<Post>('/admin/posts', payload).then((r) => r.data),

  update: (id: string, payload: UpdatePostPayload) =>
    apiClient.patch<Post>(`/admin/posts/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/admin/posts/${id}`).then((r) => r.data),
};