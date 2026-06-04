import { useAuthStore } from '@/store/auth';

export function render(oldRender: () => void) {
  useAuthStore.getState().bootstrap().finally(() => oldRender());
}