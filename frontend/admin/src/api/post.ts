import { apiClient } from './client';
import type { ListQuery, Paginated, Post } from '@/types';

export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}

export type UpdatePostPayload = Partial<CreatePostPayload>;

export const postApi = {
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
