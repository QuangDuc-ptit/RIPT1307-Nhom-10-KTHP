import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import { SafetyCertificateFilled, BellOutlined, QuestionCircleOutlined } from '@ant-design/icons';

// Import các component và Type
import ProfileSidebar from './components/ProfileSidebar';
import AccountForm from './components/AccountForm';
import { UserProfile } from './typing';

// Import useAuthStore để lấy dữ liệu user thật
import { useAuthStore } from '@/store/auth'; 

const ProfilePage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('hoso');

  // Ép kiểu any để bypass lỗi TypeScript
  const authUser: any = useAuthStore((state: any) => state.user);

  // Chuyển đổi dữ liệu, fallback về string trống hoặc giá trị mặc định nếu API không trả về
  const currentUser: UserProfile | null = authUser ? {
    firstName: authUser.firstName || authUser.name || 'Người',
    lastName: authUser.lastName || 'Dùng',
    email: authUser.email || '',
    bio: authUser.bio || 'Chưa có thông tin giới thiệu.',
    joinDate: authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString('vi-VN') : 'Gần đây',
    rank: authUser.rank || 'Khách hàng',
    isVerified: authUser.isVerified || false
  } : null;

  const colors = { bgApp: '#151113', border: '#3b2a31', primary: '#e42755', textMain: '#ffffff', textDim: '#a3989c' };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bgApp, color: colors.textMain, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Đang tải thông tin...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bgApp, color: colors.textMain }}>
      
      {/* CỘT TRÁI: Truyền dữ liệu thật xuống Sidebar */}
      <ProfileSidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        user={currentUser} 
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
            <Avatar style={{ backgroundColor: '#fcdfd5', color: colors.primary, fontWeight: 'bold', cursor: 'pointer' }}>
              {currentUser.firstName.charAt(0).toUpperCase()}
            </Avatar>
          </div>
        </div>

        {/* Khu vực hiển thị Form */}
        <div style={{ padding: '40px', overflowY: 'auto', flex: 1, display: 'flex', justifyContent: 'center' }}>
          {activeMenu === 'hoso' || activeMenu === 'taikhoan' ? (
            <AccountForm user={currentUser} />
          ) : (
            <div style={{ color: colors.textDim, marginTop: '50px' }}>Tính năng đang được phát triển...</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;