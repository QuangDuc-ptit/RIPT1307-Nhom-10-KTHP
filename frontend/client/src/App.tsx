import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import AppRoutes from '@/routes/AppRoutes';
import { tokenStore } from '@/api/client';

function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

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

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;