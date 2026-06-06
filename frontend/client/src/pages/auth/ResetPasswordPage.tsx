import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message as antdMessage } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import AuthLayout from '../../layouts/AuthLayout';

const ResetPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    if (!token) {
      antdMessage.error('Đường dẫn không hợp lệ hoặc đã hết hạn.');
      navigate('/auth/login', { replace: true });
    }
  }, [token, navigate]);

  const onFinish = async (values: any) => {
    if (!token) return;
    if (values.newPassword !== values.confirmPassword) {
      antdMessage.error('Mật khẩu nhập lại không khớp!');
      return;
    }
    
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword: values.newPassword });
      antdMessage.success('Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
      navigate('/auth/login', { replace: true });
    } catch (error: any) {
      antdMessage.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const CustomInputStyle = {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
    color: 'white',
    height: '45px',
    borderRadius: '30px'
  };

  return (
    <AuthLayout>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>Đặt lại mật khẩu</h2>
        <p style={{ color: '#aaaaaa' }}>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
      </div>
      
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="newPassword"
          label={<span style={{ color: 'white', fontSize: '16px' }}>Mật khẩu mới</span>}
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
          colon={false}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" style={CustomInputStyle} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={<span style={{ color: 'white', fontSize: '16px' }}>Nhập lại mật khẩu mới</span>}
          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
          colon={false}
        >
          <Input.Password placeholder="Nhập lại mật khẩu" style={CustomInputStyle} />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large" 
            loading={loading}
            style={{ 
              backgroundColor: '#ee1e63', 
              border: 'none', 
              height: '50px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              borderRadius: '30px',
              marginTop: '10px'
            }}
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
