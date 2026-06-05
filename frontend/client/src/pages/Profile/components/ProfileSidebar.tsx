import React, { useState } from 'react';
import { Avatar } from 'antd';
import { UserOutlined, SettingOutlined, SafetyCertificateOutlined, BellOutlined, LockOutlined } from '@ant-design/icons';
import { SidebarProps } from '../typing'; 
import { useAuthStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, user }) => {
  const colors = { bgCard: '#1d171a', border: '#3b2a31', primary: '#e42755', textDim: '#a3989c', hoverBg: 'rgba(228, 39, 85, 0.1)' };
  const logout = useAuthStore((s: any) => s.logout);
  const navigate = useNavigate();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuItems = [
    { key: 'hoso', icon: <UserOutlined />, label: 'Hồ sơ' },
    { key: 'taikhoan', icon: <SettingOutlined />, label: 'Tài khoản' },
    { key: 'baomat', icon: <SafetyCertificateOutlined />, label: 'Bảo mật' },
    { key: 'thongbao', icon: <BellOutlined />, label: 'Thông báo' },
    { key: 'quyen', icon: <LockOutlined />, label: 'Quyền riêng tư' },
  ];

  if (!user) return <div style={{ width: '280px', padding: '24px', color: 'white' }}>Đang tải...</div>;

  // Ép kiểu để lấy avatar an toàn không sợ TypeScript đỏ màn hình
  const avatarImg = (user as any).avatar;

  return (
    <div style={{ width: '280px', borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '24px' }}>
      
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: colors.bgCard, borderRadius: '16px', marginBottom: '32px', border: `1px solid ${colors.border}` }}
      >
        {/* 🟢 Render ảnh đại diện ở Sidebar */}
        <Avatar src={avatarImg} size={48} style={{ backgroundColor: '#fcdfd5', color: colors.primary, fontWeight: 'bold', fontSize: '20px' }}>
          {!avatarImg && (user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U')}
        </Avatar>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>{user.firstName} {user.lastName}</div>
          <div style={{ fontSize: '13px', color: colors.textDim, marginTop: '2px' }}>{user.rank || 'Khách hàng'}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key;
          const isHovered = hoveredMenu === item.key;
          return (
            <div key={item.key} onClick={() => setActiveMenu(item.key)} onMouseEnter={() => setHoveredMenu(item.key)} onMouseLeave={() => setHoveredMenu(null)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', backgroundColor: isActive ? colors.primary : (isHovered ? colors.hoverBg : 'transparent'), color: isActive ? '#fff' : (isHovered ? colors.primary : colors.textDim), fontWeight: isActive ? 'bold' : '500', transition: 'all 0.3s ease', transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)' }}>
              <span style={{ fontSize: '20px', transition: 'transform 0.3s ease', transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}>{item.icon}</span>
              <span style={{ fontSize: '15px' }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      <div onClick={async () => { await logout(); navigate('/auth/login'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', color: '#E21D48', fontWeight: 'bold', borderRadius: '12px', marginTop: '20px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#E21D48"/></svg>
        <span>Đăng xuất</span>
      </div>
    </div>
  );
};

export default ProfileSidebar;