import { useState } from 'react';
import { Button, Form, Input, App as AntdApp } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store/auth';
import { tokenStore } from '@/api/client';
import type { LoginPayload } from '@/api/auth';
import { useEffect } from 'react';

export default function LoginPage() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (accessToken) {
      tokenStore.set(accessToken);
      if (refreshToken) tokenStore.setRefresh(refreshToken);
      // Xóa params khỏi URL để đẹp hơn
      searchParams.delete('accessToken');
      searchParams.delete('refreshToken');
      setSearchParams(searchParams, { replace: true });
      
      // Gọi bootstrap để lấy user profile và vào dashboard
      bootstrap().then(() => {
        navigate(from, { replace: true });
      });
    }
  }, [searchParams, setSearchParams, bootstrap, navigate, from]);

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
