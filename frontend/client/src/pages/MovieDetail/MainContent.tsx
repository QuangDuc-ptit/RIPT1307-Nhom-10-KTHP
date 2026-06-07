import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Button, Tag, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { bookingApi, Showtime } from '@/api/booking';

interface Props {
  movie: any; // Ép kiểu any để bypass lỗi type
}

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
    <div style={{ width: '24px', height: '4px', backgroundColor: '#e42755', borderRadius: '2px' }} />
    <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{title}</h2>
  </div>
);

const MainContent: React.FC<Props> = ({ movie }) => {
  const colors = { bgCard: '#1a1316', border: '#2d2025', primary: '#e42755', textDim: '#a3989c' };
  const navigate = useNavigate();
  const user = useAuthStore((s: any) => s.user);
  const initialized = useAuthStore((s: any) => s.initialized);

  const [scheduleDays, setScheduleDays] = useState<{ id: string; label: string; dateStr: string }[]>([]);
  const [activeDate, setActiveDate] = useState<string>('');
  
  // Trạng thái lưu suất chiếu thật từ API
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoadingShowtimes, setIsLoadingShowtimes] = useState<boolean>(false);

  useEffect(() => {
    const days = [];
    const today = new Date();
    // Reset thời gian về đầu ngày để tránh lỗi so sánh
    today.setHours(0, 0, 0, 0);
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateId = `${yyyy}-${mm}-${dd}`;
      const dateStr = `${dd}/${mm}`;
      const label = i === 0 ? 'Hnay' : dayNames[d.getDay()];
      
      days.push({ id: dateId, label, dateStr });
    }
    
    setScheduleDays(days);
    if (days.length > 0) {
      setActiveDate(days[0].id);
    }
  }, []);

  // Fetch showtimes khi load movie
  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie || !movie.id) return;
      setIsLoadingShowtimes(true);
      try {
        const data = await bookingApi.getShowtimesByMovie(movie.id.toString());
        setShowtimes(data || []);
      } catch (error) {
        console.error('Failed to fetch showtimes:', error);
        setShowtimes([]);
      } finally {
        setIsLoadingShowtimes(false);
      }
    };
    fetchShowtimes();
  }, [movie]);

  const handleSelectSeat = (cinema: any, room: any, showtime: Showtime) => {
    if (!initialized) {
      message.warning('Hệ thống đang khởi tạo, vui lòng chờ...');
      return;
    }
    if (!user) {
      message.error('Vui lòng đăng nhập để chọn ghế');
      navigate('/auth/login', { state: { from: `/movie/${movie.id}` } });
      return;
    }
    navigate('/chon-ghe', {
      state: {
        movie: movie,
        cinema: cinema,
        room: room,
        showtime: showtime,
      },
    });
  };

  const handleTabChange = (key: string) => {
    if (key === 'next_week') {
      message.info('Lịch chiếu cho tuần sau đang được cập nhật. Vui lòng quay lại sau!');
      return; 
    }
    setActiveDate(key);
  };

  const tabItems = scheduleDays.map((day) => {
    const isActive = activeDate === day.id;
    return {
      key: day.id,
      label: (
        <span style={{ 
          padding: isActive ? '8px 16px' : '0', 
          backgroundColor: isActive ? colors.primary : 'transparent', 
          borderRadius: '20px', 
          color: isActive ? '#fff' : colors.textDim, 
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}>
          {day.label}, {day.dateStr}
        </span>
      ),
      children: null,
    };
  });

  tabItems.push({
    key: 'next_week',
    label: <span style={{ color: colors.textDim, fontWeight: 'bold' }}>Tuần sau &rarr;</span>,
    children: null,
  });

  // Gom nhóm dữ liệu suất chiếu theo Cinema -> Room
  const groupedShowtimes = useMemo(() => {
    if (!activeDate || showtimes.length === 0) return [];
    
    // Lọc ra các suất chiếu trong ngày đang chọn
    const showtimesForDate = showtimes.filter(st => {
      const stDate = new Date(st.startTime);
      const yyyy = stDate.getFullYear();
      const mm = String(stDate.getMonth() + 1).padStart(2, '0');
      const dd = String(stDate.getDate()).padStart(2, '0');
      const stDateId = `${yyyy}-${mm}-${dd}`;
      return stDateId === activeDate;
    });

    // Group by Cinema ID
    const cinemaMap = new Map<string, any>();
    
    showtimesForDate.forEach(st => {
      const cinemaId = st.room?.cinema?.id;
      if (!cinemaId) return;
      
      if (!cinemaMap.has(cinemaId)) {
        cinemaMap.set(cinemaId, {
          id: cinemaId,
          name: st.room.cinema.name,
          address: st.room.cinema.address,
          distance: 'CÁCH 2.0 KM', // Vẫn có thể hardcode khoảng cách hoặc tính toán
          roomsMap: new Map<string, any>()
        });
      }
      
      const cinemaObj = cinemaMap.get(cinemaId);
      const roomId = st.roomId;
      
      if (!cinemaObj.roomsMap.has(roomId)) {
        cinemaObj.roomsMap.set(roomId, {
          id: roomId,
          roomName: st.room.name,
          type: '2D', // Tạm thời dùng 2D, có thể lấy từ db
          originalRoom: st.room,
          times: []
        });
      }
      
      const roomObj = cinemaObj.roomsMap.get(roomId);
      const startTimeObj = new Date(st.startTime);
      const hours = String(startTimeObj.getHours()).padStart(2, '0');
      const minutes = String(startTimeObj.getMinutes()).padStart(2, '0');
      
      roomObj.times.push({
        ...st,
        timeString: `${hours}:${minutes}`
      });
    });

    // Chuyển Map thành mảng để render
    const result = Array.from(cinemaMap.values()).map(cinema => ({
      ...cinema,
      rooms: Array.from(cinema.roomsMap.values())
    }));

    return result;
  }, [showtimes, activeDate]);

  return (
    <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Tóm tắt nội dung */}
      <div>
        <SectionTitle title="Tóm tắt nội dung" />
        <p style={{ color: colors.textDim, fontSize: '15px', lineHeight: '1.8' }}>{movie.description}</p>
      </div>

      {/* Diễn viên & Đội ngũ */}
      <div>
        <SectionTitle title="Diễn viên & Đội ngũ sản xuất" />
        <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
          {movie.cast?.map((person: any) => (
            <div key={person.id} style={{ width: '120px', flexShrink: 0 }}>
              <div style={{ height: '160px', backgroundColor: '#e0c8b8', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                <img src={person.avatar} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{person.name}</div>
              <div style={{ color: colors.textDim, fontSize: '12px', textTransform: 'uppercase' }}>{person.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suất chiếu */}
      <div style={{ backgroundColor: colors.bgCard, borderRadius: '16px', border: `1px solid ${colors.border}`, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <ClockCircleOutlined style={{ color: colors.primary, fontSize: '20px' }} />
          <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Suất chiếu</h2>
        </div>

        <Tabs
          activeKey={activeDate}
          onChange={handleTabChange}
          tabBarStyle={{ borderBottom: `1px solid ${colors.border}`, marginBottom: '24px' }}
          items={tabItems}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isLoadingShowtimes ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textDim }}>
              Đang tải lịch chiếu...
            </div>
          ) : groupedShowtimes.length > 0 ? (
            groupedShowtimes.map((cinema: any) => (
              <div key={cinema.id} style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{cinema.name}</h3>
                    <div style={{ color: colors.textDim, fontSize: '13px' }}>📍 {cinema.address}</div>
                  </div>
                  <Tag style={{ backgroundColor: 'rgba(228, 39, 85, 0.1)', color: colors.primary, border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>{cinema.distance}</Tag>
                </div>

                {cinema.rooms?.map((room: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '120px' }}>
                      <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>{room.type}</div>
                      <div style={{ color: colors.textDim, fontSize: '12px' }}>{room.roomName}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {room.times?.map((t: any, i: number) => (
                        <Button 
                          key={i} 
                          onClick={() => handleSelectSeat(cinema, room.originalRoom, t)}
                          style={{ backgroundColor: 'transparent', borderColor: colors.primary, color: '#ffffff', borderRadius: '8px', cursor: 'pointer' }}
                        >
                          {t.timeString}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textDim }}>
              Hiện tại chưa có lịch chiếu cho ngày này.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainContent;