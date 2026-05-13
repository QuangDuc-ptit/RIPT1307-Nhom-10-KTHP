import { useState } from 'react';
import { Button, Form, Input, App as AntdApp } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store/auth';
import type { LoginPayload } from '@/api/auth';

export default function LoginPage() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/me';

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
        <title>Đăng nhập</title>
      </Helmet>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Đăng nhập</h2>
      <Form layout='vertical' onFinish={onFinish} requiredMark={false} autoComplete='off'>
        <Form.Item
          name='email'
          label='Email'
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='you@example.com' size='large' />
        </Form.Item>
        <Form.Item
          name='password'
          label='Mật khẩu'
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='••••••••' size='large' />
        </Form.Item>
        <Button type='primary' htmlType='submit' size='large' block loading={loading}>
          Đăng nhập
        </Button>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Chưa có tài khoản? <Link to='/auth/register'>Đăng ký</Link>
      </div>
    </>
  );
}
