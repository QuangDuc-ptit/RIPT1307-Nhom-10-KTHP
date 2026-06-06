import { useState } from 'react';
import { Space, Card, Button, Input, InputNumber, Select, Typography, Tag, Modal, Form, Table, Popconfirm, message, Image } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface FoodBeverageItem {
  id: string;
  name: string;
  category: 'popcorn' | 'drinks' | 'combos' | 'snacks';
  price: number;
  status: 'available' | 'out_of_stock';
  image: string;
}

const INITIAL_DATA: FoodBeverageItem[] = [
  { id: '1', name: 'Bắp rang bơ vị truyền thống (S)', category: 'popcorn', price: 45000, status: 'available', image: '' },
  { id: '2', name: 'Bắp rang bơ vị phô mai (L)', category: 'popcorn', price: 65000, status: 'available', image: '' },
  { id: '3', name: 'Pepsi Lon 330ml', category: 'drinks', price: 30000, status: 'available', image: '' },
  { id: '4', name: 'Nước suối Aquafina 500ml', category: 'drinks', price: 20000, status: 'available', image: '' },
  { id: '5', name: 'Combo Couple (1 Bắp L + 2 Nước L)', category: 'combos', price: 115000, status: 'available', image: '' },
];

export default function DoAnNuocUongPage() {
  // Đọc dữ liệu và TỰ ĐỘNG CHUYỂN ĐỔI TOÀN BỘ danh mục và giá tiền cũ sang mới vĩnh viễn
  const [fbList, setFbList] = useState<FoodBeverageItem[]>(() => {
    const savedData = localStorage.getItem('global_fb_list');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const migrated = parsed.map((item: any) => {
          let cat = item.category;
          if (cat === 'food') cat = 'popcorn';
          if (cat === 'drink') cat = 'drinks';
          if (cat === 'combo') cat = 'combos'; 
          
          let p = item.price;
          // Tự động scale giá cũ (USD) lên VNĐ nếu thấy giá đang quá nhỏ (ví dụ: 4.5 -> 45000)
          if (p && p < 1000) {
            p = p * 10000;
          }

          return { ...item, category: cat, price: p };
        });
        // Lưu đè lại vào localStorage để đồng bộ hoàn toàn
        localStorage.setItem('global_fb_list', JSON.stringify(migrated));
        return migrated;
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodBeverageItem | null>(null);
  const [form] = Form.useForm();

  const saveToLocalStorage = (newData: FoodBeverageItem[]) => {
    setFbList(newData);
    localStorage.setItem('global_fb_list', JSON.stringify(newData));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FoodBeverageItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (values: any) => {
    let updatedList;
    if (editingItem) {
      updatedList = fbList.map(item => 
        item.id === editingItem.id ? { ...item, ...values } : item
      );
      message.success('Cập nhật món thành công!');
    } else {
      const newItem: FoodBeverageItem = {
        id: Math.random().toString(),
        image: '', 
        ...values
      };
      updatedList = [newItem, ...fbList];
      message.success('Thêm món mới thành công!');
    }
    saveToLocalStorage(updatedList);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDeleteItem = (id: string) => {
    const updatedList = fbList.filter(item => item.id !== id);
    saveToLocalStorage(updatedList);
    message.success('Đã xóa món!');
  };

  const filteredData = fbList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = categoryFilter === 'all' ? true : item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoriesConfig = [
    { value: 'all', label: 'All Items' },
    { value: 'popcorn', label: 'Bỏng' },
    { value: 'drinks', label: 'Nước' },
    { value: 'combos', label: 'Combos' },
    { value: 'snacks', label: 'Snacks' },
  ];

  const columns = [
    {
      title: 'HÌNH ẢNH',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (text: string) => (
        <Image 
          src={text || 'https://placehold.co/60x60?text=No+Image'} 
          alt="food" 
          width={60} 
          height={60} 
          style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0' }} 
        />
      ),
    },
    {
      title: 'TÊN MÓN',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#1e293b' }}>{text}</span>
    },
    {
      title: 'PHÂN LOẠI',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: string) => {
        const config: Record<string, { color: string; label: string }> = {
          popcorn: { color: 'orange', label: 'Bỏng' },
          drinks: { color: 'blue', label: 'Nước' },
          combos: { color: 'purple', label: 'Combos' },
          snacks: { color: 'magenta', label: 'Snacks' },
        };
        return <Tag color={config[category]?.color || 'default'}>{config[category]?.label || category}</Tag>;
      },
    },
    {
      title: 'GIÁ BÁN',
      dataIndex: 'price',
      key: 'price',
      width: 160,
      render: (price: number) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
        </span>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status: string) => (
        <Tag color={status === 'available' ? 'green' : 'red'}>
          {status === 'available' ? 'Còn hàng' : 'Hết hàng'}
        </Tag>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 150,
      render: (_: any, record: FoodBeverageItem) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#3b82f6' }} />} 
            onClick={() => handleOpenEdit(record)} 
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa món này?"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" icon={<DeleteOutlined style={{ color: '#ef4444' }} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px 24px', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, fontWeight: 700 }}>Quản lý Đồ ăn & Nước uống</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleOpenAdd}
          style={{ borderRadius: 6, fontWeight: 600 }}
        >
          Thêm món mới
        </Button>
      </div>

      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 24, flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm và chọn món ..."
            prefix={<SearchOutlined style={{ color: '#bfdbfe' }} />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 280, borderRadius: 6 }}
          />
          
          <Space size="small" style={{ flexWrap: 'wrap' }}>
            {categoriesConfig.map((cat) => (
              <Button
                key={cat.value}
                type={categoryFilter === cat.value ? 'primary' : 'default'}
                shape="round"
                onClick={() => setCategoryFilter(cat.value)}
                style={{ fontWeight: 500 }}
              >
                {cat.label}
              </Button>
            ))}
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          pagination={{ pageSize: 6 }}
          style={{ background: '#fff' }}
        />
      </Card>

      <Modal
        title={editingItem ? 'Chỉnh sửa món ăn' : 'Thêm món ăn/nước uống mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu lại"
        cancelText="Hủy"
        width={520}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveItem} style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Tên món ăn / thức uống / combo" rules={[{ required: true, message: 'Vui lòng nhập tên món!' }]}>
            <Input placeholder="Ví dụ: Caramel Popcorn (L)" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="category" label="Phân loại" rules={[{ required: true, message: 'Vui lòng chọn phân loại!' }]}>
              <Select placeholder="Chọn loại">
                <Select.Option value="popcorn">Bỏng</Select.Option>
                <Select.Option value="drinks">Nước</Select.Option>
                <Select.Option value="combos">Combo</Select.Option>
                <Select.Option value="snacks">Snacks</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="price" label="Giá bán (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}>
              <InputNumber 
                min={0} 
                step={5000} 
                style={{ width: '100%' }} 
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(val) => val ? String(val).replace(/[^\d]/g, '') : '' as any}
                placeholder="Ví dụ: 50000"
                addonAfter="đ"
              />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Trạng thái" initialValue="available">
            <Select>
              <Select.Option value="available">Còn hàng</Select.Option>
              <Select.Option value="out_of_stock">Tạm hết hàng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="image" label="Đường dẫn ảnh sản phẩm (URL)">
            <Input placeholder="Dán link ảnh từ internet..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}