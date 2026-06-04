import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { history } from 'umi'; // Sử dụng history từ Umi
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '@/store/auth';

export default function ChangePasswordPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  
  // Đảm bảo hook được gọi ở cấp cao nhất trong component
  const changePassword = useAuthStore((s) => s.changePassword);

  const onFinish = async (values: { oldPassword: string; newPassword: string; confirm: string }) => {
    setLoading(true);
    try {
      if (changePassword) {
        await changePassword(values.oldPassword, values.newPassword);
        messageApi.success('Đổi mật khẩu thành công');
        // Điều hướng sau khi thành công
        history.push('/profile');
      } else {
        messageApi.error('Chức năng đang phát triển');
      }
    } catch (e: any) {
      messageApi.error(e.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đổi mật khẩu</title>
      </Helmet>
      
      {contextHolder}
      
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Đổi mật khẩu</h2>
      
      <Form 
        layout="vertical" 
        onFinish={onFinish} 
        requiredMark={false} 
        autoComplete="off"
      >
        <Form.Item 
          name="oldPassword" 
          label="Mật khẩu cũ" 
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
        </Form.Item>

        <Form.Item 
          name="newPassword" 
          label="Mật khẩu mới" 
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' }, 
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
        </Form.Item>

        <Form.Item 
          name="confirm" 
          label="Xác nhận mật khẩu mới" 
          dependencies={['newPassword']} 
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu' }, 
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu nhập lại không khớp'));
              },
            })
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
        </Form.Item>

        <Button 
          type="primary" 
          htmlType="submit" 
          size="large" 
          block 
          loading={loading}
        >
          Đổi mật khẩu
        </Button>
      </Form>
    </>
  );
}