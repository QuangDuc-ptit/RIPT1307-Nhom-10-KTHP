import React from 'react';
import HeroBanner from './HeroBanner';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import { MovieDetailData } from '@/types/movie';
import Footer from '@/components/layout/Footer';

const MovieDetailPage: React.FC = () => {
  // Mock Data chuẩn hóa theo thiết kế
  const mockData: MovieDetailData = {
    id: 'm1',
    title: 'NABULA ASCENT',
    tagline: 'ĐANG CHIẾU TẠI RẠP',
    metaInfo: 'Khoa học viễn tưởng • 2 giờ 45 phút • 2024',
    rating: 4.9,
    description: 'Năm 2184, Trái Đất chỉ còn là ký ức xa xôi và loài người đã tìm thấy nơi trú ẩn trong hệ sao Aethelgard. Nhưng khi hai mặt trời của hệ này bắt đầu sụp đổ, Chỉ huy Elena Vance được giao một nhiệm vụ tuyệt vọng: điều khiển con tàu "Nebula" đi qua một hố sâu không gian có nguồn gốc bí ẩn. Những gì cô phát hiện ở phía bên kia sẽ thách thức mọi hiểu biết của cô về thời gian, gia đình và sự sống còn của nhân loại.',
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop',
    cast: [
      { id: '1', name: 'David Sterling', role: 'CHỈ HUY VANCE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
      { id: '2', name: 'Sarah Jenkins', role: 'TIẾN SĨ ARIS THORNE', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      { id: '3', name: 'Marcus Thorne', role: 'KỸ SƯ MÁY', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
      { id: '4', name: 'Ava Duvernay', role: 'ĐẠO DIỄN', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava' },
    ],
    cinemas: [
      {
        id: 'c1', name: 'Grand Horizon Cinema', address: 'Downtown District, 5th Ave', distance: 'CÁCH 4.2 KM',
        rooms: [
          { type: 'IMAX 3D', roomName: 'Phòng 01', times: [{ time: '14:30', status: 'available' }, { time: '17:45', status: 'available' }, { time: '21:00', status: 'available' }] },
          { type: 'TIÊU CHUẨN', roomName: 'Phòng 04', times: [{ time: '11:00', status: 'available' }, { time: '15:15', status: 'available' }, { time: '20:30', status: 'available' }] }
        ]
      },
      {
        id: 'c2', name: 'Starlight Cinema', address: '9 HANOI Center', distance: 'CÁCH 8.7 KM',
        rooms: [
          { type: 'LUXE', roomName: 'Phòng 02', times: [{ time: '19:00', status: 'available' }, { time: '22:30', status: 'available' }] }
        ]
      }
    ],
    reviews: {
      average: 4.9, totalVotes: '12.4k',
      breakdown: [ { star: 5, percentage: 85 }, { star: 4, percentage: 10 }, { star: 3, percentage: 3 }, { star: 2, percentage: 1 }, { star: 1, percentage: 1 } ]
    },
    related: [
      { id: 'r1', title: 'Making of: The Black Hole', meta: '0:12 • FEATURETTE', thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=500&auto=format&fit=crop' },
      { id: 'r2', title: 'The Music of Nebula Ascent', meta: '0:45 • SOUNDTRACK', thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=500&auto=format&fit=crop' }
    ]
  };

  return (
    <div style={{ backgroundColor: '#151113', minHeight: '100vh', paddingBottom: '60px', fontFamily: 'sans-serif' }}>
      <HeroBanner movie={mockData} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <MainContent movie={mockData} />
        <Sidebar movie={mockData} />
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;