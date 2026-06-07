import { useState } from 'react';
import { Button, Form, Input, App as AntdApp } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store/auth';
import type { RegisterPayload } from '@/api/auth';

export default function RegisterPage() {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterPayload & { confirm: string }) => {
    setLoading(true);
    try {
      await register({ email: values.email, password: values.password, name: values.name });
      message.success('Đăng ký thành công');
      navigate('/me', { replace: true });
    } catch (e: any) {
      message.error(e.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đăng ký</title>
      </Helmet>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Tạo tài khoản</h2>
      <Form layout='vertical' onFinish={onFinish} requiredMark={false} autoComplete='off'>
        <Form.Item
          name='name'
          label='Họ tên'
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input prefix={<UserOutlined />} placeholder='Nguyễn Văn A' size='large' />
        </Form.Item>
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
        <Form.Item
          name='confirm'
          label='Xác nhận mật khẩu'
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) return Promise.resolve();
                return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='••••••••' size='large' />
        </Form.Item>
        <Button type='primary' htmlType='submit' size='large' block loading={loading}>
          Đăng ký
        </Button>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        Đã có tài khoản? <Link to='/auth/login'>Đăng nhập</Link>
      </div>
    </>
  );
}
