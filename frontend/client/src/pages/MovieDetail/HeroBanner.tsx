import React from 'react';
import { Button, Tag } from 'antd';
import { PlayCircleFilled, TagsOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MovieDetailData } from '../../types/movie';

interface Props {
  movie: MovieDetailData;
}

const HeroBanner: React.FC<Props> = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      position: 'relative',
      height: '500px',
      backgroundImage: `linear-gradient(to bottom, rgba(21, 17, 19, 0.2), #151113), url(${movie.coverImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 5%'
    }}>
      {/* Nút Quay lại (Góc trên trái) */}
      <Button 
        type="text"
        icon={<LeftOutlined style={{ fontSize: '20px' }} />}
        onClick={() => navigate(-1)}
        style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          color: '#ffffff',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(5px)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          border: 'none'
        }}
      />

      {/* Nút Play ở giữa */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
        <PlayCircleFilled style={{ fontSize: '64px', color: '#e42755', opacity: 0.9 }} />
      </div>

      {/* Thông tin phim (Góc trái dưới) */}
      <div style={{ position: 'absolute', bottom: '40px', left: '5%', right: '5%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <Tag color="#e42755" style={{ border: 'none', fontWeight: 'bold', padding: '4px 12px', borderRadius: '4px' }}>
              {movie.tagline}
            </Tag>
            <span style={{ color: '#a3989c', marginLeft: '12px', fontSize: '14px' }}>{movie.metaInfo}</span>
          </div>
          
          <h1 style={{ color: '#ffffff', fontSize: '48px', fontWeight: '900', margin: '0 0 16px 0', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {movie.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: '#e42755', fontSize: '24px', fontWeight: 'bold' }}>
              {movie.rating} <span style={{ fontSize: '12px', color: '#a3989c', fontWeight: 'normal' }}>/ 5 KSTAR</span>
            </div>
            <p style={{ color: '#a3989c', maxWidth: '400px', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
              {movie.description?.substring(0, 100)}...
            </p>
          </div>
        </div>

        {/* Nút đặt vé */}
        <Button 
          type="primary" 
          icon={<TagsOutlined />} 
          size="large"
          style={{ backgroundColor: '#e42755', border: 'none', borderRadius: '30px', height: '50px', padding: '0 40px', fontWeight: 'bold', fontSize: '16px' }}
        >
          Đặt vé
        </Button>
      </div>
    </div>
  );
};

export default HeroBanner;