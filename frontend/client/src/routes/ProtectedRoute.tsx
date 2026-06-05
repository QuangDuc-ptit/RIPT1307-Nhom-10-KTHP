import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin, message } from 'antd';
import { useAuthStore } from '@/store/auth';

export default function ProtectedRoute() {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);

  console.log('[ProtectedRoute]', { initialized, loading, user, path: location.pathname });

  if (!initialized || loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    console.warn('User chưa đăng nhập, redirect to login');
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}