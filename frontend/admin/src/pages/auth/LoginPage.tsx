import { useState } from 'react';
import { Button, Form, Input, App as AntdApp } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store/auth';
import type { LoginPayload } from '@/api/auth';

export default function LoginPage() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginPayload) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Đăng nhập thành công');
      navigate(from, { replace: true });
    } catch (e: any) {
      message.error(e.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng nhập — Admin</title>
      </Helmet>
      <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Đăng nhập</h2>
      <div style={{ textAlign: 'center', marginBottom: 24, color: '#666', fontSize: 14 }}>
        Tài khoản mẫu: <strong>admin@example.com</strong> / <strong>admin123</strong>
      </div>
      <Form
        layout='vertical'
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ email: 'admin@example.com' }}
      >
        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='admin@example.com' size='large' />
        </Form.Item>
        <Form.Item
          name='password'
          label='Mật khẩu'
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='••••••••' size='large' />
        </Form.Item>
        <Button type='primary' htmlType='submit' size='large' block loading={loading}>
          Đăng nhập
        </Button>
      </Form>
    </>
  );
}
