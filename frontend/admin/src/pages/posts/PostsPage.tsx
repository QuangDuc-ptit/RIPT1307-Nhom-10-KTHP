import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Switch,
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
import { postApi } from '@/api/post';
import type { Paginated, Post } from '@/types';
import PostFormModal from './PostFormModal';

const { Title } = Typography;

export default function PostsPage() {
  const { message } = AntdApp.useApp();
  const [data, setData] = useState<Paginated<Post> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await postApi.list({ page, pageSize, search });
      setData(res);
    } catch (e: any) {
      message.error(e.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  const togglePublish = async (record: Post) => {
    try {
      await postApi.update(record.id, { published: !record.published });
      message.success(record.published ? 'Đã ẩn bài viết' : 'Đã xuất bản');
      fetchData();
    } catch (e: any) {
      message.error(e.message || 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await postApi.remove(id);
      message.success('Đã xoá');
      fetchData();
    } catch (e: any) {
      message.error(e.message || 'Xoá thất bại');
    }
  };

  const columns: TableProps<Post>['columns'] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (title, r) => (
        <div>
          <div style={{ fontWeight: 500 }}>{title}</div>
          <div style={{ fontSize: 12, color: '#999' }}>/{r.slug}</div>
        </div>
      ),
    },
    {
      title: 'Tác giả',
      dataIndex: ['author', 'name'],
      width: 160,
      render: (n) => n || '—',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'published',
      width: 130,
      render: (published, record) => (
        <Space>
          <Switch
            size='small'
            checked={published}
            onChange={() => togglePublish(record)}
          />
          <Tag color={published ? 'green' : 'default'}>
            {published ? 'Đã xuất bản' : 'Nháp'}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      width: 160,
      render: (d) => dayjs(d).format('DD/MM/YYYY HH:mm'),
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
            title='Xoá bài viết này?'
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
        <title>Bài viết — Admin</title>
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
            Quản lý bài viết
          </Title>
          <Space wrap>
            <Input.Search
              placeholder='Tìm theo tiêu đề...'
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

        <Table<Post>
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
          scroll={{ x: 800 }}
        />
      </Card>

      <PostFormModal
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
