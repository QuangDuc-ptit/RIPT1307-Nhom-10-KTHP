import { useEffect } from 'react';
import { AppRoutes } from '@/routes';
import { useAuthStore } from '@/store/auth';

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);
  return <AppRoutes />;
}
