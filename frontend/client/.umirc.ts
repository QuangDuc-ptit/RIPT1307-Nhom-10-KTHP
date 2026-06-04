import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    { path: '/', component: '@/pages/public/Landingpage/LandingPage' },
    // 👇 Thêm wrapper cho route /home-page
    { 
      path: '/home-page', 
      component: '@/pages/main/home/home-page',
      wrappers: ['@/wrappers/AuthWrapper'],   // ← thêm dòng này
    },
    // 👇 Các route con của /user có thể dùng chung wrapper nếu đặt cấu trúc lồng
    {
      path: '/user',
      component: '@/layouts/UserLayout',       // layout cho user (tuỳ chọn)
      wrappers: ['@/wrappers/AuthWrapper'],   // bảo vệ toàn bộ route con
      routes: [
        { path: '/user', component: '@/pages/user/DashboardPage' },
        { path: '/user/profile', component: '@/pages/user/profile' },
        { path: '/user/change-password', component: '@/pages/user/ChangePasswordPage' },
      ],
    },
    // Các route công khai không cần wrapper
    { path: '/auth/login', component: '@/pages/auth/LoginPage' },
    { path: '*', component: '@/pages/main/not-found-page' },
  ],
  // ... cấu hình khác
});