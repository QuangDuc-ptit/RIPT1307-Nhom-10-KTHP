import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- Types ---
type SeatStatus = 'available' | 'vip' | 'booked' | 'locked';
type SeatType = 'regular' | 'vip';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  type: SeatType;
  price: number;
}

interface CoupleSeat {
  id: string;
  label: string;
  price: number;
}

// --- Constants ---
const REGULAR_PRICE = 12;
const VIP_PRICE = 18;
const COUPLE_PRICE = 24;
const BOOKING_FEE = 2.5;
const TAX_RATE = 0.10;

// --- Seat Data Definition ---
const rows = ['A', 'B', 'C', 'D', 'E'];
const seatsPerRow = 8;

const seatStatusMap: Record<string, Record<number, SeatStatus>> = {
  A: { 1: 'booked', 2: 'booked', 3: 'available', 4: 'available', 5: 'available', 6: 'booked', 7: 'booked', 8: 'booked' },
  B: { 1: 'available', 2: 'available', 3: 'available', 4: 'available', 5: 'available', 6: 'available', 7: 'available', 8: 'available' },
  C: { 1: 'locked', 2: 'locked', 3: 'available', 4: 'available', 5: 'available', 6: 'available', 7: 'available', 8: 'available' },
  D: { 1: 'booked', 2: 'vip', 3: 'vip', 4: 'vip', 5: 'booked', 6: 'vip', 7: 'vip', 8: 'vip' },
  E: { 1: 'vip', 2: 'vip', 3: 'vip', 4: 'vip', 5: 'vip', 6: 'vip', 7: 'vip', 8: 'vip' }
};

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      const status = seatStatusMap[row]?.[i] || 'available';
      const type: SeatType = status === 'vip' ? 'vip' : 'regular';
      const price = type === 'vip' ? VIP_PRICE : REGULAR_PRICE;
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: status === 'vip' ? 'available' : status,
        type,
        price
      });
    }
  }
  return seats;
};

const coupleSeatsData: CoupleSeat[] = [
  { id: 'cp1', label: 'CP1', price: COUPLE_PRICE },
  { id: 'cp2', label: 'CP2', price: COUPLE_PRICE },
  { id: 'cp3', label: 'CP3', price: COUPLE_PRICE },
  { id: 'cp4', label: 'CP4', price: COUPLE_PRICE },
  { id: 'cp5', label: 'CP5', price: COUPLE_PRICE },
];

const INITIAL_SELECTED_SEATS = ['B3', 'B4'];

// --- Helper ---
const isSeatSelectable = (seat: Seat): boolean => {
  return seat.status === 'available' || seat.status === 'vip';
};

// --- Component ---
const ChonGhe: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = location.state as any;

  const movieTitle = bookingInfo?.movie?.title || 'Interstellar: Trải nghiệm IMAX';
  const cinemaName = bookingInfo?.cinema?.name || 'Grand Cinema';
  const roomName = bookingInfo?.room?.roomName || 'Phòng chiếu 4';
  const showDate = bookingInfo?.showtime?.date || 'Hôm nay';
  const showTime = bookingInfo?.showtime?.time || '20:30';

  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(() => {
    const initialSet = new Set<string>();
    INITIAL_SELECTED_SEATS.forEach(id => initialSet.add(id));
    return initialSet;
  });
  const [selectedCoupleIds, setSelectedCoupleIds] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(594);

  const allSeats = useMemo(() => generateSeats(), []);
  const seatMap = useMemo(() => {
    const map = new Map<string, Seat>();
    allSeats.forEach(seat => map.set(seat.id, seat));
    return map;
  }, [allSeats]);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seatId: string) => {
    const seat = seatMap.get(seatId);
    if (!seat || !isSeatSelectable(seat)) return;
    setSelectedSeatIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seatId)) newSet.delete(seatId);
      else newSet.add(seatId);
      return newSet;
    });
  };

  const handleCoupleClick = (coupleId: string) => {
    setSelectedCoupleIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(coupleId)) newSet.delete(coupleId);
      else newSet.add(coupleId);
      return newSet;
    });
  };

  const selectedSeats = useMemo(() => allSeats.filter(seat => selectedSeatIds.has(seat.id)), [allSeats, selectedSeatIds]);
  const selectedCouples = useMemo(() => coupleSeatsData.filter(c => selectedCoupleIds.has(c.id)), [selectedCoupleIds]);

  const seatsSubtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const couplesSubtotal = selectedCouples.reduce((sum, c) => sum + c.price, 0);
  const subtotal = seatsSubtotal + couplesSubtotal;
  const totalWithFee = subtotal + BOOKING_FEE;
  const tax = totalWithFee * TAX_RATE;
  const total = totalWithFee + tax;

  const selectedSeatsDisplay = useMemo(() => {
    const regularSeats = selectedSeats.filter(s => s.type === 'regular');
    const vipSeats = selectedSeats.filter(s => s.type === 'vip');
    const regularText = regularSeats.map(s => s.id).join(', ');
    const vipText = vipSeats.map(s => `${s.id}(VIP)`).join(', ');
    const coupleText = selectedCouples.map(c => c.label).join(', ');
    const parts = [];
    if (regularText) parts.push(regularText);
    if (vipText) parts.push(vipText);
    if (coupleText) parts.push(coupleText);
    return parts.length > 0 ? parts.join(' · ') : 'Chưa có ghế nào';
  }, [selectedSeats, selectedCouples]);

  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    rows.forEach(row => {
      grouped[row] = allSeats.filter(seat => seat.row === row);
    });
    return grouped;
  }, [allSeats]);

  const handleConfirm = () => {
    navigate('/checkout', { state: { selectedSeats, selectedCouples, total, bookingInfo } });
  };

  // Thêm handler cho nút Đồ ăn
  const handleFoodDrink = () => {
    navigate('/food-drink', {
      state: {
        selectedSeats,
        selectedCouples,
        totalSeatsPrice: subtotal,
        bookingInfo,
      }
    });
  };

  const getSeatStyle = (seat: Seat, isSelected: boolean): React.CSSProperties => {
    const base = {
      width: '24px',
      height: '24px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
    if (isSelected) return { ...base, backgroundColor: '#e50914', boxShadow: '0 0 15px rgba(229,9,20,0.9)' };
    if (seat.status === 'booked') return { ...base, backgroundColor: '#3b5998', cursor: 'not-allowed' };
    if (seat.status === 'locked') return { ...base, backgroundColor: '#252525', cursor: 'not-allowed' };
    if (seat.type === 'vip') return { ...base, backgroundColor: '#f59e0b' };
    return { ...base, backgroundColor: 'rgba(255,255,255,0.1)' };
  };

  const colors = {
    bg: '#0a0a0a',
    surface: '#0a0a0a',
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#e9bcb6',
    primaryContainer: '#e50914',
    primary: '#ff0000',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.onSurface, fontFamily: 'Montserrat, sans-serif' }}>
      <header style={{ padding: '32px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: colors.onSurface }}>arrow_back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: colors.primaryContainer, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'white' }}>movie</span>
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0 }}>{movieTitle}</h1>
              <p style={{ fontSize: '12px', color: `${colors.onSurfaceVariant}99`, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{cinemaName} • {roomName} • {showDate}, {showTime}</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ color: colors.onSurfaceVariant }}>close</span>
        </button>
      </header>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '48px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '600px', marginBottom: '64px', textAlign: 'center' }}>
            <div style={{ height: '3px', width: '80%', margin: '0 auto 16px', background: 'linear-gradient(180deg, rgba(229,9,20,0.6) 0%, rgba(229,9,20,0) 100%)', filter: 'blur(4px)' }}></div>
            <div style={{ fontSize: '10px', letterSpacing: '5px', color: `${colors.onSurfaceVariant}66`, fontWeight: 'bold' }}>SCREEN THIS WAY</div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '32px', marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}></div><span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>CÒN TRỐNG</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#e50914', borderRadius: '2px', boxShadow: '0 0 5px #e50914' }}></div><span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>ĐÃ CHỌN</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#3b5998', borderRadius: '2px' }}></div><span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>ĐÃ ĐẶT</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#252525', borderRadius: '2px' }}></div><span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>BỊ KHÓA</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div><span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px' }}>GHẾ VIP</span></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '56px' }}>
            {rows.map(row => {
              const rowSeats = seatsByRow[row];
              if (!rowSeats) return null;
              const firstHalf = rowSeats.slice(0, 4);
              const secondHalf = rowSeats.slice(4, 8);
              return (
                <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                  <div style={{ width: '16px', fontSize: '10px', fontWeight: 'bold', color: `${colors.onSurfaceVariant}66` }}>{row}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {firstHalf.map(seat => (
                      <button key={seat.id} onClick={() => handleSeatClick(seat.id)} disabled={!isSeatSelectable(seat)} style={getSeatStyle(seat, selectedSeatIds.has(seat.id))} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {secondHalf.map(seat => (
                      <button key={seat.id} onClick={() => handleSeatClick(seat.id)} disabled={!isSeatSelectable(seat)} style={getSeatStyle(seat, selectedSeatIds.has(seat.id))} />
                    ))}
                  </div>
                  <div style={{ width: '16px', fontSize: '10px', fontWeight: 'bold', color: `${colors.onSurfaceVariant}66`, textAlign: 'right' }}>{row}</div>
                </div>
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {coupleSeatsData.map(couple => (
                <button key={couple.id} onClick={() => handleCoupleClick(couple.id)} style={{
                  padding: '8px 20px', borderRadius: '9999px', border: '1px solid', fontSize: '9px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase',
                  backgroundColor: selectedCoupleIds.has(couple.id) ? colors.primaryContainer : 'rgba(255,255,255,0.05)',
                  borderColor: selectedCoupleIds.has(couple.id) ? colors.primaryContainer : 'rgba(255,255,255,0.05)',
                  color: selectedCoupleIds.has(couple.id) ? 'white' : `${colors.onSurfaceVariant}99`,
                  boxShadow: selectedCoupleIds.has(couple.id) ? '0 0 10px rgba(229,9,20,0.3)' : 'none',
                  cursor: 'pointer'
                }}>
                  COUPLE
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', width: '100%', maxWidth: '600px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${colors.primaryContainer}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: colors.primaryContainer }}>timer</span>
            </div>
            <p style={{ fontSize: '13px', margin: 0 }}>Ghế sẽ được giữ trong <strong style={{ color: colors.primaryContainer }}>{formatTime(timeLeft)}</strong> phút. Vui lòng hoàn tất thanh toán trước khi hết thời gian.</p>
          </div>
        </div>

        <aside style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '32px', position: 'sticky', top: '32px', display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="material-symbols-outlined" style={{ color: colors.primaryContainer, fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Tóm tắt đặt vé</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: colors.primaryContainer, letterSpacing: '1.5px', marginBottom: '8px' }}>GHẾ ĐÃ CHỌN</div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>{selectedSeatsDisplay}</h3>
                </div>
                <span style={{ fontSize: '24px', fontWeight: 'bold' }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ background: colors.primaryContainer, color: 'white', padding: '6px 16px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>{selectedSeats.length + selectedCouples.length} vé</span>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>{selectedSeats.some(s => s.type === 'vip') || selectedCouples.length > 0 ? 'Có VIP' : 'Thường'}</span>
              </div>
            </div>
            <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: `${colors.onSurfaceVariant}99` }}><span>Tạm tính (vé + ghế đôi)</span><span style={{ color: 'white' }}>${subtotal.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: `${colors.onSurfaceVariant}99` }}><span>Phí đặt vé</span><span style={{ color: 'white' }}>${BOOKING_FEE.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: `${colors.onSurfaceVariant}99`, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}><span>VAT (10%)</span><span style={{ color: 'white' }}>${tax.toFixed(2)}</span></div>
            </div>
            <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ color: '#eab308', fontVariationSettings: "'FILL' 1" }}>stars</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#eab308', letterSpacing: '1px' }}>CÓ THỂ NÂNG CẤP LÊN GHẾ VIP</div>
                <p style={{ fontSize: '13px', margin: 0, color: 'rgba(255,255,255,0.8)' }}>Thêm bắp rang và nước ngọt với giá <strong style={{ color: '#eab308' }}>$8.50</strong></p>
              </div>
            </div>
            {/* Nút Đồ ăn đã có onClick */}
            <button 
              onClick={handleFoodDrink}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', color: 'white', fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer' }}
            >
              Đồ ăn
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <div><div style={{ fontSize: '12px', fontWeight: 'bold', color: `${colors.onSurfaceVariant}80`, letterSpacing: '1px' }}>Tổng tiền</div><div style={{ fontSize: '48px', fontWeight: '900', color: colors.primaryContainer, lineHeight: 1 }}>${total.toFixed(2)}</div></div>
              <div style={{ fontSize: '9px', fontWeight: 'bold', color: `${colors.onSurfaceVariant}66`, letterSpacing: '1px' }}>Đã bao gồm tất cả thuế</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <button onClick={handleConfirm} style={{ background: colors.primaryContainer, border: 'none', padding: '16px', borderRadius: '16px', color: 'white', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 8px 30px rgba(229,9,20,0.4)' }}>
                Xác nhận lựa chọn <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
              <div style={{ fontSize: '9px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '2px', color: `${colors.onSurfaceVariant}4d` }}>THANH TOÁN BẢO MẬT BỞI CINEMAPAY</div>
            </div>
          </div>
        </aside>
      </main>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.03)', padding: '40px 20px', textAlign: 'center', marginTop: '48px' }}>
        <div style={{ fontSize: '11px', color: `${colors.onSurfaceVariant}4d`, letterSpacing: '1px' }}>© 2024 KSTAR Cinema. Bảo lưu mọi quyền.</div>
      </footer>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        button {
          transition: all 0.2s;
        }
        button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default ChonGhe;