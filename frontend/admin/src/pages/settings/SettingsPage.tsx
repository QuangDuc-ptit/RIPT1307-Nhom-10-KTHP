import { Card, Form, Input, Button, Typography, Switch, App as AntdApp } from 'antd';
import { Helmet } from 'react-helmet-async';

const { Title, Paragraph } = Typography;

export default function SettingsPage() {
  const { message } = AntdApp.useApp();
  return (
    <>
      <Helmet>
        <title>Cài đặt — Admin</title>
      </Helmet>
      <Title level={2}>Cài đặt hệ thống</Title>
      <Paragraph type='secondary'>
        Mẫu cấu hình. Trong thực tế bạn sẽ lưu vào DB qua API <code>/admin/settings</code>.
      </Paragraph>

      <Card style={{ maxWidth: 720 }}>
        <Form
          layout='vertical'
          initialValues={{
            siteName: 'Base Web',
            allowRegister: true,
            smtpHost: '',
          }}
          onFinish={() => message.success('Đã lưu (giả lập)')}
        >
          <Form.Item name='siteName' label='Tên trang' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name='allowRegister' label='Cho phép đăng ký' valuePropName='checked'>
            <Switch />
          </Form.Item>
          <Form.Item name='smtpHost' label='SMTP host'>
            <Input placeholder='smtp.gmail.com' />
          </Form.Item>
          <Button type='primary' htmlType='submit'>
            Lưu
          </Button>
        </Form>
      </Card>
    </>
  );
}
