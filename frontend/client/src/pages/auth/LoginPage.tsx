import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Divider, message } from 'antd';
import {
  FacebookFilled,
  GoogleOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { history } from 'umi';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuthStore } from '@/store/auth';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState('/home-page');
  const setUser = useAuthStore((state) => state.setUser);
  const register = useAuthStore((state) => state.register);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      history.push('/home-page');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    if (redirectUrl) setRedirect(decodeURIComponent(redirectUrl));
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (activeTab === 'login') {
        let mockUser: { role: 'ADMIN' | 'CLIENT'; name: string };
        if (values.email === 'admin@test.com') {
          mockUser = { role: 'ADMIN', name: 'Admin User' };
        } else {
          mockUser = { role: 'CLIENT', name: 'Client User' };
        }
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (values.remember) {
          localStorage.setItem('accessToken', 'fake-token');
        } else {
          sessionStorage.setItem('accessToken', 'fake-token');
        }
        localStorage.setItem('role', mockUser.role);
        setUser({
          id: `user-${Date.now()}`,
          email: values.email,
          name: mockUser.name,
          role: mockUser.role === 'ADMIN' ? 'ADMIN' : 'USER',
          createdAt: new Date().toISOString(),
        });
        message.success(`Chào mừng ${mockUser.name}!`);
        if (mockUser.role === 'ADMIN') {
          window.location.href = 'http://localhost:8001/dashboard';
        } else {
          history.push(redirect);
        }
      } else {
        await register({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        message.success('Đăng ký thành công! Hãy đăng nhập.');
        form.resetFields();
        setActiveTab('login');
      }
    } catch (error: any) {
      message.error(error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Style definitions (smaller sizes)
  const baseTabStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    padding: '0 8px 6px',
    transition: 'all 0.2s',
  };

  const activeTabStyle: React.CSSProperties = {
    ...baseTabStyle,
    fontWeight: 700,
    color: '#e50914',
    borderBottom: '2px solid #e50914',
  };

  const inactiveTabStyle: React.CSSProperties = {
    ...baseTabStyle,
    fontWeight: 400,
    color: '#999',
    borderBottom: 'none',
  };

  const inputFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const wrapper = e.currentTarget.closest('.input-wrapper') as HTMLElement;
    if (wrapper) wrapper.style.borderBottomColor = '#e50914';
  };
  const inputBlurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const wrapper = e.currentTarget.closest('.input-wrapper') as HTMLElement;
    if (wrapper) wrapper.style.borderBottomColor = '#444';
  };

  return (
    <AuthLayout>
      {/* Container chính - vẫn rộng 560px nhưng nội dung bên trong nhỏ lại */}
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#e50914',
              marginBottom: 4,
            }}
          >
            KSTAR
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 28,
            justifyContent: 'center',
            marginBottom: 28,
            borderBottom: '1px solid #333',
            paddingBottom: 8,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            style={activeTab === 'login' ? activeTabStyle : inactiveTabStyle}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            style={activeTab === 'register' ? activeTabStyle : inactiveTabStyle}
          >
            Register
          </button>
        </div>

        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          {activeTab === 'register' && (
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Nhập họ tên' }]}
              style={{ marginBottom: 0 }}
            >
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#aaa',
                    marginBottom: 6,
                  }}
                >
                  HỌ VÀ TÊN
                </label>
                <div
                  className="input-wrapper"
                  style={{
                    borderBottom: '1px solid #444444',
                    paddingBottom: 2,
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Input
                    prefix={<UserOutlined style={{ color: '#666', fontSize: 12 }} />}
                    placeholder="Nguyễn Văn A"
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#fff',
                      fontSize: 14,
                      padding: '6px 0',
                    }}
                    onFocus={inputFocusHandler}
                    onBlur={inputBlurHandler}
                    bordered={false}
                  />
                </div>
              </div>
            </Form.Item>
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
            style={{ marginBottom: 0 }}
          >
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  marginBottom: 6,
                }}
              >
                EMAIL ADDRESS
              </label>
              <div
                className="input-wrapper"
                style={{
                  borderBottom: '1px solid #444',
                  paddingBottom: 2,
                  transition: 'border-color 0.2s',
                }}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#666', fontSize: 12 }} />}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: 14,
                    padding: '6px 0',
                  }}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                  bordered={false}
                />
              </div>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Nhập mật khẩu' },
              { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' },
            ]}
            style={{ marginBottom: 0 }}
          >
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#aaa',
                  marginBottom: 6,
                }}
              >
                PASSWORD
              </label>
              <div
                className="input-wrapper"
                style={{
                  borderBottom: '1px solid #444',
                  paddingBottom: 2,
                  transition: 'border-color 0.2s',
                }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#666', fontSize: 12 }} />}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#fff',
                    fontSize: 14,
                    padding: '6px 0',
                  }}
                  onFocus={inputFocusHandler}
                  onBlur={inputBlurHandler}
                  bordered={false}
                  iconRender={(visible) => (
                    <span style={{ color: '#666', fontSize: 12 }}>{visible ? '🙈' : '👁️'}</span>
                  )}
                />
              </div>
            </div>
          </Form.Item>

          {activeTab === 'register' && (
            <>
              <Form.Item
                name="confirm"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) return Promise.resolve();
                      return Promise.reject(new Error('Mật khẩu không khớp'));
                    },
                  }),
                ]}
                style={{ marginBottom: 0 }}
              >
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#aaa',
                      marginBottom: 6,
                    }}
                  >
                    CONFIRM PASSWORD
                  </label>
                  <div
                    className="input-wrapper"
                    style={{
                      borderBottom: '1px solid #444',
                      paddingBottom: 2,
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#666', fontSize: 12 }} />}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#fff',
                        fontSize: 14,
                        padding: '6px 0',
                      }}
                      onFocus={inputFocusHandler}
                      onBlur={inputBlurHandler}
                      bordered={false}
                    />
                  </div>
                </div>
              </Form.Item>

              <Form.Item
                name="agree"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý điều khoản')),
                  },
                ]}
                style={{ marginBottom: 16 }}
              >
                <Checkbox style={{ color: '#aaa', fontSize: 12 }}>
                  Tôi đồng ý với <span style={{ color: '#fff' }}>điều khoản sử dụng</span>
                </Checkbox>
              </Form.Item>
            </>
          )}

          {activeTab === 'login' && (
            <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 14 }}>
              <span
                style={{ color: '#e50914cc', fontSize: 11, cursor: 'pointer' }}
                onClick={() => history.push('/forgot-password')}
              >
                Forgot Password?
              </span>
            </div>
          )}

          {activeTab === 'login' && (
            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 16 }}>
              <Checkbox style={{ color: '#aaa', fontSize: 12 }}>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#e50914',
              border: 'none',
              borderRadius: 6,
              padding: '10px',
              fontSize: 14,
              fontWeight: 700,
              color: '#fff',
              cursor: 'pointer',
              marginTop: 4,
              marginBottom: 20,
            }}
          >
            {loading ? 'ĐANG XỬ LÝ...' : activeTab === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>

          <Divider style={{ borderColor: '#333', color: '#666', fontSize: 11, margin: '8px 0 20px' }}>
            OR CONTINUE WITH
          </Divider>

          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            <button
              type="button"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: 6,
                padding: '8px',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <GoogleOutlined style={{ fontSize: 12 }} /> GOOGLE
            </button>
            <button
              type="button"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: 6,
                padding: '8px',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              <FacebookFilled style={{ fontSize: 12 }} /> FACEBOOK
            </button>
          </div>
        </Form>

        <div style={{ textAlign: 'center', fontSize: 11, color: '#888', marginTop: 8, marginBottom: 20 }}>
          By accessing KSTAR, you agree to our{' '}
          <span style={{ color: '#ddd', textDecoration: 'underline', cursor: 'pointer' }}>Terms</span> &amp;{' '}
          <span style={{ color: '#ddd', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid #222222',
          marginTop: 32,
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: 11,
          color: '#888',
        }}
      >
        <div>© 2026 KSTAR Cinema. All Rights Reserved.</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ cursor: 'pointer' }}>SUPPORT CENTER</span>
          <span style={{ cursor: 'pointer' }}>CAREERS</span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;