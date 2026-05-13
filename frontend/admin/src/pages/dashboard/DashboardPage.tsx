import { Card, Col, Row, Statistic, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import {
  FileTextOutlined,
  RiseOutlined,
  TeamOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard — Admin</title>
      </Helmet>
      <Title level={2}>Tổng quan</Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Tổng người dùng'
              value={1284}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#3f51b5' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Bài viết'
              value={56}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Lượt xem hôm nay'
              value={2341}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title='Tăng trưởng tuần'
              value={12.3}
              suffix='%'
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Hướng dẫn</Title>
        <p>Đây là dashboard mẫu. Bạn có thể:</p>
        <ul>
          <li>
            Thay thế số liệu giả bằng API thật: tạo <code>src/api/stats.ts</code> rồi gọi
            ở đây bằng <code>useApi</code>.
          </li>
          <li>
            Thêm biểu đồ: cài <code>recharts</code> hoặc <code>@ant-design/charts</code>.
          </li>
          <li>
            Hiển thị các hoạt động gần đây, top users, top posts...
          </li>
        </ul>
      </Card>
    </>
  );
}
