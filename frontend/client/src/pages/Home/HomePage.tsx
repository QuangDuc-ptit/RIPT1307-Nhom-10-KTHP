import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './HomePage.css';
import { Layout, Button, Input, Select, DatePicker, Row, Col, Badge, Avatar, Space, Typography, Divider, Form, Menu, Card, Modal } from 'antd';
import { SearchOutlined, BellOutlined, StarFilled, PlayCircleOutlined, LeftOutlined, RightOutlined, GlobalOutlined, VideoCameraOutlined, ShareAltOutlined, ArrowRightOutlined, CalendarOutlined, CloseOutlined } from '@ant-design/icons';

// 🟢 IMPORT HÀM TỪ API CHUNG
import { getNowShowingMovies, getComingSoonMovies, Movie } from '@/api/movies';

const { Header, Footer, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Bảng màu Dark Mode đồng bộ toàn trang
const colors = { surface: '#151113', primaryRed: '#E50914', onSurface: '#ffffff', onSurfaceVariant: '#a3989c', surfaceVariant: '#2d2025', primary: '#ff1e00', bgCard: '#1a1316' };

export default function HomePage() {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const [nowShowingMovies, setNowShowingMovies] = useState<Movie[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([]);

  // STATE CHO SLIDER HERO & MUA VÉ NHANH
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quickBookMovieId, setQuickBookMovieId] = useState<number | string>('');

  useEffect(() => {
    const loadData = async () => {
      const nowShowing = await getNowShowingMovies();
      const comingSoon = await getComingSoonMovies();
      setNowShowingMovies(nowShowing);
      setComingSoonMovies(comingSoon);
      if (nowShowing.length > 0) {
        setQuickBookMovieId(nowShowing[0].id);
      }
    };
    loadData();
  }, []);

  // STATE QUẢN LÝ POPUP PHIM SẮP CHIẾU
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedComingSoon, setSelectedComingSoon] = useState<any>(null);

  // Hiệu ứng tự động chuyển slide banner đầu trang
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= nowShowingMovies.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [nowShowingMovies.length]);

  // Logic cho thanh trượt "Phim đang chiếu"
  useEffect(() => {
    const slider = sliderRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    if (!slider || !prevBtn || !nextBtn) return;

    const scrollAmount = 300;
    const updateButtons = () => {
      prevBtn.style.visibility = slider.scrollLeft <= 0 ? 'hidden' : 'visible';
      nextBtn.style.visibility = slider.scrollLeft + slider.clientWidth >= slider.scrollWidth ? 'hidden' : 'visible';
    };

    const handlePrev = () => slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    const handleNext = () => slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    prevBtn.addEventListener('click', handlePrev);
    nextBtn.addEventListener('click', handleNext);
    slider.addEventListener('scroll', updateButtons);
    updateButtons();

    return () => {
      prevBtn.removeEventListener('click', handlePrev);
      nextBtn.removeEventListener('click', handleNext);
      slider.removeEventListener('scroll', updateButtons);
    };
  }, []);

  const renderBookingField = (label: string, children: React.ReactNode) => (
    <Col xs={24} md={6}>
      <Text style={{ color: colors.onSurfaceVariant, display: 'block', marginBottom: 8, fontWeight: 'bold' }}>{label}</Text>
      {children}
    </Col>
  );

  const handleBookMovie = (movieId: number | string) => {
    navigate(`/movie/${movieId}`);
  };

  const handleComingSoonDetail = (movie: any) => {
    setSelectedComingSoon(movie);
    setIsModalVisible(true);
  };

  const featuredMovie = nowShowingMovies[currentSlide] || nowShowingMovies[0];

  return (
    <Layout style={{ background: colors.surface, minHeight: '100vh' }}>
      <Helmet><title>KSTAR Cinema - Trang chủ</title></Helmet>

      {/* Header */}
      <Header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(21, 17, 19, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '1rem 48px', height: 'auto', borderBottom: `1px solid ${colors.surfaceVariant}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <Title level={3} style={{ margin: 0, color: colors.primaryRed, cursor: 'pointer', fontWeight: 900 }} onClick={() => navigate('/')}>KSTAR</Title>
            <Menu mode="horizontal" selectedKeys={['home']} style={{ background: 'transparent', border: 'none', minWidth: 360, color: 'white' }} items={[
              { key: 'home', label: <span style={{ fontWeight: 'bold', color: 'white' }} onClick={() => navigate('/')}>Trang chủ</span> },
              { key: 'movies', label: <span style={{ fontWeight: 'bold', color: 'white' }} onClick={() => navigate('/movies')}>Phim</span> },
              { key: 'membership', label: <span style={{ fontWeight: 'bold', color: 'white' }}>Membership</span> }
            ]} />
          </div>
          <Space size="large">
            <Button type="primary" style={{ background: colors.primaryRed, border: 'none', borderRadius: 20, fontWeight: 'bold' }} onClick={() => navigate('/auth/login')}>Đăng nhập</Button>
          </Space>
        </div>
      </Header>

      {/* Hero Section Động */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', marginTop: '-80px' }}>
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundImage: `url('${featuredMovie?.coverImage}')`, 
          backgroundSize: 'cover', backgroundPosition: 'center top', 
          transition: 'background-image 1s ease-in-out',
          transform: 'scale(1.02)' 
        }} />
        
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(21,17,19,0.95) 0%, rgba(21,17,19,0.4) 50%, transparent 100%), linear-gradient(to top, #151113 0%, rgba(21,17,19,0.4) 30%, transparent 100%)' }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 650, marginTop: '5vh' }}>
            <div style={{ display: 'inline-block', background: colors.primaryRed, color: 'white', padding: '6px 20px', borderRadius: 40, fontWeight: 800, marginBottom: 20, fontSize: '13px' }}>
              NOW SHOWING
            </div>
            <Title level={1} style={{ color: 'white', fontSize: 72, margin: '0 0 16px 0', fontWeight: 900, textTransform: 'uppercase', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {featuredMovie?.title}
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, margin: '0 0 40px 0', lineHeight: 1.6 }}>
              {featuredMovie?.description}
            </Paragraph>
            
            {/* 🚀 KHU VỰC NÚT BẤM ĐÃ ĐƯỢC PHỤC HỒI ĐỦ 2 NÚT */}
            <Space size="middle">
              <Button type="primary" size="large" icon={<PlayCircleOutlined />} style={{ background: colors.primaryRed, border: 'none', borderRadius: 48, padding: '0 40px', height: 56, fontWeight: 'bold' }} onClick={() => handleBookMovie(featuredMovie?.id)}>
                Đặt vé
              </Button>
              {/* 🟢 NÚT XEM TRAILER ĐÃ QUAY TRỞ LẠI */}
              <Button 
                size="large" 
                icon={<PlayCircleOutlined />} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', // Hiệu ứng kính mờ
                  backdropFilter: 'blur(12px)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  borderRadius: 48, 
                  color: 'white', 
                  padding: '0 40px', 
                  height: 56, 
                  fontSize: '16px', 
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)', 
                  transition: 'all 0.3s ease' 
                }}
              >
                Xem Trailer
              </Button>
            </Space>
            
            <div style={{ marginTop: 30, display: 'flex', gap: 10 }}>
              {nowShowingMovies.map((_, index) => (
                <div key={index} onClick={() => setCurrentSlide(index)} style={{ width: currentSlide === index ? 30 : 10, height: 10, borderRadius: 5, background: currentSlide === index ? colors.primaryRed : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Bar */}
      <div style={{ position: 'relative', zIndex: 30, marginTop: -60, padding: '0 48px', maxWidth: 1280, margin: '0 auto' }}>
        <Card style={{ padding: 20, borderRadius: 24, background: '#1d171a', border: `1px solid ${colors.surfaceVariant}` }} bordered={false}>
          <Row gutter={[24, 16]} align="bottom">
            {renderBookingField('Chọn Phim', (
              <Select placeholder="Chọn phim" defaultValue={nowShowingMovies[0]?.id} onChange={(val) => setQuickBookMovieId(val)} style={{ width: '100%' }}>
                {nowShowingMovies.map(movie => <Option key={movie.id} value={movie.id}>{movie.title}</Option>)}
              </Select>
            ))}
            {renderBookingField('Ngày Chiếu', <DatePicker placeholder="Chọn ngày" style={{ width: '100%' }} />)}
            {renderBookingField('Chọn Rạp', <Select placeholder="Chọn rạp" defaultValue="nguyenDu" style={{ width: '100%' }}><Option value="nguyenDu">KSTAR Nguyễn Du</Option></Select>)}
            <Col xs={24} md={6}>
              <Button type="primary" block style={{ background: colors.primaryRed, border: 'none', height: 48, borderRadius: 40, fontWeight: 'bold' }} onClick={() => handleBookMovie(quickBookMovieId)}>Mua vé nhanh</Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Phim Đang Chiếu */}
      <Content style={{ padding: '80px 48px 0', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <Title level={2} style={{ color: colors.onSurface, fontWeight: 800, marginBottom: 40, borderLeft: `5px solid ${colors.primaryRed}`, paddingLeft: 16 }}>Phim Đang Chiếu</Title>
        <div style={{ position: 'relative' }}>
          <button ref={prevBtnRef} className="carousel-nav-btn prev-btn"><LeftOutlined /></button>
          <button ref={nextBtnRef} className="carousel-nav-btn next-btn"><RightOutlined /></button>
          <div ref={sliderRef} className="movie-slider" style={{ display: 'flex', overflowX: 'auto', gap: 28, paddingBottom: 20, scrollBehavior: 'smooth' }}>
            {nowShowingMovies.map((movie: any) => (
              <div key={movie.id} className="movie-card-homepage" onClick={() => handleBookMovie(movie.id)} style={{ flex: '0 0 auto', width: 220, cursor: 'pointer' }}>
                <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', height: 330 }}>
                  <img src={movie.poster?.includes('/') ? movie.poster : `/movies/${movie.poster}`} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {movie.rating > 0 && (
                    <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.8)', padding: '4px 8px', borderRadius: 8, color: '#fadb14', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarFilled /> {movie.rating}
                    </div>
                  )}
                </div>
                <h3 style={{ color: 'white', margin: '16px 0 4px', fontWeight: 'bold', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h3>
                <p style={{ color: colors.onSurfaceVariant, margin: 0, fontSize: 13 }}>{movie.genre}</p>
              </div>
            ))}
          </div>
        </div>
      </Content>

      {/* Sắp khởi chiếu */}
      <Content style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <Title level={2} style={{ color: colors.onSurface, fontWeight: 800, marginBottom: 40, borderLeft: `5px solid ${colors.primaryRed}`, paddingLeft: 16 }}>Sắp khởi chiếu</Title>
        <Row gutter={[24, 24]}>
          {comingSoonMovies.map((movie) => (
            <Col xs={24} sm={12} md={6} key={movie.id}>
              <div style={{ background: colors.surfaceVariant, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s' }} onClick={() => handleComingSoonDetail(movie)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ position: 'relative' }}>
                  <img src={movie.poster?.includes('/') ? movie.poster : `/banners/${movie.poster}`} alt={movie.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  {movie.date && <div style={{ position: 'absolute', top: 12, left: 12, background: colors.primaryRed, color: 'white', padding: '4px 12px', borderRadius: 20, fontWeight: 'bold', fontSize: 12 }}>{movie.date}</div>}
                </div>
                <div style={{ padding: 20 }}>
                  <h4 style={{ color: 'white', fontWeight: 'bold', margin: '0 0 8px', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</h4>
                  <p style={{ color: colors.onSurfaceVariant, fontSize: 13, margin: '0 0 16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.description}</p>
                  <span style={{ color: colors.primaryRed, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>Thông tin chi tiết <ArrowRightOutlined /></span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Content>

      {/* 🚀 MODAL TÔNG MÀU TỐI (DARK MODE) ĐÃ ĐƯỢC GIỮ NGUYÊN */}
      <Modal
        title={null}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
        centered
        closeIcon={<CloseOutlined style={{ color: '#fff', fontSize: '18px', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%' }} />}
        styles={{
          content: { 
            padding: 0, 
            overflow: 'hidden', 
            borderRadius: 16, 
            backgroundColor: colors.bgCard, // Màu xám đen
            border: `1px solid ${colors.surfaceVariant}` 
          }
        }}
      >
        {selectedComingSoon && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', padding: '40px', gap: '30px' }}>
               <div style={{ width: '260px', flexShrink: 0, position: 'relative' }}>
                  <img src={selectedComingSoon.poster?.includes('/') ? selectedComingSoon.poster : `/banners/${selectedComingSoon.poster}`} alt="poster" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', border: `1px solid ${colors.surfaceVariant}` }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, background: '#2196f3', color: 'white', padding: '2px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>
                    {selectedComingSoon.age || 'T13'}
                  </div>
               </div>
               <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 16px 0', color: colors.onSurface, lineHeight: 1.3 }}>
                    {selectedComingSoon.title}
                  </h2>
                  <p style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '24px', color: colors.onSurfaceVariant }}>
                    {selectedComingSoon.description}
                  </p>
                  <table style={{ width: '100%', fontSize: '15px', color: colors.onSurfaceVariant }}>
                    <tbody>
                      <tr><td style={{ width: '140px', paddingBottom: '10px', fontWeight: 600, color: '#d1c4c9' }}>Đạo diễn:</td><td style={{ paddingBottom: '10px' }}>Đang cập nhật</td></tr>
                      <tr><td style={{ paddingBottom: '10px', fontWeight: 600, color: '#d1c4c9' }}>Diễn viên:</td><td style={{ paddingBottom: '10px' }}>Đang cập nhật</td></tr>
                      <tr><td style={{ paddingBottom: '10px', fontWeight: 600, color: '#d1c4c9' }}>Thể loại:</td><td style={{ paddingBottom: '10px' }}>{selectedComingSoon.genre}</td></tr>
                      <tr><td style={{ paddingBottom: '10px', fontWeight: 600, color: '#d1c4c9' }}>Thời lượng:</td><td style={{ paddingBottom: '10px' }}>{selectedComingSoon.duration}</td></tr>
                      <tr><td style={{ paddingBottom: '10px', fontWeight: 600, color: '#d1c4c9' }}>Ngôn ngữ:</td><td style={{ paddingBottom: '10px' }}>Tiếng Anh - Phụ đề Tiếng Việt</td></tr>
                      <tr><td style={{ paddingBottom: '10px', fontWeight: 600, color: '#d1c4c9' }}>Khởi chiếu:</td><td style={{ paddingBottom: '10px', color: colors.primaryRed, fontWeight: 'bold' }}>{selectedComingSoon.date}/2026</td></tr>
                    </tbody>
                  </table>
               </div>
            </div>
            <div style={{ backgroundColor: colors.surfaceVariant, padding: '16px', textAlign: 'center', borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
              <h3 style={{ color: '#ffffff', margin: 0, fontWeight: 800, fontSize: '20px', letterSpacing: '2px' }}>TRAILER</h3>
            </div>
            <div style={{ backgroundColor: '#0a0809', padding: '40px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '720px', aspectRatio: '16/9', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: `1px solid ${colors.surfaceVariant}`, position: 'relative', overflow: 'hidden' }}>
                <img src={selectedComingSoon.coverImage} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                <PlayCircleOutlined style={{ fontSize: '64px', color: colors.primaryRed, cursor: 'pointer', zIndex: 2, transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <Footer style={{ background: '#0a0809', borderTop: `1px solid ${colors.surfaceVariant}`, padding: '56px 48px 32px' }}>
         <div style={{ maxWidth: 1280, margin: '0 auto', textAlign: 'center', color: colors.onSurfaceVariant }}>
            <Title level={4} style={{ color: colors.primaryRed, fontWeight: 900, marginBottom: 12 }}>KSTAR CINEMA</Title>
            <p>© 2024 KSTAR Cinema. All Rights Reserved.</p>
         </div>
      </Footer>
    </Layout>
  );
}