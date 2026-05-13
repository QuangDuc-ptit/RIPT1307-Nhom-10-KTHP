import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

import PublicLayout from '@/layouts/PublicLayout';
import AuthLayout from '@/layouts/AuthLayout';
import UserLayout from '@/layouts/UserLayout';
import ProtectedRoute from './ProtectedRoute';

/**
 * Lazy load các trang. Lợi ích:
 *  - first load nhẹ (không tải hết app cùng lúc)
 *  - Vite tự code-split theo dynamic import
 *
 * Cách thêm route mới:
 *  1) tạo file `src/pages/xxx/YourPage.tsx`
 *  2) `const YourPage = lazy(() => import('@/pages/xxx/YourPage'));`
 *  3) thêm `<Route path="..." element={<YourPage/>} />`
 */
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const BlogListPage = lazy(() => import('@/pages/public/BlogListPage'));
const BlogDetailPage = lazy(() => import('@/pages/public/BlogDetailPage'));
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage'));

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

const UserDashboardPage = lazy(() => import('@/pages/user/DashboardPage'));
const UserProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const ChangePasswordPage = lazy(() => import('@/pages/user/ChangePasswordPage'));

const PageFallback = () => (
  <div style={{ padding: 80, display: 'grid', placeItems: 'center' }}>
    <Spin size='large' />
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Public area */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path='about' element={<AboutPage />} />
          <Route path='blog' element={<BlogListPage />} />
          <Route path='blog/:slug' element={<BlogDetailPage />} />
        </Route>

        {/* Auth area */}
        <Route path='auth' element={<AuthLayout />}>
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route index element={<Navigate to='login' replace />} />
        </Route>

        {/* User area (yêu cầu đăng nhập) */}
        <Route element={<ProtectedRoute />}>
          <Route path='me' element={<UserLayout />}>
            <Route index element={<UserDashboardPage />} />
            <Route path='profile' element={<UserProfilePage />} />
            <Route path='change-password' element={<ChangePasswordPage />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
