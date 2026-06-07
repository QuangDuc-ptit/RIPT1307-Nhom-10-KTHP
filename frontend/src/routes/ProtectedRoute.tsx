import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  /** Vai trò được phép truy cập. Mặc định là 'ADMIN' để tương thích admin cũ */
  allowedRoles?: ('ADMIN' | 'USER')[];
  /** Đường dẫn chuyển hướng khi chưa đăng nhập */
  redirectTo?: string;
}

export default function ProtectedRoute({
  allowedRoles = ['ADMIN'],
  redirectTo = '/auth/login',
}: ProtectedRouteProps) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const loading = useAuthStore((s) => s.loading);

  if (!initialized || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Nếu role không được phép, chuyển hướng về trang chủ hoặc 403
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}