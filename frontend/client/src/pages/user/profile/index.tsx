import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import { SafetyCertificateFilled, BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// Import các component và Type vừa tạo
import ProfileSidebar from './components/ProfileSidebar';
import AccountForm from './components/AccountForm';
import { UserProfile } from './typing';

const ProfilePage: React.FC = () => {
  // 1. Áp dụng Hook useState (Đúng chuẩn Sơ đồ tư duy)
  const [activeMenu, setActiveMenu] = useState<string>('hoso');

  // 2. Dữ liệu mock (Sau này sẽ dùng useModel lấy từ API ở đây)
  const mockUser: UserProfile = {
    firstName: 'Karlis',
    lastName: 'Pham',
    email: 'karlispham021@example.com',
    bio: 'Là một khách hàng kim cương.',
    joinDate: 'tháng 10/2023',
    rank: 'Khách hàng kim cương',
    isVerified: true
  };

  const colors = { bgApp: '#151113', border: '#3b2a31', primary: '#e42755', textMain: '#ffffff', textDim: '#a3989c' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bgApp, color: colors.textMain }}>
      
      {/* CỘT TRÁI: Import Component Sidebar */}
      <ProfileSidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        user={mockUser} 
      />

      {/* CỘT PHẢI: Nội dung chính */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: 'bold' }}>
            <SafetyCertificateFilled style={{ color: colors.primary, fontSize: '24px' }} />
            Cài đặt tài khoản
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button shape="circle" icon={<BellOutlined />} style={{ backgroundColor: 'transparent', borderColor: colors.border, color: colors.textDim }} />
            <Button shape="circle" icon={<QuestionCircleOutlined />} style={{ backgroundColor: 'transparent', borderColor: colors.border, color: colors.textDim }} />
            <Avatar style={{ backgroundColor: '#f0d9c4', cursor: 'pointer' }}>K</Avatar>
          </div>
        </div>

        {/* Khu vực hiển thị Form dựa trên activeMenu */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1, display: 'flex', justifyContent: 'center' }}>
          {activeMenu === 'hoso' || activeMenu === 'taikhoan' ? (
            <AccountForm user={mockUser} />
          ) : (
            <div style={{ color: colors.textDim, marginTop: '50px' }}>Tính năng đang được phát triển...</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;