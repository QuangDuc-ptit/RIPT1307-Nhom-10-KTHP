import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { FacebookFilled, GoogleOutlined } from '@ant-design/icons';
// Lưu ý: Kiểm tra lại đường dẫn import AuthLayout sao cho khớp với thư mục của bạn
import AuthLayout from '../../layouts/AuthLayout'; 

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const onFinish = (values: any) => {
    console.log(`Thông tin ${activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}:`, values);
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
        <Button type="link" style={{ color: '#ee1e63', padding: 0, height: 'auto', fontWeight: 'bold' }}>
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
        <Button block size="large" icon={<FacebookFilled style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#3A5BA0', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Facebook
        </Button>
        <Button block size="large" icon={<GoogleOutlined style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#EA617D', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Google
        </Button>
      </div>
    </Form>
  );

  const renderRegisterForm = () => (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item label={<FormLabel>Họ và tên</FormLabel>} colon={false}>
        <Input placeholder="Nhập họ và tên" style={CustomInputStyle} />
      </Form.Item>
      <Form.Item label={<FormLabel>Email</FormLabel>} colon={false}>
        <Input placeholder="Nhập email" style={CustomInputStyle} />
      </Form.Item>
      <Form.Item label={<FormLabel>Mật khẩu</FormLabel>} colon={false}>
        <Input.Password placeholder="Tạo mật khẩu" style={CustomInputStyle} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#ee1e63', border: 'none', height: '50px', marginTop: '20px', fontSize: '18px', fontWeight: 'bold', borderRadius: '30px' }}>
          Đăng ký ngay
        </Button>
      </Form.Item>

      {/* --- BỔ SUNG KHỐI SOCIAL LOGIN CHO ĐĂNG KÝ --- */}
      <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0', color: 'white' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
        <span style={{ padding: '0 15px', color: '#aaaaaa' }}>Hoặc đăng ký với</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'white' }} />
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <Button block size="large" icon={<FacebookFilled style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#3A5BA0', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Facebook
        </Button>
        <Button block size="large" icon={<GoogleOutlined style={{ fontSize: '22px' }} />} style={{ backgroundColor: '#EA617D', color: 'white', border: 'none', height: '50px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Google
        </Button>
      </div>
      {/* ---------------------------------------------- */}

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

      <div 
        key={activeTab} 
        className={activeTab === 'login' ? 'slide-login' : 'slide-register'}
      >
        {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}
      </div>
    </AuthLayout>
  );
};

export default LoginPage;