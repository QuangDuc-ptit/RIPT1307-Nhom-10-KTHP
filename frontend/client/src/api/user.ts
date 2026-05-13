import { apiClient } from './client';
import type { User } from '@/types';

export const userApi = {
  updateProfile: (payload: Partial<Pick<User, 'name' | 'avatar'>>) =>
    apiClient.patch<User>('/users/me', payload).then((r) => r.data),
};
