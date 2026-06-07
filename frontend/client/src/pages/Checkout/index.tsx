import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Radio, message } from 'antd';
import { bookingApi } from '@/api/booking';
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
  SafetyOutlined,
} from '@ant-design/icons';

interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
  type: 'regular' | 'vip';
}

interface CoupleSeat {
  id: string;
  label: string;
  price: number;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  // --- Dữ liệu nhận từ các bước trước ---
  const selectedSeats: Seat[] = state?.selectedSeats || [];
  const selectedCouples: CoupleSeat[] = state?.selectedCouples || [];
  const foodItems: FoodItem[] = state?.foodItems || [];
  const bookingInfo = state?.bookingInfo || {};

  const movieTitle = bookingInfo?.movie?.title || 'Interstellar: Trải nghiệm IMAX';
  const cinemaName = bookingInfo?.cinema?.name || 'Grand Cinema';
  const roomName = bookingInfo?.room?.roomName || 'Phòng chiếu 4';
  const showDate = bookingInfo?.showtime?.date || 'Hôm nay';
  const showTime = bookingInfo?.showtime?.time || '20:30';

  // Thêm Google Fonts và Material Icons (giống ChonGhe)
  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1';
    document.head.appendChild(link1);
    document.head.appendChild(link2);
    return () => {
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, []);

  // Tính tổng tiền
  const seatsTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0) + selectedCouples.reduce((sum, c) => sum + c.price, 0);
  const comboTotal = foodItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bookingFee = 25000;
  const taxRate = 0.10;
  const subtotal = seatsTotal + comboTotal + bookingFee;
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  // Format VND
  const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + 'đ';

  // Hiển thị danh sách ghế
  const seatDisplay = useMemo(() => {
    const regSeats = selectedSeats.filter(s => s.type === 'regular').map(s => s.id).join(', ');
    const vipSeats = selectedSeats.filter(s => s.type === 'vip').map(s => `${s.id}(VIP)`).join(', ');
    const coupleSeats = selectedCouples.map(c => c.label).join(', ');
    return [regSeats, vipSeats, coupleSeats].filter(Boolean).join(' · ') || 'Chưa chọn ghế';
  }, [selectedSeats, selectedCouples]);

  const comboDisplay = useMemo(() => {
    if (foodItems.length === 0) return 'Chưa chọn combo';
    return foodItems.map(item => `${item.quantity}x ${item.name}`).join(', ');
  }, [foodItems]);

  // --- Payment logic ---
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountValue: number } | null>(null);

  const discountAmount = appliedVoucher ? appliedVoucher.discountValue : 0;
  const finalTotal = grandTotal - discountAmount;

  const handleApplyVoucher = () => {
    if (!voucherInput.trim()) {
      message.warning('Vui lòng nhập mã khuyến mãi!');
      return;
    }
    if (voucherInput.toUpperCase() === 'KSTAR50') {
      setAppliedVoucher({ code: 'KSTAR50', discountValue: 50000 });
      message.success('Áp dụng thành công!');
    } else {
      message.error('Mã không hợp lệ!');
    }
  };

  const handleCheckout = async () => {
    message.loading({ content: 'Đang xử lý thanh toán và tạo đơn hàng...', key: 'checkout' });
    try {
      const showtimeId = bookingInfo?.showtimeId || bookingInfo?.showtime?.id;
      if (!showtimeId) {
        message.error({ content: 'Thiếu thông tin suất chiếu!', key: 'checkout' });
        return;
      }

      const data = {
        showtimeId,
        showtimeSeatIds: selectedSeats.map(s => s.id),
        foods: foodItems.map(f => ({ foodId: f.id, quantity: f.quantity }))
      };

      const res = await bookingApi.createBooking(data);
      
      // Giả lập thanh toán thành công (ép DB sang trạng thái SUCCESS)
      const bookingId = (res as any).data?.booking?.id || (res as any).booking?.id;
      if (bookingId) {
        await bookingApi.mockPayment(bookingId);
      }
      
      message.success({ content: 'Thanh toán thành công! Đơn hàng đã được ghi nhận.', key: 'checkout', duration: 3 });
      
      // Chuyển hướng về trang chủ
      setTimeout(() => navigate('/home'), 2000);
    } catch (error: any) {
      console.error('Lỗi khi thanh toán:', error);
      message.error({ 
        content: error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!', 
        key: 'checkout', 
        duration: 4 
      });
    }
  };

  // --- Style đồng bộ với FoodDrinkPage ---
  const colors = {
    surface: '#0a0a0a',
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#e9bcb6',
    primaryContainer: '#e50914',
    primary: '#ffb4aa',
    border: 'rgba(255,255,255,0.1)',
  };

  const glassStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border}`,
  };

  return (
    <div style={{ backgroundColor: colors.surface, color: colors.onSurface, fontFamily: 'Montserrat, sans-serif', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '32px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1440px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: colors.onSurface }}>arrow_back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: colors.primaryContainer, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'white' }}>receipt</span>
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(16px, 5vw, 20px)', fontWeight: 'bold', color: 'white', margin: 0 }}>Thanh toán</h1>
              <p style={{ fontSize: 'clamp(10px, 3vw, 12px)', color: `${colors.onSurfaceVariant}99`, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{cinemaName} • {roomName} • {showDate}, {showTime}</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ color: colors.onSurfaceVariant }}>close</span>
        </button>
      </header>

      {/* Phần còn lại giữ nguyên... */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px', paddingBottom: '48px' }}>
        {/* Thanh tiến trình - bước 3 active */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', border: `1px solid ${colors.onSurface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>CHỌN GHẾ</span>
          </div>
          <div style={{ width: '40px', height: '1px', backgroundColor: colors.border }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', border: `1px solid ${colors.onSurface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>CHỌN COMBO</span>
          </div>
          <div style={{ width: '40px', height: '1px', backgroundColor: colors.border }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', backgroundColor: colors.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>3</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: colors.primary }}>THANH TOÁN</span>
          </div>
        </div>

        {/* Layout 2 cột */}
        <div className="two-column-layout" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 'clamp(24px, 5vw, 48px)' }}>
          {/* Cột trái - Tóm tắt đơn hàng */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...glassStyle, borderRadius: '24px', padding: 'clamp(24px, 4vw, 32px)', marginBottom: '32px' }}>
              <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 'bold', marginBottom: '24px' }}>Tóm tắt đơn hàng</h2>

              {/* Thông tin phim */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <div style={{ width: '80px', height: '112px', backgroundColor: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop" alt={movieTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px' }}>{movieTitle}</h3>
                  <p style={{ fontSize: '14px', color: colors.onSurfaceVariant, margin: 0 }}>{cinemaName} • {roomName}</p>
                  <p style={{ fontSize: '14px', color: colors.onSurfaceVariant, margin: '4px 0' }}>{showDate}, {showTime}</p>
                </div>
              </div>

              {/* Ghế đã chọn */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(229,9,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DesktopOutlined style={{ color: colors.primaryContainer, fontSize: '20px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: colors.onSurfaceVariant }}>GHẾ ĐÃ CHỌN</div>
                    <div style={{ fontWeight: 'bold' }}>{seatDisplay}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: colors.primary }}>{formatVND(seatsTotal)}</div>
              </div>

              {/* Combo đã chọn */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(229,9,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CoffeeOutlined style={{ color: colors.primaryContainer, fontSize: '20px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: colors.onSurfaceVariant }}>COMBO & ĐỒ ĂN</div>
                    <div style={{ fontWeight: 'bold' }}>{comboDisplay}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: colors.primary }}>{formatVND(comboTotal)}</div>
              </div>

              {/* Phí đặt vé */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(229,9,20,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileTextOutlined style={{ color: colors.primaryContainer, fontSize: '20px' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: colors.onSurfaceVariant }}>PHÍ ĐẶT VÉ</div>
                    <div style={{ fontSize: '13px', color: colors.onSurfaceVariant }}>Phí xử lý trực tuyến</div>
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: colors.primary }}>{formatVND(bookingFee)}</div>
              </div>

              {/* Mã khuyến mãi */}
              <div style={{ marginTop: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>Mã khuyến mãi</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Nhập mã"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, borderRadius: '30px', padding: '12px 20px', color: colors.onSurface, outline: 'none' }}
                  />
                  <button
                    onClick={handleApplyVoucher}
                    style={{ background: colors.primaryContainer, border: 'none', borderRadius: '30px', padding: '0 24px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Áp dụng
                  </button>
                </div>
                {appliedVoucher && (
                  <div style={{ marginTop: '12px', color: colors.primary, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircleOutlined /> Đã áp dụng mã {appliedVoucher.code} (-{formatVND(appliedVoucher.discountValue)})
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải - Thanh toán */}
          <aside style={{ width: 'clamp(320px, 35vw, 400px)', flexShrink: 0, position: 'sticky', top: '32px' }}>
            <div style={{ ...glassStyle, borderRadius: '24px', padding: 'clamp(24px, 4vw, 32px)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Phương thức thanh toán</h2>

              <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {/* Thẻ */}
                <div style={{ border: `1px solid ${paymentMethod === 'card' ? colors.primaryContainer : colors.border}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.02)' }} onClick={() => setPaymentMethod('card')}>
                  <Radio value="card">
                    <div style={{ fontWeight: 'bold' }}>Thẻ tín dụng / ghi nợ</div>
                    <div style={{ fontSize: '12px', color: colors.onSurfaceVariant }}>Visa, Mastercard, Amex</div>
                  </Radio>
                </div>
                {/* Ví điện tử */}
                <div style={{ border: `1px solid ${paymentMethod === 'ewallet' ? colors.primaryContainer : colors.border}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.02)' }} onClick={() => setPaymentMethod('ewallet')}>
                  <Radio value="ewallet">
                    <div style={{ fontWeight: 'bold' }}>Ví điện tử</div>
                    <div style={{ fontSize: '12px', color: colors.onSurfaceVariant }}>MoMo, ZaloPay, VNPay</div>
                  </Radio>
                </div>
                {/* Chuyển khoản */}
                <div style={{ border: `1px solid ${paymentMethod === 'bank' ? colors.primaryContainer : colors.border}`, borderRadius: '16px', padding: '16px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.02)' }} onClick={() => setPaymentMethod('bank')}>
                  <Radio value="bank">
                    <div style={{ fontWeight: 'bold' }}>Chuyển khoản ngân hàng</div>
                    <div style={{ fontSize: '12px', color: colors.onSurfaceVariant }}>Thanh toán trực tiếp</div>
                  </Radio>
                </div>
              </Radio.Group>

              {paymentMethod === 'card' && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>Số thẻ</div>
                    <input type="text" placeholder="**** **** **** 4242" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px 16px', color: colors.onSurface }} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>Ngày hết hạn</div>
                      <input type="text" placeholder="MM/YY" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px 16px', color: colors.onSurface }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>CVV</div>
                      <input type="password" placeholder="***" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, borderRadius: '12px', padding: '12px 16px', color: colors.onSurface }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Tổng cộng */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>Tạm tính</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{formatVND(grandTotal)}</span>
              </div>
              {appliedVoucher && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: colors.primary }}>
                  <span>Giảm giá</span>
                  <span>-{formatVND(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px', borderTop: `1px solid ${colors.border}`, paddingTop: '16px' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Tổng thanh toán</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: colors.primaryContainer }}>{formatVND(finalTotal)}</span>
              </div>

              <button
                onClick={handleCheckout}
                style={{ width: '100%', background: colors.primaryContainer, border: 'none', borderRadius: '30px', padding: '16px', color: 'white', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(229,9,20,0.3)' }}
              >
                <SafetyOutlined /> Hoàn tất thanh toán
              </button>

              <div style={{ textAlign: 'center', fontSize: '10px', color: `${colors.onSurfaceVariant}66`, marginTop: '20px', letterSpacing: '1px' }}>
                THANH TOÁN BẢO MẬT VỚI MÃ HÓA SSL<br />BỞI CINEMAPAY
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${colors.border}`, padding: '32px 20px', textAlign: 'center', marginTop: '48px' }}>
        <div style={{ fontSize: '11px', color: `${colors.onSurfaceVariant}66`, letterSpacing: '1px' }}>© 2025 KSTAR Cinema. Bảo lưu mọi quyền.</div>
      </footer>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        button, .ant-radio-wrapper {
          transition: all 0.2s;
        }
        button:hover {
          transform: scale(1.02);
        }
        button:active {
          transform: scale(0.98);
        }
        @media (max-width: 900px) {
          .two-column-layout {
            flex-direction: column !important;
            align-items: center !important;
          }
          .two-column-layout aside {
            width: 100% !important;
            max-width: 500px !important;
            position: static !important;
            margin-top: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;