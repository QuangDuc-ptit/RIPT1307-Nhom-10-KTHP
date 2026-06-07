import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingApi, ShowtimeSeat } from '@/api/booking';
import { message } from 'antd';

// --- Types ---
type SeatType = "REGULAR" | "VIP" | "SWEETBOX";
type SeatStatus = "AVAILABLE" | "BOOKED" | "LOCKED";

interface Seat {
  id: string; // The showtimeSeatId
  seatId: string; // The physical seatId
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  isCenterZone: boolean;
  price: number;
}

// --- Constants ---
const REGULAR_PRICE = 120000;
const VIP_PRICE = 180000;
const SWEETBOX_PRICE = 250000;
const CENTER_BONUS = 20000;
const BOOKING_FEE = 25000;

const centerRows = ['F', 'G', 'H', 'I', 'J', 'K'];
const CENTER_HORIZONTAL_EXPAND = 1;

function getCenterSeats(totalSeats: number, expand: number = CENTER_HORIZONTAL_EXPAND): number[] {
  const centerLeft = Math.floor(totalSeats / 2);
  const centerRight = centerLeft + 1;
  const sideCount = 2 + expand; 
  const start = centerLeft - (sideCount - 1);
  const end = centerRight + (sideCount - 1);
  const seats: number[] = [];
  for (let i = start; i <= end; i++) {
    if (i >= 1 && i <= totalSeats) seats.push(i);
  }
  return seats;
}

function isCenterZone(row: string, seatNumber: number, totalSeats: number): boolean {
  if (!centerRows.includes(row)) return false;
  const centerSeats = getCenterSeats(totalSeats);
  return centerSeats.includes(seatNumber);
}

const isSeatSelectable = (seat: Seat): boolean => seat.status === "AVAILABLE";

const formatVND = (amount: number) => {
  return amount.toLocaleString('vi-VN') + ' ₫';
};

const ChonGhe: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingInfo = location.state as any;

  const movieTitle = bookingInfo?.movie?.title || 'Đang cập nhật';
  const cinemaName = bookingInfo?.cinema?.name || 'Đang cập nhật';
  const roomName = bookingInfo?.room?.roomName || 'Đang cập nhật';
  
  // Parse date and time from the showtime object
  const startTime = bookingInfo?.showtime?.startTime ? new Date(bookingInfo.showtime.startTime) : null;
  const showDate = startTime ? `${startTime.getDate().toString().padStart(2, '0')}/${(startTime.getMonth() + 1).toString().padStart(2, '0')}` : 'Hôm nay';
  const showTime = bookingInfo?.showtime?.timeString || (startTime ? `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}` : '20:30');

  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState<number>(594);
  const [allSeats, setAllSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu ghế từ API
  useEffect(() => {
    const fetchSeats = async () => {
      const showtimeId = bookingInfo?.showtime?.id;
      if (!showtimeId) {
        message.error("Không tìm thấy thông tin suất chiếu");
        setIsLoading(false);
        return;
      }

      try {
        const detail = await bookingApi.getShowtimeDetail(showtimeId);
        if (detail && detail.seats) {
          // Tính totalSeats cho mỗi row để tính vùng trung tâm (nếu cần)
          // Giả sử lấy max number làm totalSeats
          let maxNumber = 15;
          detail.seats.forEach(s => {
            if (s.seat.number > maxNumber) maxNumber = s.seat.number;
          });

          const mappedSeats: Seat[] = detail.seats.map(stSeat => {
            const row = stSeat.seat.row;
            const number = stSeat.seat.number;
            const type = stSeat.seat.type as SeatType;
            const isCenter = isCenterZone(row, number, maxNumber);
            
            let price = type === "VIP" ? VIP_PRICE : (type === "SWEETBOX" ? SWEETBOX_PRICE : REGULAR_PRICE);
            if (isCenter && type === "VIP") price += CENTER_BONUS;

            return {
              id: stSeat.id, // Dùng ID của showtimeSeat để đặt vé
              seatId: stSeat.seatId,
              row,
              number,
              type,
              status: stSeat.status,
              isCenterZone: isCenter,
              price
            };
          });

          setAllSeats(mappedSeats);
        }
      } catch (error) {
        console.error("Lỗi khi lấy sơ đồ ghế", error);
        message.error("Không thể tải sơ đồ ghế, vui lòng thử lại");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeats();
  }, [bookingInfo]);

  const rows = useMemo(() => {
    const uniqueRows = Array.from(new Set(allSeats.map(s => s.row)));
    return uniqueRows.sort();
  }, [allSeats]);

  const seatMap = useMemo(() => new Map(allSeats.map(seat => [seat.id, seat])), [allSeats]);

  // Fonts & timer
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

  const selectedSeats = useMemo(() => allSeats.filter(seat => selectedSeatIds.has(seat.id)), [allSeats, selectedSeatIds]);

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const hasTickets = selectedSeats.length > 0;
  const total = hasTickets ? subtotal + BOOKING_FEE : 0;
  const ticketCount = selectedSeats.length;

  const previewSeats = selectedSeats.map(s => `${s.row}${s.number}`);
  const displayedSeats = previewSeats.slice(0, 6);

  const seatsByRow = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    rows.forEach(row => { 
      grouped[row] = allSeats.filter(seat => seat.row === row).sort((a,b) => a.number - b.number); 
    });
    return grouped;
  }, [allSeats, rows]);

  const handleConfirm = () => navigate('/checkout', { state: { selectedSeats, total, bookingInfo } });
  const handleFoodDrink = () => navigate('/food-drink', { state: { selectedSeats, totalSeatsPrice: subtotal, bookingInfo } });

  // Màu sắc
  const colors = {
    bg: '#0a0a0a',
    surface: '#0a0a0a',
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#e9bcb6',
    primaryContainer: '#e50914',
    primary: '#ffb4aa',
    border: 'rgba(255,255,255,0.1)',
    textDim: '#a3989c',
  };
  const glassStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border}`,
  };

  const getSeatStyle = (seat: Seat, isSelected: boolean): React.CSSProperties => {
    const base = {
      width: 'clamp(18px, 4vw, 28px)',
      height: 'clamp(18px, 4vw, 28px)',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };
    if (seat.type === "SWEETBOX") {
      base.width = 'clamp(40px, 8vw, 60px)'; // Rộng gấp đôi ghế thường
    }
    
    if (isSelected) {
      return {
        ...base,
        backgroundColor: '#ff0000',
        transform: 'scale(1.08)',
        boxShadow: '0 0 12px rgba(229,9,20,0.8)',
      };
    }
    if (seat.status === "BOOKED") return { ...base, backgroundColor: '#5b57c7', cursor: 'not-allowed' };
    if (seat.status === "LOCKED") return { ...base, backgroundColor: '#222222', cursor: 'not-allowed' };
    if (seat.type === "VIP") {
      if (seat.isCenterZone) return { ...base, backgroundColor: '#00c853' };
      return { ...base, backgroundColor: '#f5b000' };
    }
    if (seat.type === "SWEETBOX") {
      return { ...base, backgroundColor: '#e91e63' }; // Màu hồng cho Sweetbox
    }
    return { ...base, backgroundColor: '#444444' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, color: colors.onSurface, fontFamily: 'Montserrat, sans-serif' }}>
      <header style={{ padding: '32px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1440px', margin: '0 auto', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ color: colors.onSurface }}>arrow_back</span>
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: colors.primaryContainer, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'white' }}>movie</span>
            </div>
            <div>
              <h1 style={{ fontSize: 'clamp(16px, 5vw, 20px)', fontWeight: 'bold', color: 'white', margin: 0 }}>{movieTitle}</h1>
              <p style={{ fontSize: 'clamp(10px, 3vw, 12px)', color: `${colors.onSurfaceVariant}99`, margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{cinemaName} • {roomName} • {showDate}, {showTime}</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ color: colors.onSurfaceVariant }}>close</span>
        </button>
      </header>

      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px', paddingBottom: '48px' }}>
        {/* Thanh tiến trình */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', backgroundColor: colors.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'white' }}>1</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: colors.primary }}>CHỌN GHẾ</span>
          </div>
          <div style={{ width: '40px', height: '1px', backgroundColor: colors.border }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', border: `1px solid ${colors.onSurface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>CHỌN COMBO</span>
          </div>
          <div style={{ width: '40px', height: '1px', backgroundColor: colors.border }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '9999px', border: `1px solid ${colors.onSurface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>THANH TOÁN</span>
          </div>
        </div>

        <div className="two-column-layout" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 'clamp(24px, 5vw, 48px)' }}>
          {/* Cột trái - Sơ đồ ghế */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '700px', marginBottom: '64px', textAlign: 'center' }}>
              <div style={{ height: '3px', width: '80%', margin: '0 auto 16px', background: 'linear-gradient(180deg, rgba(229,9,20,0.6) 0%, rgba(229,9,20,0) 100%)', filter: 'blur(4px)' }}></div>
              <div style={{ fontSize: '10px', letterSpacing: '5px', color: `${colors.onSurfaceVariant}66`, fontWeight: 'bold' }}>SCREEN THIS WAY</div>
            </div>

            {/* Chú thích màu sắc */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(12px, 4vw, 32px)', marginBottom: '64px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#444444', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>GHẾ THƯỜNG</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#f5b000', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>GHẾ VIP</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#e91e63', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>SWEETBOX</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#00c853', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>VIP TRUNG TÂM</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#ff0000', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>ĐÃ CHỌN</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#5b57c7', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>ĐÃ ĐẶT</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '14px', height: '14px', backgroundColor: '#222222', borderRadius: '2px' }}></div><span style={{ fontSize: 'clamp(8px, 2.5vw, 10px)', fontWeight: 'bold', letterSpacing: '1px' }}>BỊ KHÓA</span></div>
            </div>

            {isLoading ? (
              <div style={{ padding: '40px', color: colors.textDim }}>Đang tải sơ đồ ghế...</div>
            ) : (
              <div style={{ overflowX: 'auto', width: '100%', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 10px)', minWidth: 'min-content' }}>
                  {rows.map(row => {
                    const rowSeats = seatsByRow[row];
                    if (!rowSeats) return null;
                    const midpoint = Math.ceil(rowSeats.length / 2);
                    const leftSeats = rowSeats.slice(0, midpoint);
                    const rightSeats = rowSeats.slice(midpoint);
                    const gapBetweenHalves = 'clamp(30px, 6vw, 50px)';
                    return (
                      <div key={row} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: gapBetweenHalves }}>
                        <div style={{ width: '20px', fontSize: 'clamp(8px, 2vw, 10px)', fontWeight: 'bold', color: `${colors.onSurfaceVariant}66`, textAlign: 'center' }}>{row}</div>
                        <div style={{ display: 'flex', gap: 'clamp(3px, 1vw, 6px)' }}>
                          {leftSeats.map(seat => (
                            <button key={seat.id} onClick={() => handleSeatClick(seat.id)} disabled={!isSeatSelectable(seat)} style={getSeatStyle(seat, selectedSeatIds.has(seat.id))} />
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 'clamp(3px, 1vw, 6px)' }}>
                          {rightSeats.map(seat => (
                            <button key={seat.id} onClick={() => handleSeatClick(seat.id)} disabled={!isSeatSelectable(seat)} style={getSeatStyle(seat, selectedSeatIds.has(seat.id))} />
                          ))}
                        </div>
                        <div style={{ width: '20px', fontSize: 'clamp(8px, 2vw, 10px)', fontWeight: 'bold', color: `${colors.onSurfaceVariant}66`, textAlign: 'center' }}>{row}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timer */}
            <div style={{ ...glassStyle, borderRadius: '16px', padding: 'clamp(12px, 3vw, 16px) clamp(16px, 4vw, 24px)', display: 'flex', alignItems: 'center', gap: 'clamp(12px, 3vw, 16px)', width: '100%', maxWidth: '600px', marginTop: '32px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${colors.primaryContainer}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ color: colors.primaryContainer }}>timer</span>
              </div>
              <p style={{ fontSize: 'clamp(11px, 3vw, 13px)', margin: 0 }}>Ghế sẽ được giữ trong <strong style={{ color: colors.primaryContainer }}>{formatTime(timeLeft)}</strong> phút. Vui lòng hoàn tất thanh toán trước khi hết thời gian.</p>
            </div>
          </div>

          {/* Cột phải - Tóm tắt đặt vé (hiển thị tiền đẹp hơn) */}
          <aside style={{ width: '100%', maxWidth: '380px', flexShrink: 0, position: 'sticky', top: '32px' }}>
            <div style={{ ...glassStyle, borderRadius: '24px', padding: 'clamp(20px, 4vw, 32px)', display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vw, 32px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="material-symbols-outlined" style={{ color: colors.primaryContainer, fontSize: '24px', fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
                  <h2 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 'bold', margin: 0 }}>Tóm tắt đặt vé</h2>
                </div>
                <span style={{ background: 'rgba(229,9,20,0.2)', padding: '4px 12px', borderRadius: '40px', fontSize: '13px', fontWeight: 'bold', color: colors.primaryContainer }}>
                  {ticketCount} ghế
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: 'clamp(16px, 3vw, 24px)', border: `1px solid ${colors.border}` }}>
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: colors.primaryContainer, letterSpacing: '1.5px', marginBottom: '12px' }}>GHẾ ĐÃ CHỌN</div>
                <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
                  {previewSeats.length === 0 ? (
                    <div style={{ color: `${colors.onSurfaceVariant}99`, fontSize: '13px' }}>Chưa có ghế nào</div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        {displayedSeats.map(seat => (
                          <span key={seat} style={{ padding: '4px 8px', borderRadius: '999px', background: 'rgba(255,255,255,.08)', fontSize: '11px' }}>
                            {seat}
                          </span>
                        ))}
                      </div>
                      {previewSeats.length > 6 && (
                        <div style={{ color: colors.primary, fontSize: '12px', marginTop: '4px' }}>
                          +{previewSeats.length - 6} ghế khác
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {hasTickets ? (
                <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'clamp(14px, 4vw, 16px)', color: `${colors.onSurfaceVariant}99` }}>
                    <span>Tạm tính</span>
                    <span style={{ color: colors.onSurface, fontWeight: 600 }}>{formatVND(subtotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'clamp(14px, 4vw, 16px)', color: `${colors.onSurfaceVariant}99`, borderBottom: `1px solid ${colors.border}`, paddingBottom: '16px' }}>
                    <span>Phí đặt vé</span>
                    <span style={{ color: colors.onSurface, fontWeight: 600 }}>{formatVND(BOOKING_FEE)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: `${colors.onSurfaceVariant}66`, fontSize: '13px' }}>
                  Vui lòng chọn ghế để xem chi tiết giá
                </div>
              )}

              <div style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', gap: '16px', cursor: 'pointer', flexWrap: 'wrap' }}>
                <span className="material-symbols-outlined" style={{ color: '#eab308', fontVariationSettings: "'FILL' 1" }}>stars</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#eab308', letterSpacing: '1px' }}>CÓ THỂ NÂNG CẤP LÊN GHẾ VIP</div>
                  <p style={{ fontSize: 'clamp(11px, 3vw, 13px)', margin: 0, color: 'rgba(255,255,255,0.8)' }}>Thêm bắp rang và nước ngọt với giá <strong style={{ color: '#eab308' }}>{formatVND(85000)}</strong></p>
                </div>
              </div>

              <button onClick={handleFoodDrink} style={{ ...glassStyle, padding: '14px 16px', borderRadius: '16px', color: colors.onSurface, fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer', fontSize: '14px' }}>
                🍿 CHỌN COMBO & ĐỒ ĂN
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${colors.border}`, paddingTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: `${colors.onSurfaceVariant}80`, letterSpacing: '1px' }}>Tổng tiền</div>
                  <div style={{ fontSize: 'clamp(32px, 8vw, 48px)', fontWeight: '900', color: colors.primaryContainer, lineHeight: 1.2 }}>
                    {formatVND(total)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <button
                  onClick={handleConfirm}
                  disabled={!hasTickets}
                  style={{
                    background: hasTickets ? colors.primaryContainer : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    letterSpacing: '1.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    cursor: hasTickets ? 'pointer' : 'not-allowed',
                    boxShadow: hasTickets ? '0 8px 30px rgba(229,9,20,0.4)' : 'none',
                    opacity: hasTickets ? 1 : 0.5,
                  }}
                >
                  Xác nhận lựa chọn <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </button>
                <div style={{ fontSize: '9px', fontWeight: 'bold', textAlign: 'center', letterSpacing: '2px', color: `${colors.onSurfaceVariant}4d` }}>THANH TOÁN BẢO MẬT BỞI CINEMAPAY</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${colors.border}`, padding: '40px 20px', textAlign: 'center', marginTop: '48px' }}>
        <div style={{ fontSize: '11px', color: `${colors.onSurfaceVariant}4d`, letterSpacing: '1px' }}>© 2024 KSTAR Cinema. Bảo lưu mọi quyền.</div>
      </footer>

      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        button { transition: all 0.2s; }
        button:hover:not(:disabled) { transform: scale(1.02); }
        button:active:not(:disabled) { transform: scale(0.98); }
        @media (max-width: 1200px) {
          .two-column-layout { flex-direction: column !important; align-items: center !important; }
          .two-column-layout aside { width: 100% !important; max-width: 500px !important; position: static !important; margin-top: 32px; }
        }
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        div::-webkit-scrollbar-thumb { background: rgba(229,9,20,0.5); border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default ChonGhe;