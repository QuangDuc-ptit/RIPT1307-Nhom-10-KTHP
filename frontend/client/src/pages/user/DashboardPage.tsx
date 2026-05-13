import { Card, Col, Row, Statistic, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { ClockCircleOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

const { Title, Paragraph } = Typography;

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Title level={2}>Xin chào, {user?.name} 👋</Title>
      <Paragraph type='secondary'>
        Đây là khu vực dành cho người dùng đã đăng nhập. Bạn có thể tuỳ biến trang này theo nghiệp vụ
        thực tế.
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title='Bài viết đã đọc' value={12} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title='Hoạt động trong tuần' value={5} prefix={<ClockCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title='Vai trò' value={user?.role || 'USER'} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
