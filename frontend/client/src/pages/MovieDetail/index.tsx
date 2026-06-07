import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HeroBanner from './HeroBanner';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import Footer from '@/components/layout/Footer';

// Import kho dữ liệu chung
import { getMovieById, Movie } from '@/api/movies';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isVisible, setIsVisible] = useState(false);
  const [rawMovie, setRawMovie] = useState<Movie | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsVisible(false);
    
    const fetchDetail = async () => {
      const data = await getMovieById(id || '2');
      setRawMovie(data);
      setTimeout(() => setIsVisible(true), 50);
    };
    fetchDetail();
  }, [id]);

  // Chuẩn hóa dữ liệu để khớp với MovieDetailData
  const currentMovie = rawMovie ? {
    ...rawMovie,
    // Ghép các trường từ Trang chủ thành metaInfo cho trang Chi tiết
    metaInfo: `${rawMovie.genre} • ${rawMovie.duration} • 2024`,
    // Đảm bảo có cinemas để MainContent không bị crash
    cinemas: [] 
  } : {
    id: id,
    title: `PHIM ĐANG CẬP NHẬT (ID: ${id})`,
    metaInfo: 'Thông tin đang cập nhật',
    description: 'Nội dung chi tiết đang được hệ thống KSTAR cập nhật.',
    coverImage: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2000&auto=format&fit=crop',
    cast: [],
    reviews: { average: 0, totalVotes: '0', breakdown: [] },
    related: [],
    cinemas: []
  };

  return (
    <div style={{ 
      backgroundColor: '#151113', 
      minHeight: '100vh', 
      paddingBottom: '60px', 
      fontFamily: 'sans-serif',
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(15px)', 
      transition: 'opacity 0.6s ease, transform 0.6s ease' 
    }}>
      {/* Ép kiểu 'as any' để bỏ qua kiểm tra nghiêm ngặt của TS cho các component con */}
      <HeroBanner movie={currentMovie as any} />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 5%', display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        <MainContent movie={currentMovie as any} />
        <Sidebar movie={currentMovie as any} />
      </div>
      <Footer />
    </div>
  );
};

export default MovieDetailPage;