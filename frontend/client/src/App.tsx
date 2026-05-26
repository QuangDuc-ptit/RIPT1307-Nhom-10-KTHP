import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. IMPORT CÁC TRANG (PAGES) ---
import ProfilePage from './pages/Profile'; 
import LoginPage from './pages/auth/LoginPage'; 
import MovieDetailPage from './pages/MovieDetail'; 
import OrderHistoryPage from './pages/OrderHistory';
import CheckoutPage from './pages/Checkout';

import LandingPage from './pages/public/Landingpage/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<LandingPage />} />        

        {/* Nếu lỡ vào /landingpage thì tự động chuyển hướng về trang chủ / */}
        <Route path="/landingpage" element={<Navigate to="/" replace />} />

        {/* --- CÁC ROUTE CŨ VẪN ĐƯỢC GIỮ NGUYÊN --- */}
        {/* Nhóm Đăng nhập/Đăng ký */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<LoginPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

        {/* Trang Cá nhân */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* --- CÁC TRANG TÍNH NĂNG MỚI THÊM --- */}
        {/* Trang Chi tiết phim */}
        {/* 3. Trang Chi tiết phim */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        
        {/* Trang Lịch sử giao dịch */}
        <Route path="/orders" element={<OrderHistoryPage />} />
        
        {/* Trang Thanh toán */}
        <Route path="/checkout" element={<CheckoutPage />} />
        
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