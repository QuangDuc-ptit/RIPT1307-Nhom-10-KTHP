import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Import các trang (Pages) của bạn vào đây
import ProfilePage from './pages/Profile'; 
// Nhớ kiểm tra lại đường dẫn import này cho đúng với cấu trúc thư mục của bạn nhé
import LoginPage from './pages/auth/LoginPage'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<div>Đây là Trang chủ (Public)</div>} />
        
        {/* --- CÁC ROUTE XÁC THỰC (AUTH) --- */}
        {/* Cả 2 đường dẫn login và register đều trỏ về chung 1 file LoginPage */}
        {/* Nhờ vậy, trạng thái trượt qua lại form đăng nhập/đăng ký mới hoạt động mượt mà */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<LoginPage />} />
        
        {/* Mẹo nhỏ: Nếu user gõ /auth trống trơn, tự động đẩy về /auth/login */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

        {/* --- CÁC ROUTE NGƯỜI DÙNG (USER) --- */}
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Bắt lỗi 404 (Nếu gõ đường dẫn bậy bạ không có trong hệ thống) */}
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