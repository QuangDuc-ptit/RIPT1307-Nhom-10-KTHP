import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { env } from '@/config/env';
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

// ---------- Dữ liệu phim (dùng ảnh local trong public/images/) ----------
interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  poster: string; // tên file ảnh trong public/images/
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

export default function HomePage() {
  // --- Giữ nguyên toàn bộ refs và logic từ file cũ ---
  const headerRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.style.padding = '0.5rem 0';
        } else {
          headerRef.current.style.padding = '1rem 0';
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect for hero content
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

  // Carousel logic (prev/next buttons + scroll)
  useEffect(() => {
    const slider = sliderRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    if (!slider || !prevBtn || !nextBtn) return;

    const scrollAmount = 300;
    const updateButtons = () => {
      prevBtn.style.visibility = slider.scrollLeft <= 0 ? 'hidden' : 'visible';
      nextBtn.style.visibility =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth ? 'hidden' : 'visible';
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

  const styles = {
    surface: '#200e0c',
    primaryRed: '#E50914',
    onSurface: '#ffdad5',
    onSurfaceVariant: '#e9bcb6',
    surfaceVariant: '#462f2c',
    primary: '#ff1e00',
    glassCard: {
      background: 'rgba(70, 47, 44, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
    },
    heroGradient: {
      background:
        'linear-gradient(to top, #200e0c 0%, rgba(32,14,12,0.4) 50%, transparent 100%), linear-gradient(to right, #200e0c 0%, rgba(32,14,12,0.2) 30%, transparent 100%)',
    },
  };

  return (
    <Layout style={{ background: styles.surface, minHeight: '100vh' }}>
      <Helmet>
        <title>{env.appName} — Trang chủ</title>
      </Helmet>

      {/* Header */}
      <Header
        ref={headerRef as any}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(32,14,12,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '1rem 48px',
          height: 'auto',
          lineHeight: 'normal',
          transition: 'padding 0.3s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <Title level={3} style={{ margin: 0, color: styles.primary, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '28px' }}>KSTAR</Title>
            <Menu
              mode="horizontal"
              selectedKeys={['movies']}
              style={{ background: 'transparent', border: 'none', minWidth: 360, lineHeight: 'normal' }}
              items={[
                { key: 'movies', label: <span style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>Movies</span> },
                { key: 'cinemas', label: <span style={{ color: styles.onSurfaceVariant, fontSize: '15px' }}>Cinemas</span> },
                { key: 'offers', label: <span style={{ color: styles.onSurfaceVariant, fontSize: '15px' }}>Offers</span> },
                { key: 'membership', label: <span style={{ color: styles.onSurfaceVariant, fontSize: '15px' }}>Membership</span> },
              ]}
            />
          </div>
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(70,47,44,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 40, padding: '4px 16px', width: 260 }}>
              <SearchOutlined style={{ color: styles.onSurfaceVariant, fontSize: 18 }} />
              <Input placeholder="Tìm phim..." bordered={false} style={{ background: 'transparent', color: styles.onSurface, marginLeft: 8 }} />
            </div>
            <Badge dot offset={[2, 0]}>
              <BellOutlined style={{ fontSize: 22, color: styles.onSurfaceVariant, cursor: 'pointer' }} />
            </Badge>
            <Avatar
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ"
              style={{ border: `2px solid ${styles.primaryRed}`, cursor: 'pointer' }}
            />
          </Space>
        </div>
      </Header>

      {/* Hero Section - vẫn giữ ảnh URL vì không có file local nào cho hero */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBlCtflLWk3fLSCug8wAaXWQUoiJ4Lk1o7gXal4ssufHcNJ1Y0AHpB-csPZpxgnIyGvhQUbTX6qQ44onQPqZHg4bKR0k6V7hmbgJoOAJvKXPOjE6o0vyyjEZrS0SFHWCN7WNbs6XRtDcniEKQkoIQQom6fLjhIrE8FbHy3hdNqLC3BpwFaGh-CNFhmM20wtqXDbm_Hkxt_mZ34HGdvG36-UPI2Iti2rMwWzrwC66YmwHpHZIOlv7Wv6GpnG3v4R84JLhIO3InBRRXg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, ...styles.heroGradient, zIndex: 1 }} />
        <div ref={heroContentRef} style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 80, transition: 'transform 0.1s ease-out' }}>
          <div style={{ maxWidth: 620 }}>
            <div style={{ display: 'inline-block', background: styles.primaryRed, color: 'white', padding: '6px 20px', borderRadius: 40, fontSize: 13, fontWeight: 600, marginBottom: 20, letterSpacing: '0.5px' }}>NOW SHOWING</div>
            <Title level={1} style={{ color: 'white', fontSize: 72, margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>DUNE: PART TWO</Title>
            <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 18, marginTop: 20, lineHeight: 1.6, maxWidth: '90%' }}>
              Hành trình sử thi tiếp theo của Paul Atreides khi anh hợp lực với Chani và người Fremen để trả thù những kẻ đã hủy hoại gia đình mình.
            </Paragraph>
            <Space size="middle" style={{ marginTop: 32 }}>
              <Button type="primary" size="large" icon={<PlayCircleOutlined />} style={{ background: styles.primaryRed, borderColor: styles.primaryRed, borderRadius: 48, fontWeight: 'bold', padding: '0 36px', height: 52, fontSize: '16px' }}>Đặt vé</Button>
              <Button size="large" icon={<PlayCircleOutlined />} style={{ background: 'rgba(70,47,44,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 48, color: 'white', padding: '0 36px', height: 52, fontSize: '16px' }}>Xem Trailer</Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Quick Booking Bar */}
      <div style={{ position: 'relative', zIndex: 30, marginTop: -56, padding: '0 48px', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
        <Card style={{ ...styles.glassCard, padding: 20, borderRadius: 24 }} bordered={false}>
          <Row gutter={[24, 16]} align="bottom">
            <Col xs={24} md={6}>
              <Text style={{ color: styles.onSurfaceVariant, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Chọn Phim</Text>
              <Select style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: 12 }} placeholder="Chọn phim" defaultValue="dune">
                <Option value="dune">Dune: Part Two</Option>
                <Option value="godzilla">Godzilla x Kong</Option>
                <Option value="kungfu">Kung Fu Panda 4</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Text style={{ color: styles.onSurfaceVariant, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Ngày Chiếu</Text>
              <DatePicker style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: 12 }} placeholder="Chọn ngày" suffixIcon={<CalendarOutlined />} />
            </Col>
            <Col xs={24} md={6}>
              <Text style={{ color: styles.onSurfaceVariant, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Chọn Rạp</Text>
              <Select style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: 12 }} placeholder="Chọn rạp" defaultValue="nguyenDu">
                <Option value="nguyenDu">KSTAR Nguyễn Du</Option>
                <Option value="hungVuong">KSTAR Hùng Vương</Option>
                <Option value="landmark">KSTAR Landmark</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Button type="primary" block style={{ background: styles.primaryRed, borderColor: styles.primaryRed, height: 48, fontWeight: 'bold', borderRadius: 40 }}>Mua vé nhanh</Button>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Now Showing Section - dùng ảnh local */}
      <Content style={{ padding: '80px 48px 0', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <Title level={2} style={{ color: styles.onSurface, borderLeft: `4px solid ${styles.primaryRed}`, paddingLeft: 18, margin: 0, fontWeight: 700 }}>Phim Đang Chiếu</Title>
          <Button type="link" style={{ color: styles.primary, fontSize: '15px', fontWeight: 500 }}>Xem tất cả <ArrowRightOutlined /></Button>
        </div>
        <div className="carousel-container" style={{ position: 'relative' }}>
          <button
            ref={prevBtnRef}
            className="carousel-nav-btn carousel-nav-left"
            style={{
              position: 'absolute', left: -24, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'white', backdropFilter: 'blur(4px)', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = styles.primaryRed)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
          >
            <LeftOutlined style={{ fontSize: 18 }} />
          </button>
          <button
            ref={nextBtnRef}
            className="carousel-nav-btn carousel-nav-right"
            style={{
              position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: 'white', backdropFilter: 'blur(4px)', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = styles.primaryRed)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.6)')}
          >
            <RightOutlined style={{ fontSize: 18 }} />
          </button>
          <div
            ref={sliderRef}
            className="movie-slider"
            style={{
              display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', gap: 24,
              paddingBottom: 20, scrollbarWidth: 'none', msOverflowStyle: 'none',
            }}
          >
            {nowShowingMovies.map((movie) => (
              <div key={movie.id} className="movie-card" style={{ flex: '0 0 auto', width: 'calc(20% - 20px)', minWidth: 210 }}>
                <div className="movie-card-inner">
                  <div className="movie-poster-wrapper">
                    <img src={`/images/${movie.poster}`} alt={movie.title} className="movie-poster-img" />
                    <div className="movie-rating">
                      <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                      <span>{movie.rating}</span>
                    </div>
                    <div className="movie-overlay">
                      <Button type="primary" danger shape="round" size="large" style={{ fontWeight: 'bold' }}>Đặt vé</Button>
                    </div>
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-meta">{movie.genre} • {movie.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Content>

      {/* Coming Soon Section - dùng ảnh local */}
      <Content style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          <Title level={2} style={{ color: styles.onSurface, marginBottom: 0, marginRight: 24, fontWeight: 700 }}>Sắp khởi chiếu</Title>
          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <Row gutter={[24, 24]}>
          {comingSoonMovies.map((movie) => (
            <Col xs={24} sm={12} md={6} key={movie.id}>
              <div className="coming-card">
                <div className="coming-img-wrapper">
                  <img src={`/images/${movie.image}`} alt={movie.title} className="coming-img" />
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
              <Title level={4} style={{ color: styles.primary, marginBottom: 20, fontWeight: 800, fontSize: '24px' }}>KSTAR</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang lại trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</Paragraph>
              <Space size="middle">
                <Button shape="circle" icon={<GlobalOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
                <Button shape="circle" icon={<VideoCameraOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
                <Button shape="circle" icon={<ShareAltOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary, marginBottom: 20, fontWeight: 600 }}>Chăm sóc khách hàng</Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>FAQs</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>Terms of Service</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>Privacy Policy</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>Contact Us</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary, marginBottom: 20, fontWeight: 600 }}>Về chúng tôi</Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>About Us</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>Careers</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>Membership</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: styles.onSurfaceVariant }}>Cinemas</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary, marginBottom: 20, fontWeight: 600 }}>Đăng ký bản tin</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 13 }}>Nhận thông báo về các bộ phim bom tấn và ưu đãi mới nhất.</Paragraph>
              <Form layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
                <Form.Item name="email" style={{ flex: 1, margin: 0 }}>
                  <Input placeholder="Email của bạn" style={{ borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit" style={{ background: styles.primaryRed, borderColor: styles.primaryRed, borderRadius: 40, height: 44, padding: '0 20px' }}>Gửi</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Divider style={{ background: 'rgba(255,255,255,0.05)', margin: '40px 0 24px' }} />
          <Text style={{ color: styles.onSurfaceVariant, display: 'block', textAlign: 'center', fontSize: '13px' }}>© 2024 KSTAR Cinema. All Rights Reserved.</Text>
        </div>
      </Footer>

      <style>{`
        .movie-slider::-webkit-scrollbar { display: none; }
        .movie-slider { -ms-overflow-style: none; scrollbar-width: none; }
        .movie-card { cursor: pointer; transition: transform 0.3s ease; }
        .movie-card:hover { transform: translateY(-6px); }
        .movie-poster-wrapper { position: relative; aspect-ratio: 2/3; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); transition: border 0.3s ease; }
        .movie-card:hover .movie-poster-wrapper { border-color: rgba(229, 9, 20, 0.5); }
        .movie-poster-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .movie-card:hover .movie-poster-img { transform: scale(1.05); }
        .movie-rating { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 4px 10px; border-radius: 30px; display: flex; align-items: center; gap: 6px; color: white; font-size: 13px; font-weight: 600; z-index: 2; }
        .movie-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); display: flex; flex-direction: column; justify-content: flex-end; align-items: center; padding: 20px; opacity: 0; transition: opacity 0.3s ease; }
        .movie-card:hover .movie-overlay { opacity: 1; }
        .movie-title { font-size: 16px; font-weight: 700; color: #ffdad5; margin: 14px 0 4px 0; transition: color 0.2s; }
        .movie-card:hover .movie-title { color: #ff1e00; }
        .movie-meta { font-size: 12px; color: #e9bcb6; margin: 0; }
        .coming-card { background: rgba(70, 47, 44, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; overflow: hidden; transition: transform 0.3s ease; cursor: pointer; }
        .coming-card:hover { transform: translateY(-6px); }
        .coming-img-wrapper { position: relative; height: 200px; overflow: hidden; }
        .coming-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .coming-card:hover .coming-img { transform: scale(1.1); }
        .coming-date { position: absolute; top: 16px; left: 16px; background: #E50914; padding: 5px 16px; border-radius: 40px; font-size: 13px; font-weight: bold; color: white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .coming-content { padding: 20px; }
        .coming-title { font-size: 20px; font-weight: 700; color: #ffdad5; margin: 0 0 10px 0; transition: color 0.2s; }
        .coming-card:hover .coming-title { color: #ff1e00; }
        .coming-desc { font-size: 13px; color: #e9bcb6; line-height: 1.5; margin: 0 0 12px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .coming-link { display: flex; align-items: center; gap: 6px; color: #ff1e00; font-size: 14px; font-weight: 600; transition: gap 0.2s; }
        .coming-link:hover { gap: 10px; text-decoration: underline; }
        .carousel-container .carousel-nav-btn { opacity: 0; transition: opacity 0.3s, background 0.2s; }
        .carousel-container:hover .carousel-nav-btn { opacity: 1; }
      `}</style>
    </Layout>
  );
}