import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 1. Import trang Profile siêu xịn vừa tạo vào đây
import ProfilePage from './pages/Profile'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route cũ của bạn đang hiển thị Trang chủ ở đường dẫn gốc */}
        <Route path="/" element={<div>Đây là Trang chủ (Public)</div>} />
        
        {/* 2. THÊM DÒNG NÀY: Cấp cho trang Profile một cái đường dẫn riêng */}
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;