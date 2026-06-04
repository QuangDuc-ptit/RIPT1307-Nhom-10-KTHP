import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined, SettingOutlined, SafetyCertificateOutlined, BellOutlined, LockOutlined } from '@ant-design/icons';
import { SidebarProps } from '../typing';

const ProfileSidebar: React.FC<SidebarProps> = ({ activeMenu, setActiveMenu, user }) => {
  const colors = { bgCard: '#1d171a', border: '#3b2a31', primary: '#e42755', textDim: '#a3989c' };

  const menuItems = [
    { key: 'hoso', icon: <UserOutlined />, label: 'Hồ sơ' },
    { key: 'taikhoan', icon: <SettingOutlined />, label: 'Tài khoản' },
    { key: 'baomat', icon: <SafetyCertificateOutlined />, label: 'Bảo mật' },
    { key: 'thongbao', icon: <BellOutlined />, label: 'Thông báo' },
    { key: 'quyen', icon: <LockOutlined />, label: 'Quyền riêng tư' },
  ];

  return (
    <div style={{ width: '280px', borderRight: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', padding: '24px' }}>
      {/* Khối Thông tin User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: colors.bgCard, borderRadius: '16px', marginBottom: '32px', border: `1px solid ${colors.border}` }}>
        <Avatar size={48} style={{ backgroundColor: '#f0d9c4', color: '#000', fontWeight: 'bold' }}>
          {user.firstName.charAt(0)}
        </Avatar>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{user.firstName} {user.lastName}</div>
          <div style={{ fontSize: '12px', color: colors.textDim }}>{user.rank}</div>
        </div>
      </div>

      {/* Menu Điều Hướng */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <div
              key={item.key}
              onClick={() => setActiveMenu(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                borderRadius: '12px', cursor: 'pointer',
                backgroundColor: isActive ? colors.primary : 'transparent',
                color: isActive ? '#fff' : colors.textDim,
                fontWeight: isActive ? 'bold' : 'normal',
                transition: 'all 0.3s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '15px' }}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Nút Đăng Xuất */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', color: colors.primary, fontWeight: 'bold' }}>
        
        {/* ĐÂY LÀ ĐOẠN MÃ SVG BẠN VỪA THÊM VÀO */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#E21D48"/>
        </svg>
        
        <span>Đăng xuất</span>
      </div>
    </div>
  );
};

export default ProfileSidebar;