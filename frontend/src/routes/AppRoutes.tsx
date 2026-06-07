import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';      // dùng chung cho auth (style client)
import PublicLayout from '@/layouts/PublicLayout';  // layout cho client public
import UserLayout from '@/layouts/UserLayout';      // layout cho client đã đăng nhập (có sidebar)

// Components
import ProtectedRoute from './ProtectedRoute';

// ------------------- Các page dùng chung (auth) -------------------
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// ------------------- Admin pages -------------------
const DashboardPage = lazy(() => import('@/pages/admin/Dashboard'));
const UsersPage = lazy(() => import('@/pages/admin/UserManagement'));
const TheatersPage = lazy(() => import('@/pages/admin/Theaters'));
const LichChieuPage = lazy(() => import('@/pages/admin/Showtimes'));
const DoAnNuocUongPage = lazy(() => import('@/pages/admin/FoodDrink'));
const KhuyenMaiPage = lazy(() => import('@/pages/admin/Promotions'));
const SettingsPage = lazy(() => import('@/pages/admin/Settings'));

// ------------------- Client pages (public & user) -------------------
const LandingPage = lazy(() => import('@/pages/client/LandingPage'));
const HomePage = lazy(() => import('@/pages/client/HomePage'));
const MovieDetailPage = lazy(() => import('@/pages/client/MovieDetail'));
const ProfilePage = lazy(() => import('@/pages/client/Profile'));
const OrderHistoryPage = lazy(() => import('@/pages/client/OrderHistory'));
const CheckoutPage = lazy(() => import('@/pages/client/Checkout'));
const ChonGhePage = lazy(() => import('@/pages/client/SeatSelection'));
const FoodDrinkClientPage = lazy(() => import('@/pages/client/FoodDrink'));

// ------------------- Error pages -------------------
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const PageFallback = () => (
  <div style={{ padding: 80, display: 'grid', placeItems: 'center' }}>
    <Spin size="large" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* ---------- AUTH ROUTES (dùng chung, không cần đăng nhập) ---------- */}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        </Route>

        {/* ---------- ADMIN ROUTES (yêu cầu role ADMIN) ---------- */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/content" element={<TheatersPage />} />
            <Route path="/showtimes" element={<LichChieuPage />} />
            <Route path="/food-drink" element={<DoAnNuocUongPage />} />
            <Route path="/promotions" element={<KhuyenMaiPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* ---------- CLIENT PUBLIC ROUTES (không cần đăng nhập) ---------- */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingpage" element={<Navigate to="/" replace />} />
          <Route path="/home-debug" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/chon-ghe" element={<ChonGhePage />} />
          <Route path="/food-drink-client" element={<FoodDrinkClientPage />} />
        </Route>

        {/* ---------- CLIENT PROTECTED ROUTES (yêu cầu đăng nhập, role USER) ---------- */}
        <Route element={<ProtectedRoute allowedRoles={['USER']} redirectTo="/auth/login" />}>
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        {/* ---------- ERROR ROUTES ---------- */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}