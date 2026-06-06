import React, { useState, useEffect } from 'react';
import { Tabs, Button, Tag, message } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

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

  // Hàm tạo dữ liệu động khác nhau cho từng ngày trong tuần
  const generateDynamicShowtimes = (dateIndex: number) => {
    switch (dateIndex) {
      case 0: // Hôm nay
        return [
          {
            id: 'c1', name: 'Grand Horizon Cinema', distance: 'CÁCH 4.2 KM', address: 'Downtown District, 5th Ave',
            rooms: [
              { type: 'IMAX 3D', roomName: 'Phòng 01', times: ['14:30', '17:45', '21:00'] },
              { type: 'TIÊU CHUẨN', roomName: 'Phòng 04', times: ['11:00', '15:15'] }
            ]
          },
          {
            id: 'c2', name: 'Starlight Cinema', distance: 'CÁCH 8.7 KM', address: '9 HANOI Center',
            rooms: [{ type: 'LUXE', roomName: 'Phòng 02', times: ['19:00', '22:30'] }]
          }
        ];
      case 1: // Ngày mai
        return [
          {
            id: 'c3', name: 'CGV Vincom Metropolis', distance: 'CÁCH 2.1 KM', address: '29 Liễu Giai, Ba Đình',
            rooms: [
              { type: '4DX', roomName: 'Phòng 05', times: ['09:00', '13:30'] },
              { type: 'TIÊU CHUẨN', roomName: 'Phòng 02', times: ['18:00', '20:15', '23:00'] }
            ]
          }
        ];
      case 2: // Ngày kia
        return [
          {
            id: 'c4', name: 'Lotte Cinema', distance: 'CÁCH 5.0 KM', address: '54 Liễu Giai, Ba Đình',
            rooms: [{ type: 'TIÊU CHUẨN', roomName: 'Phòng 01', times: ['10:00', '14:00', '16:45'] }]
          },
          {
            id: 'c1', name: 'Grand Horizon Cinema', distance: 'CÁCH 4.2 KM', address: 'Downtown District, 5th Ave',
            rooms: [{ type: 'IMAX 3D', roomName: 'Phòng 01', times: ['20:00'] }] 
          }
        ];
      case 3: // 3 ngày sau
        return [
          {
            id: 'c5', name: 'BHD Star Discovery', distance: 'CÁCH 6.5 KM', address: '302 Cầu Giấy',
            rooms: [{ type: 'SWEETBOX', roomName: 'Phòng Couple', times: ['19:30', '21:45'] }]
          }
        ];
      case 4: // 4 ngày sau (Mô phỏng trống lịch)
        return []; 
      default: // Cuối tuần
        return [
          {
            id: 'c1', name: 'Grand Horizon Cinema', distance: 'CÁCH 4.2 KM', address: 'Downtown District, 5th Ave',
            rooms: [
              { type: 'IMAX 3D', roomName: 'Phòng 01', times: ['08:00', '11:00', '14:00', '17:00', '20:00', '23:00'] }
            ]
          }
        ];
    }
  };

  useEffect(() => {
    const days = [];
    const today = new Date();
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const dateId = d.toISOString().split('T')[0];
      const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = i === 0 ? 'Hnay' : dayNames[d.getDay()];
      
      days.push({ id: dateId, label, dateStr });
    }
    
    setScheduleDays(days);
    if (days.length > 0) {
      setActiveDate(days[0].id);
    }
  }, []);

  const handleSelectSeat = (cinema: any, room: any, showtime: any) => {
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
          {(() => {
            const selectedIndex = scheduleDays.findIndex(d => d.id === activeDate);
            const dynamicCinemas = selectedIndex !== -1 ? generateDynamicShowtimes(selectedIndex) : [];

            if (dynamicCinemas.length > 0) {
              return dynamicCinemas.map((cinema: any) => (
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
                          <Button key={i} style={{ backgroundColor: 'transparent', borderColor: colors.border, color: '#ffffff', borderRadius: '8px' }}>
                            {t.time || t}
                          </Button>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleSelectSeat(cinema, room, room.times?.[0])}
                        type="primary"
                        style={{ backgroundColor: 'rgba(228, 39, 85, 0.1)', color: colors.primary, border: `1px solid ${colors.border}`, borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}
                      >
                        CHỌN GHẾ
                      </Button>
                    </div>
                  ))}
                </div>
              ));
            } else {
              return (
                <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textDim }}>
                  Hiện tại chưa có lịch chiếu cho ngày này.
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default MainContent;