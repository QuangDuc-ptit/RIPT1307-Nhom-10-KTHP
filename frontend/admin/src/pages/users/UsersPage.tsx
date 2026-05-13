import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  App as AntdApp,
  type TableProps,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Helmet } from 'react-helmet-async';
import dayjs from 'dayjs';
import { userApi } from '@/api/user';
import type { Paginated, User } from '@/types';
import UserFormModal from './UserFormModal';

const { Title } = Typography;

export default function UsersPage() {
  const { message } = AntdApp.useApp();
  const [data, setData] = useState<Paginated<User> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await userApi.list({ page, pageSize, search });
      setData(res);
    } catch (e: any) {
      message.error(e.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  const handleDelete = async (id: string) => {
    try {
      await userApi.remove(id);
      message.success('Đã xoá');
      fetchData();
    } catch (e: any) {
      message.error(e.message || 'Xoá thất bại');
    }
  };

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      width: 120,
      render: (role: User['role']) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>{role}</Tag>
      ),
      filters: [
        { text: 'ADMIN', value: 'ADMIN' },
        { text: 'USER', value: 'USER' },
      ],
      onFilter: (v, r) => r.role === v,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 160,
      render: (d) => dayjs(d).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
    },
    {
      title: 'Thao tác',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type='link'
            icon={<EditOutlined />}
            onClick={() => {
              setEditing(record);
              setModalOpen(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title='Xoá người dùng này?'
            description='Hành động này không thể hoàn tác.'
            okText='Xoá'
            cancelText='Huỷ'
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type='link' danger icon={<DeleteOutlined />}>
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Người dùng — Admin</title>
      </Helmet>
      <Card>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Quản lý người dùng
          </Title>
          <Space wrap>
            <Input.Search
              placeholder='Tìm theo tên / email...'
              allowClear
              onSearch={(v) => {
                setPage(1);
                setSearch(v);
              }}
              style={{ width: 280 }}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              Tải lại
            </Button>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => {
                setEditing(null);
                setModalOpen(true);
              }}
            >
              Thêm mới
            </Button>
          </Space>
        </div>

        <Table<User>
          rowKey='id'
          loading={loading}
          columns={columns}
          dataSource={data?.items || []}
          pagination={{
            current: page,
            pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showTotal: (t) => `Tổng ${t} mục`,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
          scroll={{ x: 700 }}
        />
      </Card>

      <UserFormModal
        open={modalOpen}
        editing={editing}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          fetchData();
        }}
      />
    </>
  );
}
