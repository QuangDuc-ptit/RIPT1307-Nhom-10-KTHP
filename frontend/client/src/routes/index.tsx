// src/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';

// Import các Pages từ thư mục auth
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

export const router = createBrowserRouter([
  // --- NHÓM ROUTE XÁC THỰC (AUTH) ---
  // Đã thêm "/auth" để sửa lỗi "No routes matched location"
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },

  // --- NHÓM ROUTE PUBLIC (Trang chủ công khai) ---
  {
    path: '/',
    children: [
      {
        index: true,
        element: <div>Đây là Trang chủ (Public)</div>,
      },
    ],
  },
]);