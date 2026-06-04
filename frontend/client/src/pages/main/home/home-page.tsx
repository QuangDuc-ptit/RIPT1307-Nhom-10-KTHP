import React, { useState, useRef } from 'react';
import { history } from 'umi';
import {
  Layout,
  Menu,
  Button,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  message,
  Badge,
  Avatar,
  Space,
  Typography,
  Divider,
  Form,
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

// ---------- Dữ liệu mẫu ----------
interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  poster: string; // tên file ảnh, ví dụ "poster1.png"
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

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const movieSliderRef = useRef<HTMLDivElement>(null);

  const requireAuth = (action?: () => void) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      action?.();
    } else {
      history.push('/auth/login');
    }
  };

  const handleBooking = () => {
    requireAuth(() => message.info('Chức năng đặt vé đang phát triển'));
  };

  const handleNewsletter = (values: any) => {
    message.success(`Cảm ơn ${values.email} đã đăng ký!`);
    setEmail('');
  };

  const scrollMovies = (direction: 'left' | 'right') => {
    if (movieSliderRef.current) {
      const scrollAmount = 300;
      movieSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const styles = {
    surface: '#200e0c',
    primaryRed: '#E50914',
    onSurface: '#ffdad5',
    onSurfaceVariant: '#e9bcb6',
    surfaceVariant: '#462f2c',
    primary: '#ff1e00',
    surfaceContainerLow: '#2a1614',
    glassCard: {
      background: 'rgba(70, 47, 44, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
    },
    heroGradient: {
      background: 'linear-gradient(to top, #200e0c 0%, rgba(32,14,12,0.4) 50%, transparent 100%), linear-gradient(to right, #200e0c 0%, rgba(32,14,12,0.2) 30%, transparent 100%)',
    },
  };

  return (
    <Layout style={{ background: styles.surface, minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(32,14,12,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 48px', height: 'auto', lineHeight: 'normal' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Title level={3} style={{ margin: 0, color: styles.primary, fontWeight: 800, letterSpacing: '-0.02em' }}>KSTAR</Title>
            <Menu
              mode="horizontal"
              selectedKeys={['movies']}
              style={{ background: 'transparent', border: 'none', minWidth: 350, justifyContent: 'center' }}
              items={[
                { key: 'movies', label: <span style={{ color: '#fff', fontWeight: 500 }}>PHIM</span> },
                { key: 'cinemas', label: <span style={{ color: styles.onSurfaceVariant }}>RẠP</span> },
                { key: 'showtimes', label: <span style={{ color: styles.onSurfaceVariant }}>XUẤT CHIẾU</span> },
              ]}
            />
          </div>
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(70,47,44,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 30, padding: '4px 12px', width: 240 }}>
              <SearchOutlined style={{ color: styles.onSurfaceVariant, fontSize: 20 }} />
              <Input placeholder="Search movies..." bordered={false} style={{ background: 'transparent', color: styles.onSurface }} />
            </div>
            <Badge dot><BellOutlined style={{ fontSize: 20, color: styles.onSurfaceVariant }} /></Badge>
            <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ" style={{ border: `2px solid ${styles.primaryRed}` }} />
          </Space>
        </div>
      </Header>

      {/* Hero Section */}
      <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBlCtflLWk3fLSCug8wAaXWQUoiJ4Lk1o7gXal4ssufHcNJ1Y0AHpB-csPZpxgnIyGvhQUbTX6qQ44onQPqZHg4bKR0k6V7hmbgJoOAJvKXPOjE6o0vyyjEZrS0SFHWCN7WNbs6XRtDcniEKQkoIQQom6fLjhIrE8FbHy3hdNqLC3BpwFaGh-CNFhmM20wtqXDbm_Hkxt_mZ34HGdvG36-UPI2Iti2rMwWzrwC66YmwHpHZIOlv7Wv6GpnG3v4R84JLhIO3InBRRXg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, ...styles.heroGradient, zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 64 }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'inline-block', background: styles.primaryRed, color: 'white', padding: '4px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Now Showing</div>
            <Title level={1} style={{ color: 'white', fontSize: 64, margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>DUNE: PART TWO</Title>
            <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 18, marginTop: 16 }}>Hành trình sử thi tiếp theo của Paul Atreides khi anh hợp lực với Chani và người Fremen để trả thù những kẻ đã hủy hoại gia đình mình.</Paragraph>
            <Space size="middle">
              <Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={handleBooking} style={{ background: styles.primaryRed, borderColor: styles.primaryRed, borderRadius: 40, fontWeight: 'bold', padding: '10px 40px', height: 48 }}>
                Đặt vé
              </Button>
              <Button size="large" icon={<PlayCircleOutlined />} style={{ background: 'rgba(70,47,44,0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 40, color: 'white', padding: '10px 40px', height: 48 }}>
                Xem Trailer
              </Button>
            </Space>
          </div>
        </div>
      </div>

      {/* Quick Booking Bar */}
      <div style={{ position: 'relative', zIndex: 30, marginTop: -64, padding: '0 48px', maxWidth: 1280, marginLeft: 'auto', marginRight: 'auto' }}>
        <div style={{ ...styles.glassCard, padding: 24, borderRadius: 12 }}>
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} md={6}>
              <Text style={{ color: styles.onSurfaceVariant, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Chọn Phim</Text>
              <Select style={{ width: '100%' }} placeholder="Chọn phim" defaultValue="dune">
                <Option value="dune">Dune: Part Two</Option>
                <Option value="godzilla">Godzilla x Kong</Option>
                <Option value="kungfu">Kung Fu Panda 4</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Text style={{ color: styles.onSurfaceVariant, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Ngày Chiếu</Text>
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" suffixIcon={<CalendarOutlined />} />
            </Col>
            <Col xs={24} md={6}>
              <Text style={{ color: styles.onSurfaceVariant, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Chọn Rạp</Text>
              <Select style={{ width: '100%' }} placeholder="Chọn rạp" defaultValue="nguyenDu">
                <Option value="nguyenDu">KSTAR Nguyễn Du</Option>
                <Option value="hungVuong">KSTAR Hùng Vương</Option>
                <Option value="landmark">KSTAR Landmark</Option>
              </Select>
            </Col>
            <Col xs={24} md={6}>
              <Button type="primary" block style={{ background: styles.primaryRed, borderColor: styles.primaryRed, height: 42, fontWeight: 'bold' }} onClick={handleBooking}>Mua vé nhanh</Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Now Showing Section */}
      <Content style={{ padding: '80px 48px 0', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <Title level={2} style={{ color: styles.onSurface, borderLeft: `4px solid ${styles.primaryRed}`, paddingLeft: 16 }}>Phim Đang Chiếu</Title>
          <Button type="link" style={{ color: styles.primary }}>Xem tất cả <ArrowRightOutlined /></Button>
        </div>
        <div style={{ position: 'relative' }}>
          <Button icon={<LeftOutlined />} shape="circle" size="large" onClick={() => scrollMovies('left')} style={{ position: 'absolute', left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }} />
          <div ref={movieSliderRef} style={{ display: 'flex', overflowX: 'auto', scrollBehavior: 'smooth', gap: 24, paddingBottom: 16, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {nowShowingMovies.map((movie) => (
              <div key={movie.id} style={{ flex: '0 0 auto', width: 'calc(20% - 20px)', minWidth: 200 }}>
                <div className="movie-card" style={{ cursor: 'pointer', position: 'relative' }}>
                  <div style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
                    <img src={`/images/${movie.poster}`} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                      <span style={{ color: 'white', fontSize: 12 }}>{movie.rating}</span>
                    </div>
                    <div className="movie-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.3s' }}>
                      <Button type="primary" danger shape="round" onClick={handleBooking}>Đặt vé</Button>
                    </div>
                  </div>
                  <Title level={5} style={{ color: styles.onSurface, marginTop: 8, marginBottom: 0 }}>{movie.title}</Title>
                  <Text style={{ color: styles.onSurfaceVariant, fontSize: 12 }}>{movie.genre} • {movie.duration}</Text>
                </div>
              </div>
            ))}
          </div>
          <Button icon={<RightOutlined />} shape="circle" size="large" onClick={() => scrollMovies('right')} style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }} />
        </div>
      </Content>

      {/* Coming Soon Section */}
      <Content style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ color: styles.onSurface, marginBottom: 0, marginRight: 16 }}>Sắp khởi chiếu</Title>
          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.1)' }} />
        </div>
        <Row gutter={[24, 24]}>
          {comingSoonMovies.map((movie) => (
            <Col xs={24} sm={12} md={6} key={movie.id}>
              <div style={{ ...styles.glassCard, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                  <img src={`/images/${movie.image}`} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  <div style={{ position: 'absolute', top: 16, left: 16, background: styles.primaryRed, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 'bold', color: 'white' }}>{movie.date}</div>
                </div>
                <div style={{ padding: 20 }}>
                  <Title level={5} style={{ color: styles.onSurface, marginBottom: 8 }}>{movie.title}</Title>
                  <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 12 }} ellipsis={{ rows: 2 }}>{movie.desc}</Paragraph>
                  <Button type="link" style={{ color: styles.primary, paddingLeft: 0 }} onClick={handleBooking}>Thông tin chi tiết <ArrowRightOutlined /></Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ background: '#1a0908', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '48px 48px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} style={{ color: styles.primary, marginBottom: 16, fontWeight: 800 }}>KSTAR</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant }}>Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang lại trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</Paragraph>
              <Space size="middle">
                <Button shape="circle" icon={<GlobalOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
                <Button shape="circle" icon={<VideoCameraOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
                <Button shape="circle" icon={<ShareAltOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary }}>Chăm sóc khách hàng</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>FAQs</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Contact Us</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary }}>Về chúng tôi</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>About Us</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Careers</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Membership</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Cinemas</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary }}>Đăng ký bản tin</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant }}>Nhận thông báo về các bộ phim bom tấn và ưu đãi mới nhất.</Paragraph>
              <Form onFinish={handleNewsletter} layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
                <Form.Item name="email" rules={[{ required: true, type: 'email' }]} style={{ flex: 1, margin: 0 }}>
                  <Input placeholder="Email của bạn" style={{ borderRadius: 40, background: '#ffffff25' }} value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit" style={{ background: styles.primaryRed, borderColor: styles.primaryRed, borderRadius: 40, height: 44 }}>Gửi</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Divider style={{ background: 'rgba(255,255,255,0.05)', margin: '32px 0 24px' }} />
          <Text style={{ color: styles.onSurfaceVariant, display: 'block', textAlign: 'center' }}>© 2024 KSTAR Cinema. All Rights Reserved.</Text>
        </div>
      </Footer>

      <style>{`
        .movie-card:hover .movie-overlay { opacity: 1 !important; }
        .movie-card:hover img { transform: scale(1.05); }
        .movie-card { cursor: pointer; }
        div[ref]::-webkit-scrollbar { display: none; }
      `}</style>
    </Layout>
  );
};

export default HomePage;