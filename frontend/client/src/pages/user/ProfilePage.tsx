import { useState } from 'react';
import { Button, Card, Form, Input, App as AntdApp, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store/auth';

const { Title } = Typography;

export default function ProfilePage() {
  const { message } = AntdApp.useApp();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string; avatar?: string }) => {
    setLoading(true);
    try {
      const updated = await userApi.updateProfile(values);
      setUser(updated);
      message.success('Cập nhật hồ sơ thành công');
    } catch (e: any) {
      message.error(e.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hồ sơ</title>
      </Helmet>
      <Title level={2}>Hồ sơ cá nhân</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form
          layout='vertical'
          initialValues={{ name: user?.name, avatar: user?.avatar || '' }}
          onFinish={onFinish}
        >
          <Form.Item label='Email'>
            <Input value={user?.email} disabled />
          </Form.Item>
          <Form.Item
            name='name'
            label='Họ tên'
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='avatar' label='Avatar URL'>
            <Input placeholder='https://...' />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={loading}>
            Lưu thay đổi
          </Button>
        </Form>
      </Card>
    </>
  );
}
