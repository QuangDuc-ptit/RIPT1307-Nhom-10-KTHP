import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';

/**
 * Bọc các route yêu cầu đăng nhập.
 * - Nếu chưa load xong (bootstrap), hiện spinner.
 * - Nếu chưa đăng nhập, redirect về /auth/login kèm state `from` để quay lại sau khi login.
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);

  if (!initialized || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/auth/login' replace state={{ from: location }} />;
  }

  return <Outlet />;
}
