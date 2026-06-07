import { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Space, Tag, Table, Progress, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { 
  MoneyCollectOutlined,
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

const formatVND = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === '') return '-- đ';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
};

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

import { dashboardService, DashboardStats } from '../../services/dashboard.service';

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState('7 ngày gần nhất');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const days = timeFilter === '7 ngày gần nhất' ? 7 : 14;
        const data = await dashboardService.getStats(days);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [timeFilter]);

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

  const currentChartData = stats?.revenueTrend || [];
  
  const bookingColumns = [
    {
      key: 'user',
      title: 'KHÁCH HÀNG',
      dataIndex: 'user',
      render: (user: string) => <Text style={{ fontWeight: 500 }}>{user || '--'}</Text>
    },
    { key: 'movie', title: 'PHIM', dataIndex: 'movie', render: (text: string) => text || '--' },
    { key: 'theater', title: 'PHÒNG', dataIndex: 'theater', render: (text: string) => text || '--' },
    { 
      key: 'amount', 
      title: 'SỐ TIỀN', 
      dataIndex: 'amount', 
      render: (amount: number | string) => <Text strong>{formatVND(amount)}</Text> 
    },
    {
      key: 'status',
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
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
                <MoneyCollectOutlined style={{ color: '#10b981', fontSize: 20 }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{loading ? '-- đ' : formatVND(stats?.totalRevenue || 0)}</Title>
              <Tag color="green"><ArrowUpOutlined /> Tăng</Tag>
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
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{loading ? '--' : stats?.ticketsSold || 0}</Title>
              <Tag color="blue"><ArrowUpOutlined /> Tăng</Tag>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" strong>NGƯỜI DÙNG MỚI</Text>
                <UserOutlined style={{ color: '#3b82f6', fontSize: 20 }} />
              </div>
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{loading ? '--' : stats?.newUsers || 0}</Title>
              <Tag color="red"><ArrowDownOutlined /> Giảm</Tag>
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
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{loading ? '--' : stats?.occupancyRate || 0}%</Title>
              <Tag color="green"><ArrowUpOutlined /> Tăng</Tag>
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
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => value === 0 ? '0' : `${value.toLocaleString('vi-VN')}đ`} />
                  <Tooltip formatter={(value) => [formatVND(value as number), 'Doanh thu']} />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<Text strong>Phim ăn khách nhất</Text>} 
            extra={<Text type="secondary" style={{ fontSize: 12 }}>Tháng này</Text>}
            style={{ borderRadius: 12, height: '400px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {(stats?.topMovies || []).map((m, index) => {
                const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];
                return (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text strong>{m.title}</Text>
                      <Text type="secondary">{m.tickets} vé</Text>
                    </div>
                    <Progress percent={m.percentage} showInfo={false} strokeColor={colors[index % colors.length]} />
                  </div>
                );
              })}
              {!loading && (!stats?.topMovies || stats.topMovies.length === 0) && (
                <Text type="secondary">Chưa có dữ liệu</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={<Text strong>Giám sát thời gian thực</Text>} style={{ borderRadius: 12, height: '420px' }}>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <Text type="secondary">Người dùng đang trực tuyến</Text>
              <Title level={1} style={{ margin: '10px 0', color: '#3b82f6' }}>{Math.floor(Math.random() * 20) + 1}</Title>
            </div>
            
            <Card size="small" style={{ background: '#f8fafc', marginBottom: 15 }}>
              <Space>
                <InfoCircleOutlined style={{ color: '#3b82f6' }} />
                <Text>Số ghế đang giữ (Chờ thanh toán): <strong style={{ color: '#ef4444' }}>{loading ? '--' : stats?.activeHoldSeats || 0}</strong></Text>
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
              dataSource={stats?.recentBookings || []} 
              pagination={false}
              loading={loading}
              size="middle"
              locale={{ emptyText: 'Đang chờ dữ liệu giao dịch mới...' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}