import { useEffect } from 'react';
import { AppRoutes } from '@/routes';
import { useAuthStore } from '@/store/auth';

/**
 * App entry component:
 * - khi vừa mở app, nếu có token trong localStorage thì gọi `me` để khôi phục user.
 * - Routes nằm trong <AppRoutes/>.
 */
export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return <AppRoutes />;
}
