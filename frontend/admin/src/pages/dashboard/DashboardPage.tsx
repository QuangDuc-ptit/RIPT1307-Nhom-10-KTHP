import { useState } from 'react';
import { Row, Col, Card, Typography, Space, Tag, Table, Progress, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  DollarOutlined, 
  TagsOutlined, 
  UserOutlined, 
  DashboardOutlined, 
  DownOutlined, 
  CheckCircleFilled, 
  InfoCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ CHO BIỂU ĐỒ ---
const chartData7Days = [
  { name: 'Thứ 2', revenue: 0 },
  { name: 'Thứ 3', revenue: 0 },
  { name: 'Thứ 4', revenue: 0 },
  { name: 'Thứ 5', revenue: 0 },
  { name: 'Thứ 6', revenue: 0 },
  { name: 'Thứ 7', revenue: 0 },
  { name: 'Chủ Nhật', revenue: 0 },
];

const chartData14Days = [
  { name: 'Ngày 1', revenue: 0 },
  { name: 'Ngày 3', revenue: 0 },
  { name: 'Ngày 5', revenue: 0 },
  { name: 'Ngày 7', revenue: 0 },
  { name: 'Ngày 9', revenue: 0 },
  { name: 'Ngày 11', revenue: 0 },
  { name: 'Ngày 13', revenue: 0 },
  { name: 'Ngày 14', revenue: 0 },
];

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState('7 ngày gần nhất');

  const filterItems: MenuProps['items'] = [
    {
      key: '7days',
      label: '7 ngày gần nhất',
      onClick: () => setTimeFilter('7 ngày gần nhất'),
    },
    {
      key: '14days',
      label: '14 ngày gần nhất',
      onClick: () => setTimeFilter('14 ngày gần nhất'),
    },
  ];

  const currentChartData = timeFilter === '7 ngày gần nhất' ? chartData7Days : chartData14Days;
  
  const bookingColumns = [
    {
      title: 'KHÁCH HÀNG',
      dataIndex: 'user',
      key: 'user',
      render: (user: string) => <Text style={{ fontWeight: 500 }}>{user || '--'}</Text>
    },
    { title: 'PHIM', dataIndex: 'movie', key: 'movie', render: (text: string) => text || '--' },
    { title: 'PHÒNG', dataIndex: 'theater', key: 'theater', render: (text: string) => text || '--' },
    { title: 'SỐ TIỀN', dataIndex: 'amount', key: 'amount', render: (text: string) => text || '--' },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Completed' ? 'green' : 'orange'}>
          {status === 'Completed' ? 'Thành công' : 'Chờ xử lý'}
        </Tag>
      )
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Tổng quan hệ thống</Title>
        <Text type="secondary">Chào mừng trở lại! Đây là số liệu thống kê rạp phim của bạn hôm nay.</Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" strong>TỔNG DOANH THU</Text>
                <DollarOutlined style={{ color: '#3b82f6', fontSize: 20 }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>--</Title>
              <Tag color="green"><ArrowUpOutlined /> --%</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" strong>VÉ ĐÃ BÁN</Text>
                <TagsOutlined style={{ color: '#8b5cf6', fontSize: 20 }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>--</Title>
              <Tag color="blue"><ArrowUpOutlined /> --%</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" strong>NGƯỜI DÙNG MỚI</Text>
                <UserOutlined style={{ color: '#10b981', fontSize: 20 }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>--</Title>
              <Tag color="red"><ArrowDownOutlined /> --%</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" strong>TỶ LỆ LẤP ĐẦY</Text>
                <DashboardOutlined style={{ color: '#f59e0b', fontSize: 20 }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>--%</Title>
              <Tag color="green"><ArrowUpOutlined /> --%</Tag>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={<Text strong>Xu hướng Doanh thu</Text>} 
            extra={
              <Dropdown menu={{ items: filterItems }} trigger={['click']} placement="bottomRight">
                <Button type="text" size="small">
                  {timeFilter} <DownOutlined />
                </Button>
              </Dropdown>
            }
            style={{ borderRadius: 12, height: '400px' }}
          >
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={currentChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Top Phim ăn khách nhất - Đã thêm phim thứ 4 */}
        <Col xs={24} lg={8}>
          <Card 
            title={<Text strong>Phim ăn khách nhất</Text>} 
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Tháng này</Text>}
            style={{ borderRadius: 12, height: '400px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong>--</Text>
                  <Text type="secondary">-- vé</Text>
                </div>
                <Progress percent={0} showInfo={false} strokeColor="#3b82f6" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong>--</Text>
                  <Text type="secondary">-- vé</Text>
                </div>
                <Progress percent={0} showInfo={false} strokeColor="#8b5cf6" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong>--</Text>
                  <Text type="secondary">-- vé</Text>
                </div>
                <Progress percent={0} showInfo={false} strokeColor="#10b981" />
              </div>
              {/* PHIM THỨ 4 MỚI THÊM */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text strong>--</Text>
                  <Text type="secondary">-- vé</Text>
                </div>
                <Progress percent={0} showInfo={false} strokeColor="#f59e0b" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={<Text strong>Giám sát thời gian thực</Text>} style={{ borderRadius: 12, height: '420px' }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Text type="secondary">Người dùng đang trực tuyến</Text>
              <Title level={1} style={{ margin: '10px 0', color: '#3b82f6' }}>--</Title>
            </div>
            
            <Card size="small" style={{ background: '#f8fafc', marginBottom: 15 }}>
              <Space>
                <InfoCircleOutlined style={{ color: '#3b82f6' }} />
                <Text>Số ghế đang giữ (Chờ thanh toán): <strong style={{ color: '#ef4444' }}>--</strong></Text>
              </Space>
            </Card>

            <div style={{ marginTop: 20 }}>
              <Text type="secondary">Trạng thái hệ thống:</Text>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleFilled style={{ color: '#10b981', fontSize: 24 }} />
                <Text strong>Ổn định (Healthy)</Text>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card 
            title={<Text strong>Hoạt động đặt vé gần đây</Text>} 
            extra={<Button type="link">Xem tất cả</Button>}
            style={{ borderRadius: 12, height: '420px' }}
          >
            <Table 
              columns={bookingColumns} 
              dataSource={[]} 
              pagination={false}
              size="middle"
              locale={{ emptyText: 'Đang chờ dữ liệu giao dịch mới...' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}