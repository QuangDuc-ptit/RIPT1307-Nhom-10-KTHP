import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  RocketOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { env } from '@/config/env';

const { Title, Paragraph } = Typography;

const features = [
  {
    icon: <RocketOutlined />,
    title: 'Khởi động nhanh',
    desc: 'Vite + React 18 + TypeScript + Antd 5 — chạy `npm run dev` là có ngay.',
  },
  {
    icon: <SafetyOutlined />,
    title: 'Bảo mật sẵn',
    desc: 'Auth bằng JWT + refresh token, axios interceptor tự gắn header, protected route.',
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'Quy mô rõ ràng',
    desc: 'Folder theo feature, lazy load route, store global với Zustand.',
  },
  {
    icon: <ApiOutlined />,
    title: 'API có chuẩn',
    desc: 'Backend Express + Prisma + Postgres trả response chuẩn `{success,data}`.',
  },
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{env.appName} — Trang chủ</title>
      </Helmet>

      <section
        style={{
          padding: '64px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg,#f0f5ff 0%,transparent 100%)',
          borderRadius: 16,
          marginBottom: 48,
        }}
      >
        <Title style={{ fontSize: 48, marginBottom: 8 }}>
          Base Web sẵn sàng để code <span style={{ color: '#1677ff' }}>thật</span>
        </Title>
        <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 720, margin: '0 auto 24px' }}>
          Bộ template chia tách rõ <b>client</b> và <b>admin</b>, có sẵn backend
          mẫu — bạn chỉ cần tập trung vào nghiệp vụ riêng của dự án.
        </Paragraph>
        <Space size='middle'>
          <Link to='/blog'>
            <Button type='primary' size='large'>
              Xem blog mẫu
            </Button>
          </Link>
          <Link to='/auth/register'>
            <Button size='large'>Đăng ký miễn phí</Button>
          </Link>
        </Space>
      </section>

      <Row gutter={[24, 24]}>
        {features.map((f) => (
          <Col key={f.title} xs={24} sm={12} lg={6}>
            <Card hoverable style={{ height: '100%' }}>
              <div style={{ fontSize: 32, color: '#1677ff', marginBottom: 12 }}>{f.icon}</div>
              <Title level={4}>{f.title}</Title>
              <Paragraph style={{ color: '#666', margin: 0 }}>{f.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
