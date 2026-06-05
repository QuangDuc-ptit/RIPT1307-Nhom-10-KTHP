import React from 'react';
import { Tabs, Button, Tag, message } from 'antd'; // thêm message để báo lỗi nếu chưa login
import { ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { MovieDetailData } from '@/types/movie';

interface Props {
  movie: MovieDetailData;
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
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);

  const handleSelectSeat = (cinema: any, room: any, showtime: any) => {
    console.log('handleSelectSeat called', { user, initialized, cinema, room, showtime });
    if (!initialized) {
      message.warning('Hệ thống đang khởi tạo, vui lòng chờ...');
      return;
    }
    if (!user) {
      message.error('Vui lòng đăng nhập để chọn ghế');
      // Có thể chuyển hướng sang login
      navigate('/auth/login', { state: { from: `/movie/${movie.id}` } });
      return;
    }
    // Nếu đã login, điều hướng sang chọn ghế
    navigate('/chon-ghe', {
      state: {
        movie: movie,
        cinema: cinema,
        room: room,
        showtime: showtime,
      },
    });
  };

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
          {movie.cast.map(person => (
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
          defaultActiveKey="1"
          tabBarStyle={{ borderBottom: `1px solid ${colors.border}`, marginBottom: '24px' }}
          items={[
            { key: '1', label: <span style={{ padding: '8px 16px', backgroundColor: colors.primary, borderRadius: '20px', color: '#fff', fontWeight: 'bold' }}>Hnay, 24/05</span>, children: null },
            { key: '2', label: <span style={{ color: colors.textDim, fontWeight: 'bold' }}>T7, 25/05</span>, children: null },
            { key: '3', label: <span style={{ color: colors.textDim, fontWeight: 'bold' }}>CN, 26/05</span>, children: null },
          ]}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {movie.cinemas.map(cinema => (
            <div key={cinema.id} style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{cinema.name}</h3>
                  <div style={{ color: colors.textDim, fontSize: '13px' }}>📍 {cinema.address}</div>
                </div>
                <Tag style={{ backgroundColor: 'rgba(228, 39, 85, 0.1)', color: colors.primary, border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>{cinema.distance}</Tag>
              </div>

              {cinema.rooms.map((room, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ width: '120px' }}>
                    <div style={{ color: '#ffffff', fontSize: '13px', fontWeight: 'bold' }}>{room.type}</div>
                    <div style={{ color: colors.textDim, fontSize: '12px' }}>{room.roomName}</div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {room.times.map((t, i) => (
                      <Button key={i} style={{ backgroundColor: 'transparent', borderColor: colors.border, color: '#ffffff', borderRadius: '8px' }}>
                        {t.time}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleSelectSeat(cinema, room, room.times[0])}
                    type="primary"
                    style={{ backgroundColor: 'rgba(228, 39, 85, 0.1)', color: colors.primary, border: `1px solid ${colors.border}`, borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}
                  >
                    CHỌN GHẾ
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainContent;