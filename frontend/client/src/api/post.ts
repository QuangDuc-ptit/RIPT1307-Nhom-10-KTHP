import { apiClient } from './client';
import type { ListQuery, Paginated, Post } from '@/types';

export const postApi = {
  list: (params: ListQuery = {}) =>
    apiClient.get<Paginated<Post>>('/posts', { params }).then((r) => r.data),

  bySlug: (slug: string) =>
    apiClient.get<Post>(`/posts/slug/${slug}`).then((r) => r.data),

  byId: (id: string) => apiClient.get<Post>(`/posts/${id}`).then((r) => r.data),
};
