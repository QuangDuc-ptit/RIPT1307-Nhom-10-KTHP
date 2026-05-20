import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/bg-login.jpg")', /* Thay tên file ảnh của bạn vào đây */
        backgroundSize: 'cover',                 /* Ép ảnh phủ kín toàn bộ màn hình */
        backgroundPosition: 'center',            /* Căn ảnh vào giữa */
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          backgroundColor: '#1E1E1E', /* Màu nền của cái form */
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
        }}
      >
        {/* ĐÂY LÀ ĐIỂM QUAN TRỌNG NHẤT: Bắt buộc phải có {children} để nó nhét cái form đăng nhập vào giữa cái khung này */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;