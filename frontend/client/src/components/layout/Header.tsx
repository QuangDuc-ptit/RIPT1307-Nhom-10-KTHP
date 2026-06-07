import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Space, Avatar, Badge, Dropdown } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

const { Header } = Layout; // Lấy Header của Antd để làm khung

const AppHeader: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const isLoggedIn = !!user;

  // Style để giống phong cách AppFooter (sạch sẽ, không phụ thuộc class ngoài)
  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 48px',
    background: 'rgba(24, 10, 8, 0.75)', // Màu nền bạn đã chọn
    backdropFilter: 'blur(16px)',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  };

  return (
    <Header style={headerStyle}>
      <div style={{ color: '#ff1e00', fontSize: '24px', fontWeight: 900, cursor: 'pointer' }} onClick={() => navigate("/")}>
        KSTAR
      </div>
      
      <div style={{ flex: 1, marginLeft: '40px' }}>
        <Button type="text" style={{ color: '#fff' }} onClick={() => navigate("/")}>Trang chủ</Button>
      </div>

      <Space>
        {isLoggedIn ? (
          <>
            <Badge dot><BellOutlined style={{ color: '#fff', fontSize: 20 }} /></Badge>
            <Dropdown 
              menu={{
                items: [
                  { key: 'profile', label: 'Thông tin tài khoản', onClick: () => navigate('/profile') },
                  ...(user?.role === 'ADMIN' ? [{ key: 'admin', label: 'Vào trang Admin', onClick: () => window.location.href = 'https://kstar-admin.netlify.app/dashboard' }] : []),
                  { key: 'logout', label: 'Đăng xuất', danger: true, onClick: async () => { await logout(); navigate('/auth/login'); } }
                ]
              }} 
              placement="bottomRight"
            >
              <Avatar style={{ cursor: 'pointer' }} src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ"} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" danger onClick={onLoginClick}>Đăng nhập</Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader; // Chỉ export duy nhất 1 lần