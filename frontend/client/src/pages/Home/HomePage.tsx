import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getNowShowingMovies, getComingSoonMovies } from '@/api/movies';
import './HomePage.css';
import {
  Layout,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Badge,
  Avatar,
  Space,
  Typography,
  Divider,
  Form,
  Menu,
  Card,
  Carousel, // 🟢 Đã tích hợp Carousel từ Ant Design
} from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  StarFilled,
  PlayCircleOutlined,
  LeftOutlined,
  RightOutlined,
  GlobalOutlined,
  VideoCameraOutlined,
  ShareAltOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const footerCustomerLinks = ['FAQs', 'Terms of Service', 'Privacy Policy', 'Contact Us'];
const footerAboutLinks = ['About Us', 'Careers', 'Membership', 'Cinemas'];

const colors = {
  surface: '#200e0c',
  primaryRed: '#E50914',
  onSurface: '#ffdad5',
  onSurfaceVariant: '#e9bcb6',
  surfaceVariant: '#462f2c',
  primary: '#ff1e00',
};

export default function HomePage() {
  const navigate = useNavigate();

  const headerRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // LẤY DỮ LIỆU TỪ KHO API TỔNG
  const nowShowingMovies = getNowShowingMovies();
  const comingSoonMovies = getComingSoonMovies();

  // State quản lý Chọn phim ở khối "Mua vé nhanh"
  const [quickBookMovieId, setQuickBookMovieId] = useState<number>(nowShowingMovies[0]?.id || 1);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.style.padding = window.scrollY > 50 ? '0.5rem 0' : '1rem 0';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    window.addEventListener('resize', updateButtons);
    updateButtons();

    return () => {
      prevBtn.removeEventListener('click', handlePrev);
      nextBtn.removeEventListener('click', handleNext);
      slider.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, []);

  const menuItems = [
    { key: 'movies', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: '#fff', fontWeight: 600 }}>Movies</span> },
    { key: 'cinemas', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: colors.onSurfaceVariant }}>Cinemas</span> },
    { key: 'offers', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: colors.onSurfaceVariant }}>Offers</span> },
    { key: 'membership', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: colors.onSurfaceVariant }}>Membership</span> },
  ];

  const renderBookingField = (label: string, children: React.ReactNode) => (
    <Col xs={24} md={6}>
      <Text className="quick-book-label">{label}</Text>
      {children}
    </Col>
  );

  // Hàm xử lý đặt vé
  const handleBookMovie = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  // Lấy ra tối đa 5 bộ phim HOT nhất đang chiếu để hiển thị trên Banner lướt
  const heroMovies = nowShowingMovies.slice(0, 5);

  return (
    <Layout style={{ background: colors.surface, minHeight: '100vh' }}>
      <Helmet>
        <title>KSTAR Cinema - Trang chủ</title>
      </Helmet>

      <Header
        ref={headerRef as any}
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(24, 10, 8, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          padding: '1rem 48px', height: 'auto', lineHeight: 'normal', transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <Title level={3} style={{ margin: 0, color: colors.primary, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '28px', textShadow: '0 2px 10px rgba(0,0,0,0.3)', cursor: 'pointer' }} onClick={() => navigate('/')}>
              KSTAR
            </Title>
            <Menu mode="horizontal" selectedKeys={['movies']} style={{ background: 'transparent', border: 'none', minWidth: 360, lineHeight: 'normal' }} items={menuItems} />
          </div>
          
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 40, padding: '6px 20px', width: 260, boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' }}>
              <SearchOutlined style={{ color: colors.onSurfaceVariant, fontSize: 18 }} />
              <Input placeholder="Tìm phim..." bordered={false} style={{ background: 'transparent', color: colors.onSurface, marginLeft: 8 }} />
            </div>
            <Badge dot offset={[2, 0]}>
              <BellOutlined style={{ fontSize: 22, color: colors.onSurfaceVariant, cursor: 'pointer', transition: 'transform 0.3s ease' }} />
            </Badge>
            <Avatar 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ" 
              style={{ border: `2px solid ${colors.primaryRed}`, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', transition: 'transform 0.3s ease' }} 
              onClick={() => navigate('/profile')}
            />
          </Space>
        </div>
      </Header>

      {/* 🚀 LƯỚT HERO SECTION (Carousel tự động chuyển phim) */}
      <div className="hero-carousel-wrapper" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <Carousel autoplay effect="fade" autoplaySpeed={5000} className="hero-carousel">
          {heroMovies.map((movie) => (
            <div key={movie.id}>
              <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
                {/* Background Image của từng phim */}
                <div style={{ 
                  position: 'absolute', inset: 0, 
                  backgroundImage: `url(${movie.poster?.includes('/') ? movie.poster : `/movies/${movie.poster}`})`, 
                  backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.02)'
                }} />
                
                {/* Lớp phủ mờ Gradient để dễ đọc chữ */}
                <div className="hero-gradient" style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, #200e0c 0%, rgba(32,14,12,0.6) 50%, rgba(0,0,0,0.2) 100%)' }} />
                
                {/* Nội dung chữ của phim */}
                <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 140 }}>
                  <div style={{ maxWidth: 620 }}>
                    <div style={{ display: 'inline-block', background: colors.primaryRed, color: 'white', padding: '6px 20px', borderRadius: 40, fontSize: 13, fontWeight: 700, marginBottom: 24, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)' }}>
                      NOW SHOWING
                    </div>
                    <Title level={1} style={{ color: 'white', fontSize: 72, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, textShadow: '0 8px 30px rgba(0,0,0,0.6)', textTransform: 'uppercase' }}>
                      {movie.title}
                    </Title>
                    <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 18, marginTop: 24, lineHeight: 1.6, maxWidth: '90%', textShadow: '0 2px 10px rgba(0,0,0,0.5)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {movie.description || movie.tagline || 'Đang gây bão tại các rạp chiếu trên toàn quốc. Đặt vé ngay hôm nay để không bỏ lỡ!'}
                    </Paragraph>
                    
                    <Space size="middle" style={{ marginTop: 40 }}>
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<PlayCircleOutlined />} 
                        style={{ background: colors.primaryRed, borderColor: colors.primaryRed, borderRadius: 48, fontWeight: 'bold', padding: '0 40px', height: 56, fontSize: '16px', boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)', transition: 'all 0.3s ease' }}
                        onClick={() => handleBookMovie(movie.id)}
                      >
                        Đặt vé ngay
                      </Button>
                      <Button size="large" icon={<PlayCircleOutlined />} style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 48, color: 'white', padding: '0 40px', height: 56, fontSize: '16px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease' }}>
                        Xem Trailer
                      </Button>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Quick Booking Bar */}
      <div style={{ position: 'relative', zIndex: 30, marginTop: -56, padding: '0 48px', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
        <Card className="glass-card" style={{ padding: 20, borderRadius: 24 }} bordered={false}>
          <Row gutter={[24, 16]} align="bottom">
            {renderBookingField('Chọn Phim', (
              <Select className="quick-book-input" placeholder="Chọn phim" defaultValue={nowShowingMovies[0]?.id} onChange={(val) => setQuickBookMovieId(val)}>
                {nowShowingMovies.map(movie => (
                  <Option key={movie.id} value={movie.id}>{movie.title}</Option>
                ))}
              </Select>
            ))}
            {renderBookingField('Ngày Chiếu', (
              <DatePicker className="quick-book-input" placeholder="Chọn ngày" suffixIcon={<CalendarOutlined />} />
            ))}
            {renderBookingField('Chọn Rạp', (
              <Select className="quick-book-input" placeholder="Chọn rạp" defaultValue="nguyenDu">
                <Option value="nguyenDu">KSTAR Nguyễn Du</Option>
                <Option value="hungVuong">KSTAR Hùng Vương</Option>
                <Option value="landmark">KSTAR Landmark</Option>
              </Select>
            ))}
            <Col xs={24} md={6}>
              <Button 
                type="primary" 
                block 
                style={{ background: colors.primaryRed, borderColor: colors.primaryRed, height: 48, fontWeight: 'bold', borderRadius: 40 }}
                onClick={() => handleBookMovie(quickBookMovieId)}
              >
                Mua vé nhanh
              </Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Now Showing Section */}
      <Content style={{ padding: '80px 48px 0', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ 
            color: colors.onSurface, 
            margin: 0, 
            fontWeight: 800,
            position: 'relative',
            paddingLeft: 20,
            letterSpacing: '0.5px'
          }}>
            <span style={{ position: 'absolute', left: 0, top: '10%', height: '80%', width: 5, background: colors.primaryRed, borderRadius: 10 }}></span>
            Phim Đang Chiếu
          </Title>
          
          <Button 
            type="text" 
            className="view-all-btn" 
            style={{ color: colors.onSurfaceVariant, fontSize: '15px', fontWeight: 600 }}
            onClick={() => navigate('/movies')}
          >
            Xem tất cả <ArrowRightOutlined className="view-all-arrow" />
          </Button>
        </div>

        <div className="carousel-container" style={{ position: 'relative', margin: '0 -20px', padding: '0 20px' }}>
          <button ref={prevBtnRef} className="carousel-nav-btn prev-btn">
            <LeftOutlined style={{ fontSize: 18 }} />
          </button>
          <button ref={nextBtnRef} className="carousel-nav-btn next-btn">
            <RightOutlined style={{ fontSize: 18 }} />
          </button>
          
          <div ref={sliderRef} className="movie-slider" style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', gap: 28, paddingBottom: 40, paddingTop: 16, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {nowShowingMovies.map((movie) => (
              <div key={movie.id} className="movie-card" style={{ flex: '0 0 auto', width: 'calc(20% - 22.4px)', minWidth: 220 }}>
                <div className="movie-card-inner">
                  <div className="movie-poster-wrapper">
                    <img src={movie.poster?.includes('/') ? movie.poster : `/movies/${movie.poster}`} alt={movie.title} className="movie-poster-img" />
                    
                    <div className="movie-rating">
                      <StarFilled style={{ color: '#fadb14', fontSize: 14, paddingBottom: 2 }} />
                      <span>{movie.rating}</span>
                    </div>
                    
                    <div className="movie-overlay">
                      <Button 
                        type="primary" 
                        shape="round" 
                        size="large" 
                        style={{ 
                          background: colors.primaryRed, 
                          borderColor: colors.primaryRed, 
                          fontWeight: 'bold',
                          boxShadow: '0 8px 20px rgba(229, 9, 20, 0.4)' 
                        }}
                        onClick={() => handleBookMovie(movie.id)}
                      >
                        Đặt vé
                      </Button>
                    </div>
                  </div>
                  
                  <div style={{ paddingTop: 16, paddingLeft: 4 }}>
                    <h3 className="movie-title">{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} • {movie.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>

      {/* Coming Soon Section */}
      <Content style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          <Title level={2} style={{ color: colors.onSurface, marginBottom: 0, marginRight: 24, fontWeight: 700 }}>Sắp khởi chiếu</Title>
          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <Row gutter={[24, 24]}>
          {comingSoonMovies.map((movie) => (
            <Col xs={24} sm={12} md={6} key={movie.id}>
              <div className="coming-card">
                <div className="coming-img-wrapper">
                  <img src={movie.poster?.includes('/') ? movie.poster : `/banners/${movie.poster}`} alt={movie.title} className="coming-img" />
                  <div className="coming-date">{movie.date}</div>
                </div>
                <div className="coming-content">
                  <h4 className="coming-title">{movie.title}</h4>
                  <p className="coming-desc">{movie.description}</p>
                  <div className="coming-link" onClick={() => handleBookMovie(movie.id)}>
                    Thông tin chi tiết <ArrowRightOutlined />
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ background: '#110706', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '56px 48px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} style={{ color: colors.primary, marginBottom: 20, fontWeight: 800, fontSize: '24px' }}>KSTAR</Title>
              <Paragraph style={{ color: colors.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang lại trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</Paragraph>
              <Space size="middle">
                <Button shape="circle" icon={<GlobalOutlined />} style={{ background: colors.surfaceVariant, border: 'none', color: colors.onSurfaceVariant }} />
                <Button shape="circle" icon={<VideoCameraOutlined />} style={{ background: colors.surfaceVariant, border: 'none', color: colors.onSurfaceVariant }} />
                <Button shape="circle" icon={<ShareAltOutlined />} style={{ background: colors.surfaceVariant, border: 'none', color: colors.onSurfaceVariant }} />
              </Space>
            </Col>
            
            <Col xs={24} md={6}>
              <Title level={5} className="footer-title">Chăm sóc khách hàng</Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {footerCustomerLinks.map(link => (
                  <li key={link} style={{ marginBottom: 12 }}><a href="#" style={{ color: colors.onSurfaceVariant }}>{link}</a></li>
                ))}
              </ul>
            </Col>
            
            <Col xs={24} md={6}>
              <Title level={5} className="footer-title">Về chúng tôi</Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {footerAboutLinks.map(link => (
                  <li key={link} style={{ marginBottom: 12 }}><a href="#" style={{ color: colors.onSurfaceVariant }}>{link}</a></li>
                ))}
              </ul>
            </Col>
            
            <Col xs={24} md={6}>
              <Title level={5} className="footer-title">Đăng ký bản tin</Title>
              <Paragraph style={{ color: colors.onSurfaceVariant, fontSize: 13 }}>Nhận thông báo về các bộ phim bom tấn và ưu đãi mới nhất.</Paragraph>
              <Form layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
                <Form.Item name="email" style={{ flex: 1, margin: 0 }}>
                  <Input placeholder="Email của bạn" style={{ borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit" style={{ background: colors.primaryRed, borderColor: colors.primaryRed, borderRadius: 40, height: 44, padding: '0 20px' }}>Gửi</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Divider style={{ background: 'rgba(255,255,255,0.05)', margin: '40px 0 24px' }} />
          <Text style={{ color: colors.onSurfaceVariant, display: 'block', textAlign: 'center', fontSize: '13px' }}>© 2024 KSTAR Cinema. All Rights Reserved.</Text>
        </div>
      </Footer>
    </Layout>
  );
}