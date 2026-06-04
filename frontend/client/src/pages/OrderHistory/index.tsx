import React, { useState } from 'react';
import { Button, Tag, message, Empty } from 'antd';
import { 
  DownloadOutlined, 
  TagsOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { OrderType } from './typing';

// 1. IMPORT FOOTER DÙNG CHUNG VÀO ĐÂY
import AppFooter from '../../components/Footer';

const OrderHistoryPage: React.FC = () => {
  const colors = { bg: '#151113', bgCard: '#1a1316', border: '#2d2025', primary: '#e42755', textDim: '#a3989c', textWhite: '#ffffff', success: '#52c41a' };

  const [orders] = useState<OrderType[]>([
    {
      orderId: 'KSTAR-882910',
      movieTitle: 'NABULA ASCENT',
      poster: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=200&auto=format&fit=crop',
      cinemaName: 'Grand Horizon Cinema',
      room: 'Phòng IMAX 01',
      showtime: '14:30 - T7, 25/05/2026',
      seats: ['H12', 'H13'],
      totalPrice: 240000,
      status: 'completed',
      purchaseDate: '24/05/2026 10:15'
    },
    {
      orderId: 'KSTAR-773821',
      movieTitle: 'KẺ ĐÁNH CẮP GIẤC MƠ',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop',
      cinemaName: 'Starlight Cinema',
      room: 'Phòng LUXE 02',
      showtime: '19:00 - T4, 20/05/2026',
      seats: ['F05'],
      totalPrice: 150000,
      status: 'cancelled',
      purchaseDate: '19/05/2026 08:30'
    }
  ]);

  const handleDownloadInvoice = (orderId: string) => {
    message.loading({ content: `Đang xuất hóa đơn cho mã ${orderId}...`, key: 'download' });
    setTimeout(() => {
      message.success({ content: 'Tải hóa đơn PDF thành công!', key: 'download', duration: 3 });
    }, 1500);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    // Sử dụng Flexbox để đẩy Footer xuống đáy trang
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      
      {/* Phần nội dung chính */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '60px 5% 40px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <TagsOutlined style={{ fontSize: '32px', color: colors.primary }} />
          <h1 style={{ color: colors.textWhite, fontSize: '32px', fontWeight: 'bold', margin: 0 }}>Lịch sử giao dịch</h1>
        </div>

        {orders.length === 0 ? (
          <Empty description={<span style={{ color: colors.textDim }}>Bạn chưa có giao dịch nào</span>} style={{ padding: '50px 0' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => (
              <div key={order.orderId} style={{ backgroundColor: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                
                <div style={{ padding: '16px 24px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#21181c' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: colors.textDim, fontSize: '14px' }}>Mã vé: <strong style={{ color: colors.textWhite }}>{order.orderId}</strong></span>
                    <span style={{ color: colors.textDim, fontSize: '14px' }}>• Mua lúc: {order.purchaseDate}</span>
                  </div>
                  <div>
                    {order.status === 'completed' ? (
                      <Tag icon={<CheckCircleOutlined />} color="success" style={{ backgroundColor: 'rgba(82, 196, 26, 0.1)', border: 'none', color: colors.success, fontWeight: 'bold', margin: 0 }}>GIAO DỊCH THÀNH CÔNG</Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error" style={{ backgroundColor: 'rgba(228, 39, 85, 0.1)', border: 'none', color: colors.primary, fontWeight: 'bold', margin: 0 }}>ĐÃ HỦY</Tag>
                    )}
                  </div>
                </div>

                <div style={{ padding: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  <img src={order.poster} alt={order.movieTitle} style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${colors.border}` }} />
                  
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ color: colors.textWhite, fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0', textTransform: 'uppercase' }}>{order.movieTitle}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ color: colors.textDim, fontSize: '14px' }}><EnvironmentOutlined style={{ marginRight: '8px', color: colors.primary }} /> {order.cinemaName} | {order.room}</div>
                      <div style={{ color: colors.textDim, fontSize: '14px' }}><ClockCircleOutlined style={{ marginRight: '8px', color: colors.primary }} /> {order.showtime}</div>
                      <div style={{ color: colors.textDim, fontSize: '14px' }}><TagsOutlined style={{ marginRight: '8px', color: colors.primary }} /> Ghế: <strong style={{ color: colors.primary }}>{order.seats.join(', ')}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', borderLeft: `1px solid ${colors.border}`, paddingLeft: '24px', minWidth: '200px' }}>
                    <div style={{ color: colors.textDim, fontSize: '14px', marginBottom: '4px' }}>Tổng thanh toán</div>
                    <div style={{ color: colors.primary, fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>
                      {formatCurrency(order.totalPrice)}
                    </div>
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />} 
                      onClick={() => handleDownloadInvoice(order.orderId)}
                      disabled={order.status === 'cancelled'}
                      style={{ 
                        backgroundColor: order.status === 'cancelled' ? '#333' : colors.primary, 
                        border: 'none', 
                        borderRadius: '20px', 
                        fontWeight: 'bold',
                        height: '40px',
                        padding: '0 20px'
                      }}
                    >
                      Tải hóa đơn PDF
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. THÊM THẺ FOOTER VÀO DƯỚI CÙNG */}
      <AppFooter />
      
    </div>
  );
};

export default OrderHistoryPage;