import React, { useState } from 'react';
import { Button, Input, Radio, message } from 'antd';
import { 
  CloseOutlined,
  CreditCardOutlined, 
  WalletOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  DesktopOutlined,
  CoffeeOutlined,
  FileTextOutlined,
  LockOutlined,
  CheckCircleOutlined,
  SafetyOutlined // <-- Đã đổi ShieldOutlined thành SafetyOutlined ở đây
} from '@ant-design/icons';
import { OrderSummaryType, VoucherType } from './typing';

const CheckoutPage: React.FC = () => {
  const colors = { 
    bg: '#1a1416',        
    panelBg: '#22171a',   
    cardBg: '#2a1a20',    
    inputBg: '#342127',   
    primary: '#e42755',   
    textWhite: '#ffffff', 
    textDim: '#a3989c', 
    border: '#3b2a31'     
  };

  const [order] = useState<OrderSummaryType & { bookingFee: number }>({
    movieName: 'Dune: Part Two',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop',
    cinemaName: 'Rạp 4',
    room: 'Phòng IMAX',
    showtime: 'T6, 24/11 • 20:00',
    seats: ['Hàng B - Ghế B3, B4'],
    ticketPrice: 240000,
    comboPrice: 65000, 
    bookingFee: 15000 
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherType | null>(null);

  const subTotal = order.ticketPrice + order.comboPrice + order.bookingFee;
  const discountAmount = appliedVoucher ? appliedVoucher.discountValue : 0;
  const finalTotal = subTotal - discountAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) {
      message.warning('Vui lòng nhập mã khuyến mãi!');
      return;
    }
    if (voucherInput.toUpperCase() === 'KSTAR50') {
      setAppliedVoucher({ code: 'KSTAR50', discountValue: 50000, description: 'Giảm 50K' });
      message.success('Áp dụng thành công!');
    } else {
      message.error('Mã không hợp lệ!');
    }
  };

  const handleCheckout = () => {
    message.loading({ content: 'Đang xử lý thanh toán bảo mật...', key: 'checkout' });
    setTimeout(() => {
      message.success({ content: 'Thanh toán thành công!', key: 'checkout', duration: 3 });
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', color: colors.textWhite }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '24px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 'bold' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: colors.primary, borderRadius: '4px' }}></div>
          CinemaPay
        </div>
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          style={{ backgroundColor: colors.inputBg, color: colors.textWhite, border: 'none', width: '40px', height: '40px', borderRadius: '50%' }} 
        />
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', padding: '20px 5% 60px', flex: 1 }}>
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Tóm tắt hóa đơn</h1>

            <div style={{ backgroundColor: colors.cardBg, borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ color: colors.primary, fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <SafetyCertificateOutlined /> PREMIUM EXPERIENCE
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{order.movieName}</h2>
                <div style={{ color: colors.textDim, fontSize: '14px' }}>{order.cinemaName} • {order.room}</div>
                <div style={{ color: colors.textDim, fontSize: '14px', marginBottom: '16px' }}>{order.showtime}</div>
                <Button style={{ backgroundColor: colors.inputBg, color: colors.textWhite, border: 'none', borderRadius: '20px', padding: '0 24px', fontWeight: 'bold' }}>
                  Đổi ghế
                </Button>
              </div>
              <img src={order.poster} alt={order.movieName} style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ backgroundColor: colors.inputBg, color: colors.primary, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><DesktopOutlined /></div>
                  <div>
                    <div style={{ color: colors.textDim, fontSize: '12px', textTransform: 'uppercase' }}>Ghế đã chọn</div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{order.seats.join(', ')}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatCurrency(order.ticketPrice)}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ backgroundColor: colors.inputBg, color: colors.primary, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CoffeeOutlined /></div>
                  <div>
                    <div style={{ color: colors.textDim, fontSize: '12px', textTransform: 'uppercase' }}>Đồ ăn & Đồ uống</div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Combo bắp nước</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatCurrency(order.comboPrice)}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ backgroundColor: colors.inputBg, color: colors.primary, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FileTextOutlined /></div>
                  <div>
                    <div style={{ color: colors.textDim, fontSize: '12px', textTransform: 'uppercase' }}>Phí đặt vé</div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Phí xử lý trực tuyến</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{formatCurrency(order.bookingFee)}</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Mã khuyến mãi</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Input 
                  placeholder="Nhập mã" 
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  style={{ flex: 1, backgroundColor: colors.cardBg, borderColor: colors.cardBg, color: '#fff', height: '45px', borderRadius: '25px', paddingLeft: '20px' }}
                />
                <Button type="primary" onClick={handleApplyVoucher} style={{ backgroundColor: colors.primary, border: 'none', height: '45px', borderRadius: '25px', padding: '0 24px', fontWeight: 'bold' }}>
                  Áp dụng
                </Button>
              </div>
              {appliedVoucher && (
                <div style={{ marginTop: '12px', color: colors.primary, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircleOutlined /> Đã áp dụng mã {appliedVoucher.code} (-{formatCurrency(appliedVoucher.discountValue)})
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: '1 1 350px', backgroundColor: colors.panelBg, borderRadius: '24px', padding: '32px', border: `1px solid ${colors.border}` }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Phương thức thanh toán</h2>
            
            <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              
              <div style={{ border: `1px solid ${paymentMethod === 'card' ? colors.primary : colors.border}`, backgroundColor: colors.bg, padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setPaymentMethod('card')}>
                <Radio value="card" style={{ color: colors.textWhite }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Thẻ tín dụng / ghi nợ</div>
                    <div style={{ color: colors.textDim, fontSize: '12px' }}>Visa, Mastercard, Amex</div>
                  </div>
                </Radio>
                <CreditCardOutlined style={{ color: colors.textDim, fontSize: '20px' }} />
              </div>

              <div style={{ border: `1px solid ${paymentMethod === 'ewallet' ? colors.primary : colors.border}`, backgroundColor: colors.bg, padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setPaymentMethod('ewallet')}>
                <Radio value="ewallet" style={{ color: colors.textWhite }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Ví điện tử</div>
                    <div style={{ color: colors.textDim, fontSize: '12px' }}>MoMo, ZaloPay, VNPay</div>
                  </div>
                </Radio>
                <WalletOutlined style={{ color: colors.textDim, fontSize: '20px' }} />
              </div>

              <div style={{ border: `1px solid ${paymentMethod === 'bank' ? colors.primary : colors.border}`, backgroundColor: colors.bg, padding: '16px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setPaymentMethod('bank')}>
                <Radio value="bank" style={{ color: colors.textWhite }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Chuyển khoản ngân hàng</div>
                    <div style={{ color: colors.textDim, fontSize: '12px' }}>Direct instant transfer</div>
                  </div>
                </Radio>
                <BankOutlined style={{ color: colors.textDim, fontSize: '20px' }} />
              </div>
            </Radio.Group>

            {paymentMethod === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <div style={{ color: colors.textDim, fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Số thẻ</div>
                  <Input 
                    placeholder="**** **** **** 4242" 
                    suffix={<LockOutlined style={{ color: colors.textDim }} />}
                    style={{ backgroundColor: colors.inputBg, border: 'none', color: '#fff', height: '45px', borderRadius: '10px' }} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.textDim, fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Ngày hết hạn</div>
                    <Input placeholder="MM/YY" style={{ backgroundColor: colors.inputBg, border: 'none', color: '#fff', height: '45px', borderRadius: '10px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: colors.textDim, fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px' }}>Mã CVV</div>
                    <Input placeholder="***" type="password" style={{ backgroundColor: colors.inputBg, border: 'none', color: '#fff', height: '45px', borderRadius: '10px' }} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderTop: `1px solid ${colors.border}`, paddingTop: '24px' }}>
              <span style={{ color: colors.textDim, fontSize: '14px', textTransform: 'uppercase' }}>Tổng thanh toán</span>
              <span style={{ color: colors.primary, fontSize: '28px', fontWeight: '900' }}>{formatCurrency(finalTotal)}</span>
            </div>

            {/* <-- Đã đổi ShieldOutlined thành SafetyOutlined ở đây */}
            <Button block type="primary" onClick={handleCheckout} icon={<SafetyOutlined />} style={{ backgroundColor: colors.primary, border: 'none', height: '56px', fontSize: '18px', fontWeight: 'bold', borderRadius: '28px', marginBottom: '16px' }}>
              Hoàn tất thanh toán
            </Button>
            
            <div style={{ textAlign: 'center', color: colors.textDim, fontSize: '11px', lineHeight: '1.5' }}>
              THANH TOÁN BẢO MẬT VỚI MÃ HÓA AN TOÀN<br/>BỞI GIAO THỨC CINEMAPAY.
            </div>
          </div>

        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px', color: colors.textDim, fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '12px', fontSize: '20px' }}>
          <SafetyCertificateOutlined />
          {/* <-- Đã đổi ShieldOutlined thành SafetyOutlined ở đây */}
          <SafetyOutlined />
          <LockOutlined />
        </div>
        © 2024 KStar Cinema. Mọi quyền được bảo lưu. Bảo mật SSL 256-bit.
      </div>

    </div>
  );
};

export default CheckoutPage;