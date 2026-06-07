import { useEffect, useState } from 'react';
import { Form, Input, Button, message as antdMessage } from 'antd';
import { FacebookFilled, GoogleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { tokenStore } from '@/api/client';
import AuthLayout from '@/layouts/AuthLayout'; // layout dùng chung (gradient hoặc ảnh)
import ForgotPasswordModal from './components/ForgotPasswordModal';
import { auth, googleProvider, facebookProvider } from '@/config/firebase';
import { signInWithPopup } from 'firebase/auth';

// Nếu admin chạy trên cổng khác, đặt biến này
const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const socialLogin = useAuthStore((s) => s.socialLogin);
  const register = useAuthStore((s) => s.register);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  const from = (location.state as any)?.from?.pathname || '/';

  // Xử lý khi có token từ admin redirect về (nếu dùng cơ chế chuyển hướng)
  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    if (accessToken) {
      tokenStore.set(accessToken);
      if (refreshToken) tokenStore.setRefresh(refreshToken);
      bootstrap().then(() => {
        navigate('/dashboard', { replace: true }); // hoặc navigate('/admin')
      });
    }
  }, [searchParams, bootstrap, navigate]);

  useEffect(() => {
    if (user) {
      // Nếu đã đăng nhập, điều hướng theo role
      if (user.role === 'ADMIN') {
        // Nếu admin ở domain riêng thì redirect sang cổng admin
        if (ADMIN_URL !== window.location.origin) {
          window.location.href = `${ADMIN_URL}/auth/login?accessToken=${tokenStore.get()}&refreshToken=${tokenStore.getRefresh()}`;
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const onFinish = async (values: any) => {
    if (activeTab === 'login') {
      try {
        const result = await login({ email: values.email, password: values.password });
        antdMessage.success('Đăng nhập thành công');
        // user sẽ được cập nhật trong store, useEffect sẽ xử lý redirect
      } catch (error: any) {
        antdMessage.error(error?.response?.data?.message || error?.message || 'Đăng nhập thất bại');
      }
      return;
    }

    if (activeTab === 'register') {
      try {
        await register({
          email: values.email,
          password: values.password,
          name: values.name || 'Người dùng mới'
        });
        antdMessage.success('Đăng ký thành công');
        // Sau đăng ký, tự động đăng nhập? Hoặc chuyển về login
        setActiveTab('login');
      } catch (error: any) {
        antdMessage.error(error?.response?.data?.message || error?.message || 'Đăng ký thất bại');
      }
    }
  };

  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    try {
      const provider = providerName === 'google' ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await socialLogin({ provider: providerName, idToken });
      antdMessage.success('Đăng nhập thành công');
      // user sẽ được cập nhật
    } catch (error: any) {
      console.error("Social login error", error);
      antdMessage.error('Đăng nhập mạng xã hội thất bại');
    }
  };

  const FormLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ color: 'white', marginBottom: '8px', fontSize: '16px' }}>
      {children}
    </div>
  );

  const CustomInputStyle = {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
    color: 'white',
    height: '45px',
    borderRadius: '30px'
  };

  const renderLoginForm = () => (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="email"
        label={<FormLabel>Email</FormLabel>}
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không đúng định dạng!' }
        ]}
        colon={false}
      >
        <Input placeholder="Nhập email của bạn" style={CustomInputStyle} />
      </Form.Item>

      <Form.Item
        name="password"
        label={<FormLabel>Mật khẩu</FormLabel>}
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        colon={false}
      >
        <Input.Password placeholder="Nhập mật khẩu" style={CustomInputStyle} />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button
          type="link"
          onClick={() => setIsForgotModalOpen(true)}
          style={{ color: '#ee1e63', padding: 0, height: 'auto', fontWeight: 'bold' }}
        >
          Quên mật khẩu?
        </Button>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#ee1e63', border: 'none', height: '50px', fontSize: '18px', fontWeight: 'bold', borderRadius: '30px' }}>
          Đăng nhập
        </Button>
      </Form.Item>

      <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0', color: 'white' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
        <span style={{ padding: '0 15px', color: '#aaaaaa' }}>Hoặc đăng nhập với</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Button onClick={() => handleSocialLogin('facebook')} block size="large" icon={<FacebookFilled style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#3A5BA0', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Facebook
        </Button>
        <Button onClick={() => handleSocialLogin('google')} block size="large" icon={<GoogleOutlined style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#EA617D', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Google
        </Button>
      </div>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item label={<FormLabel>Họ và tên</FormLabel>} name="name" colon={false} rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
        <Input placeholder="Nhập họ và tên" style={CustomInputStyle} />
      </Form.Item>
      <Form.Item label={<FormLabel>Email</FormLabel>} name="email" colon={false} rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không đúng định dạng!' }]}>
        <Input placeholder="Nhập email" style={CustomInputStyle} />
      </Form.Item>
      <Form.Item label={<FormLabel>Mật khẩu</FormLabel>} name="password" colon={false} rules={[{ required: true, message: 'Vui lòng tạo mật khẩu!' }]}>
        <Input.Password placeholder="Tạo mật khẩu" style={CustomInputStyle} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#ee1e63', border: 'none', height: '50px', marginTop: '20px', fontSize: '18px', fontWeight: 'bold', borderRadius: '30px' }}>
          Đăng ký ngay
        </Button>
      </Form.Item>

      <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0', color: 'white' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
        <span style={{ padding: '0 15px', color: '#aaaaaa' }}>Hoặc đăng ký với</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Button onClick={() => handleSocialLogin('facebook')} block size="large" icon={<FacebookFilled style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#3A5BA0', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Facebook
        </Button>
        <Button onClick={() => handleSocialLogin('google')} block size="large" icon={<GoogleOutlined style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#EA617D', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Google
        </Button>
      </div>
    </Form>
  );

  return (
    <AuthLayout>
      <div style={{ display: 'flex', marginBottom: '30px', borderRadius: '30px', overflow: 'hidden', border: '1px solid #333' }}>
        <button
          onClick={() => setActiveTab('login')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'login' ? '#ee1e63' : '#2A2A2A',
            color: 'white',
            transition: 'background-color 0.3s'
          }}
        >
          Đăng nhập
        </button>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            flex: 1,
            padding: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: activeTab === 'register' ? '#ee1e63' : '#2A2A2A',
            color: 'white',
            transition: 'background-color 0.3s'
          }}
        >
          Đăng ký
        </button>
      </div>

      <div key={activeTab}>
        {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}
      </div>

      <ForgotPasswordModal
        open={isForgotModalOpen}
        onCancel={() => setIsForgotModalOpen(false)}
      />
    </AuthLayout>
  );
};

export default LoginPage;