import React from 'react';
import { Button } from 'antd';
import { 
  GlobalOutlined, 
  DribbbleOutlined, 
  MailOutlined,
  AppleFilled,
  AndroidFilled,
  VideoCameraOutlined
} from '@ant-design/icons';

const AppFooter: React.FC = () => {
  const colors = {
    bg: '#120e10', // Nền footer thường tối hơn nền web 1 chút để tạo chiều sâu
    primary: '#e42755',
    textDim: '#a3989c',
    textWhite: '#ffffff',
    border: '#2d2025'
  };

  const colStyle = { display: 'flex', flexDirection: 'column' as const, gap: '16px' };
  const headingStyle = { color: colors.textWhite, fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0' };
  const linkStyle = { color: colors.textDim, fontSize: '14px', cursor: 'pointer', transition: 'color 0.3s' };

  return (
    <div style={{ backgroundColor: colors.bg, paddingTop: '60px', paddingBottom: '24px', borderTop: `1px solid ${colors.border}` }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%', display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>
        
        {/* Cột 1: Brand & Mô tả */}
        <div style={{ ...colStyle, flex: '2', minWidth: '250px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.primary, fontSize: '24px', fontWeight: '900' }}>
            {/* Dùng icon VideoCamera tạm thay cho logo gốc */}
            <VideoCameraOutlined /> KSTAR
          </div>
          <p style={{ color: colors.textDim, fontSize: '14px', lineHeight: '1.6', maxWidth: '300px', margin: 0 }}>
            Điểm đến lý tưởng dành cho những người yêu điện ảnh. Trải nghiệm chất lượng rạp chiếu tốt nhất và đặt vé dễ dàng chỉ với vài thao tác.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <GlobalOutlined style={{ color: colors.textDim, fontSize: '20px', cursor: 'pointer' }} />
            <DribbbleOutlined style={{ color: colors.textDim, fontSize: '20px', cursor: 'pointer' }} />
            <MailOutlined style={{ color: colors.textDim, fontSize: '20px', cursor: 'pointer' }} />
          </div>
        </div>

        {/* Cột 2: Quick Links */}
        <div style={{ ...colStyle, flex: '1', minWidth: '150px' }}>
          <h3 style={headingStyle}>Quick Links</h3>
          <div style={linkStyle} className="footer-hover">Tất cả phim</div>
          <div style={linkStyle} className="footer-hover">Hệ thống rạp</div>
          <div style={linkStyle} className="footer-hover">Khuyến mãi</div>
          <div style={linkStyle} className="footer-hover">Ưu đãi</div>
        </div>

        {/* Cột 3: Chăm sóc khách hàng */}
        <div style={{ ...colStyle, flex: '1', minWidth: '150px' }}>
          <h3 style={headingStyle}>Chăm sóc khách hàng</h3>
          <div style={linkStyle} className="footer-hover">Trung tâm trợ giúp</div>
          <div style={linkStyle} className="footer-hover">Chính sách bảo mật</div>
          <div style={linkStyle} className="footer-hover">Điều khoản dịch vụ</div>
          <div style={linkStyle} className="footer-hover">Chính sách hoàn tiền</div>
        </div>

        {/* Cột 4: Tải ứng dụng */}
        <div style={{ ...colStyle, flex: '1.5', minWidth: '200px' }}>
          <h3 style={headingStyle}>Tải ứng dụng</h3>
          
          {/* Nút Google Play */}
          <Button 
            style={{ backgroundColor: '#212836', border: 'none', height: 'auto', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start' }}
          >
            <AndroidFilled style={{ fontSize: '24px', color: colors.textWhite }} />
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '10px', color: colors.textDim, textTransform: 'uppercase' }}>Tải trên</div>
              <div style={{ fontSize: '14px', color: colors.textWhite, fontWeight: 'bold' }}>Google Play</div>
            </div>
          </Button>

          {/* Nút App Store */}
          <Button 
            style={{ backgroundColor: '#212836', border: 'none', height: 'auto', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', marginTop: '4px' }}
          >
            <AppleFilled style={{ fontSize: '24px', color: colors.textWhite }} />
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ fontSize: '10px', color: colors.textDim, textTransform: 'uppercase' }}>Tải trên</div>
              <div style={{ fontSize: '14px', color: colors.textWhite, fontWeight: 'bold' }}>App Store</div>
            </div>
          </Button>
        </div>

      </div>

      {/* Dòng Copyright cuối cùng */}
      <div style={{ maxWidth: '1200px', margin: '40px auto 0', padding: '24px 5% 0', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
        <p style={{ color: colors.textDim, fontSize: '12px', margin: 0 }}>
          © 2024 KStar Cinema. Mọi quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
};

export default AppFooter;