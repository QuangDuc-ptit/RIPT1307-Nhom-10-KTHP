import { useState } from 'react';
import { Button, Card, Form, Input, App as AntdApp, Typography } from 'antd';
import { Helmet } from 'react-helmet-async';
import { authApi } from '@/api/auth';

const { Title } = Typography;

export default function ChangePasswordPage() {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { oldPassword: string; newPassword: string }) => {
    setLoading(true);
    try {
      await authApi.changePassword(values);
      message.success('Đổi mật khẩu thành công');
      form.resetFields();
    } catch (e: any) {
      message.error(e.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Đổi mật khẩu</title>
      </Helmet>
      <Title level={2}>Đổi mật khẩu</Title>
      <Card style={{ maxWidth: 500 }}>
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <Form.Item
            name='oldPassword'
            label='Mật khẩu hiện tại'
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='newPassword'
            label='Mật khẩu mới'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name='confirm'
            label='Xác nhận mật khẩu mới'
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={loading}>
            Cập nhật
          </Button>
        </Form>
      </Card>
    </>
  );
}
