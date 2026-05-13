import { Outlet } from 'react-router-dom';
import { env } from '@/config/env';

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#3f51b5 0%,#1a237e 100%)',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          padding: '40px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: 4 }}>{env.appName}</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 32 }}>
          Khu vực quản trị
        </p>
        <Outlet />
      </div>
    </div>
  );
}
