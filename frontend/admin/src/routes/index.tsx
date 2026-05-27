import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
// Import lazy cho trang Quản lý rạp mới tạo
const TheatersPage = lazy(() => import('@/pages/theaters/TheatersPage')); 
// Import lazy cho trang Lịch chiếu nằm trong folder tiếng Việt của bạn
const LichChieuPage = lazy(() => import('@/pages/lichchieu/LichChieuPage'));

// 🌟 Sửa lại import đúng tên file DoAnNuocUongPage của bạn
const DoAnNuocUongPage = lazy(() => import('@/pages/food/DoAnNuocUongPage'));

const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageFallback = () => (
  <div style={{ padding: 80, display: 'grid', placeItems: 'center' }}>
    <Spin size='large' />
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path='auth' element={<AuthLayout />}>
          <Route path='login' element={<LoginPage />} />
          <Route index element={<Navigate to='login' replace />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to='/dashboard' replace />} />
            <Route path='dashboard' element={<DashboardPage />} />
            <Route path='users' element={<UsersPage />} />
            
            {/* Đổi đường dẫn từ posts sang content để đồng bộ với menu Quản lý rạp */}
            <Route path='content' element={<TheatersPage />} /> 

            {/* Route cho trang Lịch chiếu - Khớp path 'showtimes' với file menu chung */}
            <Route path='showtimes' element={<LichChieuPage />} />
            
            {/* 🌟 Route cho trang Đồ ăn và Nước uống */}
            <Route path='food-drink' element={<DoAnNuocUongPage />} />
            
            <Route path='settings' element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path='403' element={<ForbiddenPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}