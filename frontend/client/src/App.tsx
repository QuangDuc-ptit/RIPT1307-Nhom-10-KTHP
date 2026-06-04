import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTS BẢO MẬT & STORE (Từ nhánh Karlis-3) ---
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuthStore } from '@/store/auth';

// --- IMPORTS CÁC TRANG (PAGES) ---
import LandingPage from './pages/Public/LandingPage';
import HomePage from './pages/Public/HomePage/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Các trang chức năng
import ProfilePage from './pages/Profile';
import MovieDetailPage from './pages/Movie'; // Karlis đang dùng path này thay vì MovieDetail
import OrderHistoryPage from './pages/OrderHistory';
import CheckoutPage from './pages/Checkout';
import FoodDrinkPage from './pages/FoodDrink'; // Trang của bạn thêm vào

function App() {
  // Lấy hàm bootstrap từ store để kiểm tra trạng thái đăng nhập (Từ nhánh Karlis-3)
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- NHÓM PUBLIC (Không cần đăng nhập) --- */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Redirects */}
        <Route path="/landingpage" element={<Navigate to="/" replace />} />
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />

        {/* Nhóm Đăng nhập/Đăng ký */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} /> {/* Đã sửa: Trỏ đúng về RegisterPage */}

        {/* Debug: Route copy của HomePage để test không cần đăng nhập */}
        <Route path="/home-debug" element={<HomePage />} />


        {/* --- NHÓM PROTECTED (Bắt buộc đăng nhập mới được vào) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Trang Đồ ăn & thức uống của bạn (Đưa vào nhóm cần đăng nhập, nếu là trang public bạn có thể kéo ra ngoài) */}
          <Route path="/food" element={<FoodDrinkPage />} />
        </Route>


        {/* --- BẮT LỖI 404 --- */}
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