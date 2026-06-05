import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { env } from '@/config/env';
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

// ---------- Dữ liệu ----------
interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  poster: string;
}

const nowShowingMovies: Movie[] = [
  { id: 1, title: 'Hành Tinh Của Những Vị Thần', genre: 'Hành động, Viễn tưởng', duration: '124 phút', rating: 8.9, poster: 'poster1.png' },
  { id: 2, title: 'Vùng Đất Vô Định', genre: 'Phiêu lưu, Tâm lý', duration: '142 phút', rating: 9.2, poster: 'poster2.png' },
  { id: 3, title: 'Kỹ Nguyên Robot', genre: 'Hành động, Khoa học', duration: '115 phút', rating: 8.5, poster: 'poster3.png' },
  { id: 4, title: 'Bản Giao Hưởng Cuối Cùng', genre: 'Âm nhạc, Lãng mạn', duration: '130 phút', rating: 8.7, poster: 'poster4.png' },
  { id: 5, title: 'Tiếng Gọi Trong Đêm', genre: 'Kinh dị, Giật gân', duration: '108 phút', rating: 8.2, poster: 'poster5.png' },
  { id: 6, title: 'Chiến Binh Ánh Sáng', genre: 'Hành động, Kỳ ảo', duration: '135 phút', rating: 9.0, poster: 'poster6.png' },
  { id: 7, title: 'Thành Phố Ngầm', genre: 'Viễn tưởng, Bí ẩn', duration: '112 phút', rating: 8.4, poster: 'poster7.png' },
  { id: 8, title: 'Mật Mã Cuối Cùng', genre: 'Giật gân, Tội phạm', duration: '128 phút', rating: 8.8, poster: 'poster8.png' },
  { id: 9, title: 'Vũ Điệu Hoang Dã', genre: 'Hoạt hình, Gia đình', duration: '95 phút', rating: 8.1, poster: 'poster9.png' },
  { id: 10, title: 'Siêu Anh Hùng: Trỗi Dậy', genre: 'Hành động, Phiêu lưu', duration: '148 phút', rating: 9.5, poster: 'poster10.png' },
];

const comingSoonMovies = [
  { id: 1, title: 'Vệ Binh Dải Ngân Hà 4', date: '15 / 04', desc: 'Đội ngũ anh hùng quen thuộc trở lại với sứ mệnh bảo vệ vũ trụ khỏi một thực thể cổ xưa...', image: 'coming1.png' },
  { id: 2, title: 'Trí Tuệ Nhân Tạo', date: '22 / 04', desc: 'Khi AI vượt qua sự kiểm soát của con người, ranh giới giữa sự sống và máy móc trở nên mờ nhạt.', image: 'coming2.png' },
  { id: 3, title: 'Ảo Ảnh Đỏ', date: '01 / 05', desc: 'Một bộ phim tâm lý ly kỳ đưa khán giả vào những góc tối nhất của tâm trí con người.', image: 'coming3.png' },
  { id: 4, title: 'Ngôi Đền Cổ', date: '12 / 05', desc: 'Hành trình tìm kiếm kho báu mất tích dẫn đến những bí mật kinh hoàng của một nền văn minh đã quên.', image: 'coming4.png' },
];

const footerCustomerLinks = ['FAQs', 'Terms of Service', 'Privacy Policy', 'Contact Us'];
const footerAboutLinks = ['About Us', 'Careers', 'Membership', 'Cinemas'];

// Các màu sắc vẫn cần dùng inline cho thư viện Ant Design
const colors = {
  surface: '#200e0c',
  primaryRed: '#E50914',
  onSurface: '#ffdad5',
  onSurfaceVariant: '#e9bcb6',
  surfaceVariant: '#462f2c',
  primary: '#ff1e00',
};

export default function HomePage() {
  const headerRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

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
    const handleMouseMove = (e: MouseEvent) => {
      if (heroContentRef.current) {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
        heroContentRef.current.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
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

  return (
    <Layout style={{ background: colors.surface, minHeight: '100vh' }}>

      {/* Header */}
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
            <Title level={3} style={{ margin: 0, color: colors.primary, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '28px', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
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
            <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ" style={{ border: `2px solid ${colors.primaryRed}`, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', transition: 'transform 0.3s ease' }} />
          </Space>
        </div>
      </Header>

      {/* Hero Section */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1974&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.02)', transition: 'transform 10s ease-out' }} />
        <div className="hero-gradient" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
        
        <div ref={heroContentRef} style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 100, transition: 'transform 0.3s ease-out' }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: 'inline-block', background: colors.primaryRed, color: 'white', padding: '6px 20px', borderRadius: 40, fontSize: 13, fontWeight: 700, marginBottom: 24, letterSpacing: '1px', boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)' }}>
              NOW SHOWING
            </div>
            <Title level={1} style={{ color: 'white', fontSize: 72, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, textShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
              DUNE: PART TWO
            </Title>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 18, marginTop: 24, lineHeight: 1.6, maxWidth: '90%', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Hành trình sử thi tiếp theo của Paul Atreides khi anh hợp lực với Chani và người Fremen để trả thù những kẻ đã hủy hoại gia đình mình.
            </Paragraph>
            
            <Space size="middle" style={{ marginTop: 40 }}>
              <Button type="primary" size="large" icon={<PlayCircleOutlined />} style={{ background: colors.primaryRed, borderColor: colors.primaryRed, borderRadius: 48, fontWeight: 'bold', padding: '0 40px', height: 56, fontSize: '16px', boxShadow: '0 8px 25px rgba(229, 9, 20, 0.4)', transition: 'all 0.3s ease' }}>
                Đặt vé
              </Button>
              <Button size="large" icon={<PlayCircleOutlined />} style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: 48, color: 'white', padding: '0 40px', height: 56, fontSize: '16px', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease' }}>
                Xem Trailer
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Quick Booking Bar */}
      <div style={{ position: 'relative', zIndex: 30, marginTop: -56, padding: '0 48px', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
        <Card className="glass-card" style={{ padding: 20, borderRadius: 24 }} bordered={false}>
          <Row gutter={[24, 16]} align="bottom">
            {renderBookingField('Chọn Phim', (
              <Select className="quick-book-input" placeholder="Chọn phim" defaultValue="dune">
                <Option value="dune">Dune: Part Two</Option>
                <Option value="godzilla">Godzilla x Kong</Option>
                <Option value="kungfu">Kung Fu Panda 4</Option>
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
              <Button type="primary" block style={{ background: colors.primaryRed, borderColor: colors.primaryRed, height: 48, fontWeight: 'bold', borderRadius: 40 }}>Mua vé nhanh</Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Now Showing Section */}
      <Content style={{ padding: '80px 48px 0', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <Title level={2} style={{ 
            color: colors.onSurface, 
            margin: 0, 
            fontWeight: 800,
            position: 'relative',
            paddingLeft: 20,
            letterSpacing: '0.5px'
          }}>
            {/* Thanh viền đỏ bo góc sang trọng hơn */}
            <span style={{ position: 'absolute', left: 0, top: '10%', height: '80%', width: 5, background: colors.primaryRed, borderRadius: 10 }}></span>
            Phim Đang Chiếu
          </Title>
          
          <Button type="text" className="view-all-btn" style={{ color: colors.onSurfaceVariant, fontSize: '15px', fontWeight: 600 }}>
            Xem tất cả <ArrowRightOutlined className="view-all-arrow" />
          </Button>
        </div>

        {/* Carousel Container */}
        <div className="carousel-container" style={{ position: 'relative', margin: '0 -20px', padding: '0 20px' }}>
          
          <button ref={prevBtnRef} className="carousel-nav-btn prev-btn">
            <LeftOutlined style={{ fontSize: 18 }} />
          </button>
          <button ref={nextBtnRef} className="carousel-nav-btn next-btn">
            <RightOutlined style={{ fontSize: 18 }} />
          </button>
          
          {/* ĐÃ SỬA: Đường dẫn ảnh phim đang chiếu (/movies/) */}
          <div ref={sliderRef} className="movie-slider" style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', gap: 28, paddingBottom: 40, paddingTop: 16, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {nowShowingMovies.map((movie) => (
              <div key={movie.id} className="movie-card" style={{ flex: '0 0 auto', width: 'calc(20% - 22.4px)', minWidth: 220 }}>
                <div className="movie-card-inner">
                  <div className="movie-poster-wrapper">
                    <img src={`/movies/${movie.poster}`} alt={movie.title} className="movie-poster-img" />
                    
                    <div className="movie-rating">
                      <StarFilled style={{ color: '#fadb14', fontSize: 14, paddingBottom: 2 }} />
                      <span>{movie.rating}</span>
                    </div>
                    
                    <div className="movie-overlay">
                      <Button type="primary" shape="round" size="large" style={{ 
                        background: colors.primaryRed, 
                        borderColor: colors.primaryRed, 
                        fontWeight: 'bold',
                        boxShadow: '0 8px 20px rgba(229, 9, 20, 0.4)' 
                      }}>
                        Đặt vé
                      </Button>
                    </div>
                  </div>
                  
                  {/* Căn chỉnh lại text bên dưới poster cho thoáng */}
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
                  {/* ĐÃ SỬA: Đường dẫn ảnh sắp chiếu (/banners/) */}
                  <img src={`/banners/${movie.image}`} alt={movie.title} className="coming-img" />
                  <div className="coming-date">{movie.date}</div>
                </div>
                <div className="coming-content">
                  <h4 className="coming-title">{movie.title}</h4>
                  <p className="coming-desc">{movie.desc}</p>
                  <div className="coming-link">
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