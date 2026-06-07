import { useEffect } from 'react';
import { AppRoutes } from '@/routes';
import { useAuthStore } from '@/store/auth';
import { tokenStore } from '@/api/client';

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    
    if (accessToken) {
      tokenStore.set(accessToken);
      if (refreshToken) tokenStore.setRefresh(refreshToken);
      
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, '', newUrl);
    }
    
    bootstrap();
  }, [bootstrap]);
  return <AppRoutes />;
}
