import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // Import cái mớ Routes bạn vừa tách
import { useAuthStore } from '@/store/auth';

function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <BrowserRouter>
      {/* Gọi toàn bộ cấu hình Route ở đây */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;