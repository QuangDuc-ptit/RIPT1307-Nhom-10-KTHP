import React from 'react';
import { Button } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ẩn Header ở trang Đăng nhập để giao diện Auth được sạch sẽ
  if (location.pathname.includes('/auth')) return null;

  return (
    <div style={{
      backgroundColor: '#110c0e', // Màu nền đen nhám
      padding: '0 5%',
      height: '76px', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      borderBottom: '1px solid #2d2025'
    }}>
      
      {/* LOGO BÊN TRÁI */}
      <div 
        onClick={() => navigate('/')} 
        style={{ color: '#e42755', fontSize: '32px', fontWeight: '900', cursor: 'pointer', letterSpacing: '2px' }}
      >
        KSTAR
      </div>

      {/* MENU ĐIỀU HƯỚNG CHÍNH Ở GIỮA */}
      <div style={{ display: 'flex', gap: '40px', fontSize: '16px', fontWeight: '600' }}>
        <div style={{ cursor: 'pointer', color: location.pathname === '/' ? '#e42755' : '#fff', transition: 'color 0.3s' }} onClick={() => navigate('/')}>Trang chủ</div>
        <div style={{ cursor: 'pointer', color: location.pathname.includes('/movie') ? '#e42755' : '#fff', transition: 'color 0.3s' }} onClick={() => navigate('/movie/m1')}>Phim</div>
        <div style={{ cursor: 'pointer', color: location.pathname.includes('/food') ? '#e42755' : '#fff', transition: 'color 0.3s' }} onClick={() => navigate('/food')}>Bắp nước</div>
        <div style={{ cursor: 'pointer', color: '#fff', transition: 'color 0.3s' }}>Tin tức</div>
        <div style={{ cursor: 'pointer', color: '#fff', transition: 'color 0.3s' }}>Liên hệ</div>
      </div>

      {/* CÁC NÚT HÀNH ĐỘNG BÊN PHẢI */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Button 
          type="text" 
          icon={<HistoryOutlined />} 
          style={{ color: '#fff', fontWeight: '500', fontSize: '15px' }} 
          onClick={() => navigate('/orders')}
        >
          Lịch sử vé
        </Button>
        <Button 
          type="primary" 
          onClick={() => navigate('/auth/login')} 
          style={{ backgroundColor: '#e42755', border: 'none', borderRadius: '24px', fontWeight: 'bold', padding: '0 24px', height: '42px', fontSize: '15px' }}
        >
          Đăng nhập
        </Button>
      </div>

    </div>
  );
};

export default AppHeader;