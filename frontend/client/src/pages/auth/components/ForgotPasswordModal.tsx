import React, { useState } from 'react';
import { Modal, Form, Input, Button, message as antdMessage } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { authApi } from '@/api/auth';

interface ForgotPasswordModalProps {
  open: boolean;
  onCancel: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ open, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: values.email });
      antdMessage.success('Nếu email tồn tại trong hệ thống, chúng tôi đã gửi thư đặt lại mật khẩu cho bạn.');
      form.resetFields();
      onCancel();
    } catch (error) {
      antdMessage.error('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          Quên mật khẩu?
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      styles={{
        content: {
          backgroundColor: '#1E1E1E',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #333'
        },
        header: {
          backgroundColor: 'transparent',
          borderBottom: 'none'
        }
      }}
      closeIcon={<span style={{ color: 'white' }}>X</span>}
    >
      <div style={{ color: '#aaaaaa', textAlign: 'center', marginBottom: '24px' }}>
        Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi một liên kết để đặt lại mật khẩu.
      </div>
      
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input 
            prefix={<MailOutlined style={{ color: '#888' }} />} 
            placeholder="Nhập email của bạn" 
            style={{ 
              backgroundColor: '#2A2A2A', 
              borderColor: '#333', 
              color: 'white', 
              height: '45px', 
              borderRadius: '8px' 
            }} 
          />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          loading={loading}
          style={{ 
            backgroundColor: '#ee1e63', 
            border: 'none', 
            height: '45px', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            borderRadius: '8px',
            marginTop: '10px'
          }}
        >
          Gửi liên kết đặt lại
        </Button>
      </Form>
    </Modal>
  );
};

export default ForgotPasswordModal;
