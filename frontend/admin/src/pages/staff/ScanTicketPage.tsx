import React, { useState } from 'react';
import { Card, Input, Button, Typography, message, Space, Result, Descriptions } from 'antd';
import { ScanOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { staffApi } from '../../api/staff';

const { Title, Text } = Typography;

export default function ScanTicketPage() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScan = async () => {
    if (!token.trim()) {
      message.warning('Vui lòng nhập mã vé');
      return;
    }

    setLoading(true);
    setScanResult(null);
    setBookingData(null);
    setErrorMsg('');

    try {
      const res: any = await staffApi.scanTicket(token.trim());
      setScanResult('success');
      setBookingData(res.data?.booking || res.data); // Assuming backend returns booking inside data
      message.success('Soát vé thành công! Vé hợp lệ.');
      setToken(''); // Reset input sau khi thành công
    } catch (error: any) {
      setScanResult('error');
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra khi quét vé');
      message.error('Vé không hợp lệ hoặc đã được sử dụng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        <ScanOutlined /> Soát vé (Scan Ticket)
      </Title>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Vui lòng nhập hoặc sử dụng máy quét mã vạch để quét mã Token vé của khách hàng.
          </Text>
          <Space.Compact style={{ width: '100%', maxWidth: '500px' }}>
            <Input 
              size="large"
              placeholder="Nhập mã vé (Token)..." 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onPressEnter={handleScan}
              prefix={<ScanOutlined />}
              disabled={loading}
              allowClear
            />
            <Button 
              type="primary" 
              size="large" 
              onClick={handleScan} 
              loading={loading}
            >
              Kiểm tra
            </Button>
          </Space.Compact>
        </div>

        {scanResult === 'success' && (
          <Result
            status="success"
            title="Vé Hợp Lệ - Cho Phép Vào Rạp"
            subTitle="Đơn hàng đã được xác thực thành công và đánh dấu là đã sử dụng."
            icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            extra={[
              <Button type="primary" key="next" onClick={() => setScanResult(null)}>
                Quét vé tiếp theo
              </Button>
            ]}
          >
            {bookingData && (
              <Descriptions bordered size="small" column={1} style={{ marginTop: '24px' }}>
                <Descriptions.Item label="Mã đơn hàng">{bookingData.id}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái đơn">{bookingData.status}</Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">{bookingData.totalAmount?.toLocaleString('vi-VN')}đ</Descriptions.Item>
                <Descriptions.Item label="Đã Check-in">
                  <Text type="success">Rồi</Text>
                </Descriptions.Item>
              </Descriptions>
            )}
          </Result>
        )}

        {scanResult === 'error' && (
          <Result
            status="error"
            title="Vé Không Hợp Lệ"
            subTitle={errorMsg}
            icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            extra={[
              <Button type="primary" danger key="try-again" onClick={() => setScanResult(null)}>
                Thử lại
              </Button>
            ]}
          />
        )}
      </Card>
    </div>
  );
}
