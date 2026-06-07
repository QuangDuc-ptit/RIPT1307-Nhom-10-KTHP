import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Button, Space, Avatar, Badge, Dropdown, Input } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#ff1e00', fontSize: '24px', fontWeight: 900, cursor: 'pointer', marginRight: '40px' }} onClick={() => navigate("/")}>
          KSTAR
        </div>
        
        <Space size="large">
          <span style={{ color: '#fff', cursor: 'pointer', borderBottom: '2px solid #1890ff', paddingBottom: '4px', fontWeight: 'bold' }} onClick={() => navigate("/")}>Trang chủ</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} onClick={() => navigate("/movies")}>Phim</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} onClick={() => navigate("/news")}>Tin tức</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} onClick={() => navigate("/contact")}>Liên hệ</span>
        </Space>
      </div>

      <Space size="large">
        <Input 
          placeholder="Tìm phim..." 
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }}/>} 
          style={{ 
            borderRadius: '20px', 
            backgroundColor: '#2b2b2b', 
            color: '#fff', 
            border: 'none', 
            width: '250px',
            padding: '8px 16px'
          }} 
        />
        {isLoggedIn ? (
          <>
            <Badge dot><BellOutlined style={{ color: '#fff', fontSize: 20, cursor: 'pointer' }} /></Badge>
            <Dropdown 
              menu={{
                items: [
                  { key: 'profile', label: 'Thông tin tài khoản', onClick: () => navigate('/profile') },
                  ...(user?.role === 'ADMIN' ? [{ key: 'admin', label: 'Vào trang Admin', onClick: () => window.location.href = 'https://kstar-admin.netlify.app/dashboard' }] : []),
                  { key: 'logout', label: 'Đăng xuất', danger: true, onClick: async () => { await logout(); navigate('/auth/login'); } }
                ]
              }} 
              placement="bottomRight"
              trigger={['click']}
            >
              <Avatar style={{ cursor: 'pointer', border: '2px solid #ff1e00' }} src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ"} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" style={{ background: '#E50914', border: 'none', borderRadius: 20, fontWeight: 'bold', padding: '0 24px', height: '38px' }} onClick={onLoginClick}>Đăng nhập</Button>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader; // Chỉ export duy nhất 1 lần