import { Routes, Route, Navigate } from 'react-router-dom';

// Import Layouts & Routes
import ProtectedRoute from './ProtectedRoute';

// Import Pages
import LandingPage from "../pages/LandingPage/LandingPage";
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import MovieDetailPage from '../pages/MovieDetail';
import ProfilePage from '../pages/Profile';
import OrderHistoryPage from '../pages/OrderHistory';
import CheckoutPage from '../pages/Checkout';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import ChonGhe from '../pages/ChonGhe/chon-ghe';
import FoodDrinkPage from '../pages/ChonGhe/food-drink/food-drink'; // <- import mới
import NotFoundPage from '../pages/Static/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/landingpage" element={<Navigate to="/" replace />} />
      <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/home-debug" element={<HomePage />} />
      
      {/* Route chọn ghế và đồ ăn */}
      <Route path="/chon-ghe" element={<ChonGhe />} />
      <Route path="/food-drink" element={<FoodDrinkPage />} />  {/* <- route mới */}

      {/* Routes yêu cầu đăng nhập */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}