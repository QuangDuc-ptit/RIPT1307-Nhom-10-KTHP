import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';

/**
 * Bảo vệ route admin: yêu cầu đã đăng nhập + role ADMIN.
 *
 * Có thể nhận `requiredRole` để mở rộng dùng cho route đặc biệt.
 */
export default function ProtectedRoute({
  requiredRole = 'ADMIN',
}: {
  requiredRole?: 'ADMIN' | 'USER';
}) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);

  if (!initialized || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size='large' />
      </div>
    );
  }

  if (!user) {
    return <Navigate to='/auth/login' replace state={{ from: location }} />;
  }

  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to='/403' replace />;
  }

  return <Outlet />;
}
