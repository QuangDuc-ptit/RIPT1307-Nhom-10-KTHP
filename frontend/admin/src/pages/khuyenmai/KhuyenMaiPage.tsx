import { useState } from 'react';
import { Space, Card, Button, Input, Select, Typography, Tag, Modal, Form, Table, Popconfirm, message, Row, Col, Dropdown } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, MoreOutlined, SoundOutlined, FieldTimeOutlined, DollarCircleOutlined, WalletOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Định nghĩa các loại trạng thái
type PromoStatus = 'active' | 'expiring_soon' | 'expired';

interface PromotionItem {
  id: string;
  name: string;
  endDate: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: PromoStatus;
}

const INITIAL_PROMOTIONS: PromotionItem[] = [
  { id: '1', name: 'thành viên vip', endDate: '2026-06-01', code: 'vip 123', type: 'percentage', value: 10, status: 'active' },
  { id: '2', name: 'khuyến mãi mới', endDate: '2026-05-24', code: 'Mới', type: 'fixed', value: 10000, status: 'expired' },
  { id: '3', name: 'mã giảm giá', endDate: '2026-05-31', code: 'vip12', type: 'fixed', value: 20000, status: 'expiring_soon' },
  { id: '4', name: 'Mùa Hè Sôi Động', endDate: '2026-06-06', code: 'SUMMER999', type: 'percentage', value: 20, status: 'active' },
  { id: '5', name: 'Thành Viên Mới', endDate: '2026-12-31', code: 'WELCOME10', type: 'fixed', value: 10000, status: 'active' },
];

export default function KhuyenMaiPage() {
  const [promoList, setPromoList] = useState<PromotionItem[]>(() => {
    const saved = localStorage.getItem('global_promo_list');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PromotionItem | null>(null);
  const [form] = Form.useForm();

  const saveToLocalStorage = (newData: PromotionItem[]) => {
    setPromoList(newData);
    localStorage.setItem('global_promo_list', JSON.stringify(newData));
  };

  // Chỉ tính 2 con số màn hình có thể đếm được
  const activeCount = promoList.filter(p => p.status === 'active').length;
  const expiringCount = promoList.filter(p => p.status === 'expiring_soon').length;

  const handleSave = (values: any) => {
    let updated;
    if (editingItem) {
      updated = promoList.map(item => item.id === editingItem.id ? { ...item, ...values } : item);
      message.success('Cập nhật thành công!');
    } else {
      const newItem: PromotionItem = { id: Math.random().toString(), ...values };
      updated = [newItem, ...promoList];
      message.success('Thêm mới thành công!');
    }
    saveToLocalStorage(updated);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    const updated = promoList.filter(item => item.id !== id);
    saveToLocalStorage(updated);
    message.success('Đã xóa khuyến mãi!');
  };

  const filteredData = promoList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) || 
                         item.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Đang diễn ra' },
    { value: 'expiring_soon', label: 'Sắp hết hạn' },
    { value: 'expired', label: 'Đã kết thúc' },
  ];

  const columns = [
    {
      title: 'TÊN KHUYẾN MÃI',
      key: 'name',
      render: (_: any, record: PromotionItem) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ fontWeight: 600, color: '#1e293b' }}>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>Hết hạn: {new Date(record.endDate).toLocaleDateString('vi-VN')}</Text>
        </div>
      ),
    },
    {
      title: 'MÃ CODE',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <Tag style={{ fontWeight: 600, background: '#f1f5f9' }}>{code}</Tag>
      ),
    },
    {
      title: 'LOẠI',
      dataIndex: 'type',
      render: (type: string) => type === 'percentage' ? 'Phần trăm' : 'Giá trị cố định',
    },
    {
      title: 'GIÁ TRỊ',
      render: (_: any, record: PromotionItem) => (
        <span style={{ fontWeight: 600 }}>
          {record.type === 'percentage' ? `${record.value}%` : `${record.value.toLocaleString('vi-VN')}đ`}
        </span>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (status: PromoStatus) => {
        if (status === 'active') return <Tag color="green">Đang diễn ra</Tag>;
        if (status === 'expiring_soon') return <Tag color="warning">Sắp hết hạn</Tag>;
        return <Tag color="default">Đã kết thúc</Tag>;
      },
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: any, record: PromotionItem) => {
        const menuItems = [
          { key: 'edit', label: 'Sửa', icon: <EditOutlined />, onClick: () => { setEditingItem(record); form.setFieldsValue(record); setIsModalOpen(true); } },
          { key: 'delete', label: <Popconfirm title="Xóa mã này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" okButtonProps={{ danger: true }}><span style={{ color: '#ef4444' }}>Xóa</span></Popconfirm>, icon: <DeleteOutlined style={{ color: '#ef4444' }} /> }
        ];
        return <Dropdown menu={{ items: menuItems }} trigger={['click']}><Button type="text" icon={<MoreOutlined />} /></Dropdown>;
      },
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Chương trình Khuyến mãi</Title>
          <Text type="secondary">Theo dõi hiệu quả và quản lý các mã giảm giá tại hệ thống rạp.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItem(null); form.resetFields(); setIsModalOpen(true); }} style={{ borderRadius: 6, fontWeight: 600 }}>
          Thêm khuyến mãi
        </Button>
      </div>

      {/* STAT CARDS (HÀNG ĐẦU ĐÃ LÀM TRỐNG PHẦN CẦN BACKEND) */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>ĐANG HOẠT ĐỘNG</Text>
                {/* Đếm từ danh sách */}
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{activeCount}</Title>
              </Space>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SoundOutlined style={{ color: '#3b82f6' }} />
              </div>
            </div>
            {/* Chờ Backend gửi % */}
            <div style={{ marginTop: 12, height: 22 }}><Text style={{ color: '#cbd5e1' }}>--</Text></div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>LƯỢT SỬ DỤNG</Text>
                {/* Chờ Backend gửi số */}
                <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#cbd5e1' }}>--</Title>
              </Space>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WalletOutlined style={{ color: '#8b5cf6' }} />
              </div>
            </div>
            {/* Chờ Backend gửi % */}
            <div style={{ marginTop: 12, height: 22 }}><Text style={{ color: '#cbd5e1' }}>--</Text></div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>TỔNG TIỀN GIẢM</Text>
                {/* Chờ Backend gửi số */}
                <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#cbd5e1' }}>--</Title>
              </Space>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarCircleOutlined style={{ color: '#10b981' }} />
              </div>
            </div>
             {/* Chờ Backend gửi trạng thái ngân sách */}
            <div style={{ marginTop: 12, height: 22 }}><Text style={{ color: '#cbd5e1' }}>--</Text></div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: 11 }}>SẮP HẾT HẠN</Text>
                {/* Đếm từ danh sách */}
                <Title level={3} style={{ margin: 0, fontWeight: 700 }}>{expiringCount}</Title>
              </Space>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FieldTimeOutlined style={{ color: '#f97316' }} />
              </div>
            </div>
            {/* Nhãn cảnh báo UI */}
            <Tag color="orange" style={{ marginTop: 12 }}>Cần chú ý</Tag>
          </Card>
        </Col>
      </Row>

      {/* MAIN TABLE SECTION */}
      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 20, flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm tên chương trình hoặc mã code..."
            prefix={<SearchOutlined style={{ color: '#cbd5e1' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 320, borderRadius: 6 }}
          />
          
          <Space size="small">
            {filterOptions.map((opt) => (
              <Button
                key={opt.value}
                type={statusFilter === opt.value ? 'primary' : 'default'}
                shape="round"
                onClick={() => setStatusFilter(opt.value)}
                style={{ fontWeight: 500 }}
              >
                {opt.label}
              </Button>
            ))}
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ pageSize: 6 }} 
        />
      </Card>

      {/* MODAL THÊM / SỬA */}
      <Modal title={editingItem ? 'Chỉnh sửa khuyến mãi' : 'Thêm mới khuyến mãi'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Tên chương trình" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="code" label="Mã kích hoạt" rules={[{ required: true }]}><Input style={{ textTransform: 'uppercase' }} /></Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại" initialValue="percentage"><Select><Select.Option value="percentage">Phần trăm (%)</Select.Option><Select.Option value="fixed">Tiền mặt (đ)</Select.Option></Select></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="value" label="Giá trị" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="endDate" label="Ngày hết hạn" rules={[{ required: true }]}><Input type="date" /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="active">
                <Select>
                  <Select.Option value="active">Đang diễn ra</Select.Option>
                  <Select.Option value="expiring_soon">Sắp hết hạn</Select.Option>
                  <Select.Option value="expired">Đã kết thúc</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}