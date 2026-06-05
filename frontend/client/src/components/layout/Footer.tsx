import React from 'react';
import {
  Button,
  Row,
  Col,
  Typography,
  Space,
  Divider,
} from 'antd';
import {
  GlobalOutlined,
  DribbbleOutlined,
  MailOutlined,
  AppleFilled,
  AndroidFilled,
  VideoCameraOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AppFooter: React.FC = () => {
  // Màu sắc theo phong cách mẫu mới
  const footerStyles = {
    primary: '#e42755',          // màu đỏ đặc trưng
    primaryRed: '#e42755',
    onSurfaceVariant: '#a3989c', // màu chữ mờ
    surfaceVariant: '#212836',   // nền button
  };

  return (
    <footer
      style={{
        background: '#110706',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '56px 48px 32px',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <Row gutter={[48, 32]}>
          {/* Cột 1: Logo + mô tả + social icons */}
          <Col xs={24} md={6}>
            <Title
              level={4}
              style={{
                color: footerStyles.primary,
                marginBottom: 20,
                fontWeight: 800,
                fontSize: '24px',
              }}
            >
              <VideoCameraOutlined /> KSTAR
            </Title>
            <Paragraph
              style={{
                color: footerStyles.onSurfaceVariant,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Điểm đến lý tưởng dành cho những người yêu điện ảnh.
              Trải nghiệm chất lượng rạp chiếu tốt nhất và đặt vé dễ dàng chỉ với vài thao tác.
            </Paragraph>
            <Space size="middle">
              <Button
                shape="circle"
                icon={<GlobalOutlined />}
                style={{
                  background: footerStyles.surfaceVariant,
                  border: 'none',
                  color: footerStyles.onSurfaceVariant,
                }}
              />
              <Button
                shape="circle"
                icon={<DribbbleOutlined />}
                style={{
                  background: footerStyles.surfaceVariant,
                  border: 'none',
                  color: footerStyles.onSurfaceVariant,
                }}
              />
              <Button
                shape="circle"
                icon={<MailOutlined />}
                style={{
                  background: footerStyles.surfaceVariant,
                  border: 'none',
                  color: footerStyles.onSurfaceVariant,
                }}
              />
            </Space>
          </Col>

          {/* Cột 2: Quick Links (tất cả phim, hệ thống rạp, khuyến mãi, ưu đãi) */}
          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                color: footerStyles.primary,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Khám phá
            </Title>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Tất cả phim
                </a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Hệ thống rạp
                </a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Khuyến mãi
                </a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Ưu đãi
                </a>
              </li>
            </ul>
          </Col>

          {/* Cột 3: Chăm sóc khách hàng */}
          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                color: footerStyles.primary,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Chăm sóc khách hàng
            </Title>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Trung tâm trợ giúp
                </a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Chính sách bảo mật
                </a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Điều khoản dịch vụ
                </a>
              </li>
              <li style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: footerStyles.onSurfaceVariant }}>
                  Chính sách hoàn tiền
                </a>
              </li>
            </ul>
          </Col>

          {/* Cột 4: Tải ứng dụng */}
          <Col xs={24} md={6}>
            <Title
              level={5}
              style={{
                color: footerStyles.primary,
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              Tải ứng dụng
            </Title>
            <Button
              style={{
                backgroundColor: footerStyles.surfaceVariant,
                border: 'none',
                height: 'auto',
                padding: '10px 20px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                justifyContent: 'flex-start',
                marginBottom: 12,
                width: '100%',
              }}
            >
              <AndroidFilled style={{ fontSize: 24, color: '#fff' }} />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: footerStyles.onSurfaceVariant,
                    textTransform: 'uppercase',
                  }}
                >
                  Tải trên
                </div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>
                  Google Play
                </div>
              </div>
            </Button>
            <Button
              style={{
                backgroundColor: footerStyles.surfaceVariant,
                border: 'none',
                height: 'auto',
                padding: '10px 20px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                justifyContent: 'flex-start',
                width: '100%',
              }}
            >
              <AppleFilled style={{ fontSize: 24, color: '#fff' }} />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: footerStyles.onSurfaceVariant,
                    textTransform: 'uppercase',
                  }}
                >
                  Tải trên
                </div>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>
                  App Store
                </div>
              </div>
            </Button>
          </Col>
        </Row>

        <Divider style={{ background: 'rgba(255,255,255,0.05)', margin: '40px 0 24px' }} />
        <Text
          style={{
            color: footerStyles.onSurfaceVariant,
            display: 'block',
            textAlign: 'center',
            fontSize: '13px',
          }}
        >
          © 2024 KSTAR Cinema. All Rights Reserved.
        </Text>
      </div>
    </footer>
  );
};

export default AppFooter;