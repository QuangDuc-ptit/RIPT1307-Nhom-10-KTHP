import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import ProfilePage from './pages/Profile';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import MovieDetailPage from './pages/Movie';
import OrderHistoryPage from './pages/OrderHistory';
import CheckoutPage from './pages/Checkout';
import LandingPage from './pages/Public/LandingPage';
import HomePage from './pages/Public/HomePage/HomePage';

function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <BrowserRouter>
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
        <Route path="*" element={
          <div style={{ padding: '50px', textAlign: 'center', color: 'white', backgroundColor: '#151113', minHeight: '100vh' }}>
            <h2>404 - Trang không tồn tại</h2>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;