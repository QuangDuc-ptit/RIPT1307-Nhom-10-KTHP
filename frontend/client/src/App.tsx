import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- 1. IMPORT CÁC TRANG (PAGES) ---
import ProfilePage from './pages/Profile'; 
import LoginPage from './pages/auth/LoginPage'; 
// Thêm duy nhất dòng import trang phim mới này
import MovieDetailPage from './pages/MovieDetail'; 
// Lich sử giao dịch 
import OrderHistoryPage from './pages/OrderHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<div>Đây là Trang chủ (Public)</div>} />
        
        {/* --- CÁC ROUTE CŨ VẪN ĐƯỢC GIỮ NGUYÊN --- */}
        {/* 1. Nhóm Đăng nhập/Đăng ký */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<LoginPage />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

        {/* 2. Trang Cá nhân */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* --- CÁI MỚI THÊM NẰM Ở ĐÂY --- */}
        {/* 3. Trang Chi tiết phim */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        {/* 4. Trang Lịch sử giao dịch */}
        <Route path="/orders" element={<OrderHistoryPage />} />
        
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