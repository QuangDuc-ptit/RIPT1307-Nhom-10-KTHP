import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts & Routes
import ProtectedRoute from './ProtectedRoute';

// Import Pages (Đã cập nhật đúng chuẩn cấu trúc mới)
import LandingPage from "../pages/LandingPage/LandingPage";
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';

// Các trang dùng file index.tsx (chỉ cần gọi tên thư mục là nó tự nhận)
import MovieDetailPage from '../pages/MovieDetail';
import ProfilePage from '../pages/Profile';
import OrderHistoryPage from '../pages/OrderHistory';
import CheckoutPage from '../pages/Checkout';

// Bắt lỗi 404 dùng component chuyên biệt luôn
import NotFoundPage from '../pages/Static/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Trang chủ - LandingPage */}
      <Route path="/" element={<LandingPage />} />

      {/* Redirects */}
      <Route path="/landingpage" element={<Navigate to="/" replace />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

      {/* Nhóm Đăng nhập/Đăng ký */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Các route yêu cầu đăng nhập */}
      {/* Debug: non-protected copy of HomePage to verify rendering */}
      <Route path="/home-debug" element={<HomePage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* Bắt lỗi 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}