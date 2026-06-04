import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Menu,
  Button,
  Input,
  Row,
  Col,
  Form,
  message,
  Badge,
  Avatar,
  Space,
  Typography,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  BellOutlined,
  StarFilled,
  PlayCircleOutlined,
  LeftOutlined,
  RightOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  VideoCameraOutlined,
  ShareAltOutlined,
  AndroidOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  TagOutlined, // Thay TicketOutlined bằng TagOutlined
} from '@ant-design/icons';

const { Header, Footer, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// Dữ liệu mẫu
interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: number;
  poster: string;
}

const moviesData: Movie[] = [
  { id: 1, title: 'The Last Horizon', genre: 'Tình cảm', duration: '2h 15m', rating: 8.9, poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnJqT9dwyvnIVcxDGeeMVbPlQBAdUkCAO0mlLjq9drfSni0B5oqQ4YprGvNWEiENEasC7IksJXhraVpi2SFEE8BfqTc3uDte1i57LEnvvgwW3J31npFzGL_iUM7DuoRVt1ZcGdRHiPG1wkLYTURslRDWjER64j2V00MxNyYEynu1uv0TrZ3eF-povrcvzT5Urzzdxu3c0or4vXWrQBb8fh4sQY0eVyvcodBmLY8IptjFJ2Q-AeKZ73jJ30KqLkzTF7KZpht8MODwo' },
  { id: 2, title: 'Cyber Odyssey', genre: 'Hành động', duration: '2h 05m', rating: 9.2, poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwMiUqB6wVgCtm_SUmwZol6X-LOaZzFeawdszLGnDAfJnuVjEJyx4WQevcXLcJoh-A6PJZ-C65zzDxbcE-uhde9Pqdb9IGEimIStYFCpaRcy5bAqQq6CNTfTDH-ELo0GnHaSY2XYxYXY-_P4tYUptOycs73zzo6jBI89jfQ0oavOkZ6aI2_mrOVeEQGungmgXIVMeYm1w0xkgkHQX4FFLtBmuW4eYLxlTOJe2N8PtPtIj--NoO-WJnE25xiHA-nOZr169oC7Zj75M' },
  { id: 3, title: 'Dragon Spirits', genre: 'Hoạt hình', duration: '1h 45m', rating: 8.5, poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ5zNEVhDR2ezlPSOEvEbA59Al02BJSl0ExaGgqIf11u4QTE9BWL8uxZtr-CST6ayIsm98XQKtedT9SlFneAltmK6Azwg28gLqPVXRd_GnPIOXxqN9TLhgDxz-iS5R-97BGFTDmB0LsjWfAwZRr89oWsaG_07h6ivUG3KpvSAWte5OIzdFU5OHgB3UnaDORawgqeKGNXss8qDXsznQoVJyBicSJLuvUVWbISELA_ZCu9rpTltL3Mf4JinwwE_qhQPO24GSjlQtVzs' },
  { id: 4, title: 'Midnight Whisper', genre: 'Tình cảm', duration: '2h 10m', rating: 7.8, poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAlWTCjRkNu2VtDM-B820EGVfbBrcOBk0-mincTeBsFbN1T5WWdTAWQqsMrVnIFEd8_h26q3nTo2-Y5A4pREMXHJFsXWaeRF2LX1YQziq9hCKxVPEDXuDR10Q1Q53mVTHBPS0UIrUwqjFSyX1G-xHpdcg2qm-UBmHXPSy1oJRzjgg8GHFq6EwwHzCjgQYNIk9fyDNC4oF59VX_O2T9L_FrvHaJTR_UYMOdb3VcZa35LolDg0aLsfTKYFji-6-LKHw5nT_XTQdtboc' },
  { id: 5, title: 'Dark Echoes', genre: 'Kinh dị', duration: '1h 55m', rating: 8.1, poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLIeABw99LnzBDZ-qfBXs7BVbi2ch12TYxFrI9f_-hah3aSzPo2O0uQt2q-V6tEuo2nqARufAvuuEl4N_9hN2czNH610QH8yrf7QgVkrkEnl-4iYlE6cuTkxadkgZFczLlBtQJcJl9evb6kXRkTXLeB4jWoUHgSM5HY7cOuu3AWalmMGJfl1fu-RjURNaoKOWQnlXXAZjuL8biJQ2fQx78mlZF6nfnlzaacMON8zc-QwVvpX2L9pItGIn5x3oyeNurKTAHbEu0N7I' },
  { id: 6, title: 'Dark Echoes', genre: 'Kinh dị', duration: '1h 55m', rating: 8.1, poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLIeABw99LnzBDZ-qfBXs7BVbi2ch12TYxFrI9f_-hah3aSzPo2O0uQt2q-V6tEuo2nqARufAvuuEl4N_9hN2czNH610QH8yrf7QgVkrkEnl-4iYlE6cuTkxadkgZFczLlBtQJcJl9evb6kXRkTXLeB4jWoUHgSM5HY7cOuu3AWalmMGJfl1fu-RjURNaoKOWQnlXXAZjuL8biJQ2fQx78mlZF6nfnlzaacMON8zc-QwVvpX2L9pItGIn5x3oyeNurKTAHbEu0N7I' },
];

const heroSlides = [
  { title: 'AVENGERS: ENDGAME', description: 'Experience the final stand against Thanos. The epic conclusion to the Infinity Saga in stunning IMAX Laser 4K at KSTAR Cinema.', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUWt68Fq3OAEvnI_Q0jNMwhlDJlkzudzy1SKstutMmiCMskP32VDGnuabw8CIeuhpueZPExx8SXhIHT7Ubfl2HpEjUocDMRkxqlnRZkV9Jw0oou_CkW9OWRgW2d1TYtZEiTXyntR9twc7wiDT9H9gEk6XlaqUSclaW11AZFG8cwyM2m4Xo6qtLfMsQM6zGjdYQrN3RyJ316UBrqOk4lhTEvvB3sbyAd9nUz3F-1k4yWJYzEZLjs1GheJj0fE4qTvses8SpIOe8zNQ', tag: 'Bom Tấn Mỗi Tuần' },
  { title: 'DUNE: PART TWO', description: 'The epic journey continues. Witness the breathtaking saga of power, faith, and destiny on the big screen.', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=1920', tag: 'Sắp Chiếu' },
];

const genres = ['Tất cả', 'Hành động', 'Tình cảm', 'Kinh dị', 'Hoạt hình'];

const LandingPage: React.FC = () => {
  const [activeGenre, setActiveGenre] = useState('Tất cả');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');

  const filteredMovies = activeGenre === 'Tất cả' ? moviesData : moviesData.filter((m) => m.genre === activeGenre);

  const nextSlide = useCallback(() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length), []);
  const prevSlide = useCallback(() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleNewsletter = (values: any) => {
    message.success(`Cảm ơn ${values.email} đã đăng ký!`);
    setEmail('');
  };

  // Kiểm tra đăng nhập và chuyển hướng
  const requireAuth = (action?: () => void) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      action?.();
    } else {
      window.location.href = '/auth/login';
    }
  };

  const handleBookTicket = () => requireAuth(() => message.info('Chức năng đặt vé đang phát triển'));
  const handlePromoDetail = () => requireAuth(() => message.info('Thông tin khuyến mãi chi tiết (yêu cầu đăng nhập)'));
  const handleMovieBooking = () => requireAuth(() => message.info('Chuyển đến trang đặt vé cho phim này'));

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
    <Layout style={{ background: styles.surface, minHeight: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
      {/* Header */}
      <Header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(32,14,12,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 48px', height: 'auto', lineHeight: 'normal' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Title level={3} style={{ margin: 0, color: styles.primary, fontWeight: 800, letterSpacing: '-0.02em' }}>KSTAR</Title>
            <Menu
              mode="horizontal"
              selectedKeys={['movies']}
              rootClassName="custom-menu-fix"
              style={{ 
                background:'rgba(255, 255, 255, 0.05)', 
                backdropFilter:'blur(15px)', 
                border:'1px solid rgba(255,255,255,0.1)', 
                padding:'4px 10px',
                minWidth:'350px', 
                justifyContent:'center',
                gap: '20px'
              }}
              items={[
                { key:'movies', label:<span style={{ fontSize: '15px' }}>PHIM</span> },
                { key:'cinemas', label:<span style={{ fontSize: '15px' }}>RẠP</span> },
                { key:'showtimes', label:<span style={{ fontSize: '15px' }}>XUẤT CHIẾU</span> }
              ]}
            />
            <style>{`
              .custom-menu-fix.ant-menu-horizontal { border: none !important; background: transparent !important; }
              .custom-menu-fix .ant-menu-item { color: #a0a0a0 !important; font-weight: 500; transition: all 0.3s ease !important; padding: 0 15px !important; }
              .custom-menu-fix .ant-menu-item:hover { color: #fff !important; }
              .custom-menu-fix .ant-menu-item::after { display: none !important; }
              .custom-menu-fix .ant-menu-item-selected { color: #fff !important; background-color: transparent !important; position: relative; }
              .custom-menu-fix .ant-menu-item-selected::before { content: ''; position: absolute; bottom: -1px; left: 20%; right: 20%; height: 3px; background: #ff1e00; border-radius: 999px; box-shadow: 0 0 10px #ff1e00; }
            `}</style>
          </div>
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(70,47,44,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 30, padding: '4px 12px', width: 240 }}>
              <SearchOutlined style={{ color: styles.onSurfaceVariant, fontSize: 20 }} />
              <Input placeholder="Search movies..." bordered={false} style={{ background: 'transparent', color: styles.onSurface }} />
            </div>
            <Badge dot><BellOutlined style={{ fontSize: 20, color: styles.onSurfaceVariant }} /></Badge>
            <Avatar src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRF4IdgLp8F-nDdjHWc9xLjzLWWVG3F4yITqFhwX4b2Ymyf-6nFpMKQZVCvcYGTvJEtLRNFNhPU6mboOm7iJ4CV81K37dMk1eHuMwFYE6z3D5xgh5RDJpYjobxQ1x-YggqVVHf8Y3rnV1t79A5L0cscetHKSJEdlfiAN8JEm3tzXW10GniieKjflmsaknop6urf9WAY8i1GPfxtWIfl1nW_sPGoorV1lLxBp5DC03fwEbEKLIYfAe9Wg1FqhcHxxe0gfFHkyJV1XI" style={{ border: `2px solid ${styles.primaryRed}` }} />
          </Space>
        </div>
      </Header>

      {/* Hero Section */}
      <div style={{ position: 'relative', height: 870, width: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroSlides[currentSlide].image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'all 0.7s' }} />
        <div style={{ position: 'absolute', inset: 0, ...styles.heroGradient, zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 64 }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'inline-block', background: styles.primaryRed, color: 'white', padding: '4px 16px', borderRadius: 20, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{heroSlides[currentSlide].tag}</div>
            <Title level={1} style={{ color: 'white', fontSize: 64, margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>{heroSlides[currentSlide].title}</Title>
            <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 18, marginTop: 16 }}>{heroSlides[currentSlide].description}</Paragraph>
            <Space size="middle">
              <Button 
                type="primary" 
                size="large" 
                className="custom-btn"
                icon={<TagOutlined />} 
                onClick={handleBookTicket} 
                style={{ background: styles.primaryRed, borderColor: styles.primaryRed, borderRadius: 40, fontWeight: 'bold', padding: '10px 40px', height: 48, display: 'inline-flex', alignItems: 'center' }}
              >
                Book Now
              </Button>
              <Button 
                size="large" 
                className="custom-btn"
                icon={<PlayCircleOutlined />} 
                style={{ background: 'rgba(70,47,44,0.4)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 40, color: 'white', padding: '10px 40px', height: 48, display: 'inline-flex', alignItems: 'center' }}
              >
                Watch Trailer
              </Button>
            </Space>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
          {heroSlides.map((_, idx) => (
            <div key={idx} onClick={() => setCurrentSlide(idx)} style={{ width: 12, height: 12, borderRadius: '50%', background: idx === currentSlide ? styles.primaryRed : 'rgba(255,255,255,0.4)', cursor: 'pointer' }} />
          ))}
        </div>
        <Button icon={<LeftOutlined />} onClick={prevSlide} shape="circle" size="large" style={{ position: 'absolute', left: 48, top: '50%', transform: 'translateY(-50%)', background: 'rgba(70,47,44,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
        <Button icon={<RightOutlined />} onClick={nextSlide} shape="circle" size="large" style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', background: 'rgba(70,47,44,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
      </div>

      {/* Movie Grid */}
      <Content style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <Title level={2} style={{ color: styles.onSurface, fontSize: 32 }}>Phim Nổi Bật</Title>
          <Space wrap>
            {genres.map((genre) => (
              <Button 
                key={genre} 
                shape="round" 
                onClick={() => setActiveGenre(genre)} 
                style={{ background: activeGenre === genre ? styles.primaryRed : styles.surfaceVariant, color: activeGenre === genre ? 'white' : styles.onSurfaceVariant, border: 'none', fontWeight: 600 }}
              >
                {genre}
              </Button>
            ))}
          </Space>
        </div>
        <Row gutter={[24, 24]}>
          {filteredMovies.map((movie) => (
            <Col xs={12} sm={8} md={6} lg={4} xl={4} key={movie.id}>
              <div className="movie-card-container" style={{ cursor: 'pointer', position: 'relative' }}>
                <div className="poster-wrapper" style={{ position: 'relative', aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.4s' }}>
                  <img src={movie.poster} alt={movie.title} className="movie-poster" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                  <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <StarFilled style={{ color: '#fadb14', fontSize: 12 }} />
                    <span style={{ color: 'white', fontSize: 12 }}>{movie.rating}</span>
                  </div>
                  <div className="movie-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: 'opacity 0.3s' }}>
                    <Button type="primary" danger shape="round" size="large" style={{ fontWeight: 'bold' }} onClick={handleMovieBooking}>Đặt vé</Button>
                  </div>
                </div>
                <Title level={5} style={{ color: styles.onSurface, marginTop: 8, marginBottom: 0 }}>{movie.title}</Title>
                <Text style={{ color: styles.onSurfaceVariant, fontSize: 12 }}>{movie.genre} • {movie.duration}</Text>
              </div>
            </Col>
          ))}
        </Row>
        <style>{`
          .movie-card-container:hover .movie-overlay { opacity: 1 !important; }
          .movie-card-container:hover .movie-poster { transform: scale(1.08); }
          .movie-card-container:hover .poster-wrapper { border-color: rgba(255,255,255,0.3) !important; }
        `}</style>
      </Content>

      {/* Promo Section */}
      <div style={{ background: styles.surfaceContainerLow, padding: '80px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Title level={2} style={{ color: styles.onSurface, marginBottom: 32 }}>Tin Tức Khuyến Mãi</Title>
          <Row gutter={[24, 24]}>
            {[
              { title: 'Trải Nghiệm IMAX Laser', desc: 'Nâng tầm trải nghiệm với công nghệ chiếu phim hàng đầu thế giới tại KSTAR.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGGdmdHPPj3IyRDhh-QGjeywcwrj8QieCG6ZHgFK3kff7yFa0GbXEaCDROZuPw3N_tWR00oU839_A7iSMita01Z_F_Be8-ZeUVDY3p2Xki0lQW_nHbwzjpmAL8RIK1HmHeN0qPH5KWQX0Ek6uZdeGFhAVuCXwEs4WcvdJVPq5R3F11XnqQ5zo7vOwlYCrPPliLlFFBydPRtxgnf8cHm9sbWEEfuv5yOO2fWnk-T9fVRW74CYqQ-P2V3A8xpRs4hem7yp8BKttJwN4' },
              { title: 'Ưu đãi Combo 50%', desc: 'Giảm giá cực sốc cho mọi Combo Bắp Nước khi đặt vé trực tuyến vào thứ 3 hàng tuần.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDryG2md-R4nKIOmXjeCL3zCG5Y91x5XC_XU1pUW8RSMwPShVF6Qfy9TABjo1Z6ZQdcVJ703G5HPDKEvnZpDwbiHiO5qH3iMCJh9oJiGLPGANpCPVo_bHboRYZ3yst01mPam4i7DJMpwKr6Cl2SfPg08ichfnFK8z0N9S2kz4XmDCukj_fMOWUrxorx44g_IcSppvSqTjgk6c_VRAC6ioR03vOAtzWnpojc8VQXILKZD5HWytJwVe2xKkRrBcj0aN7Lubxspq2OW6s' },
              { title: 'Vé Cú Đêm - Đồng giá 45k', desc: 'Ưu đãi đặc biệt cho các suất chiếu sau 22h mỗi tối. Chill phim khuya cực đã.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdkVhsQkC71OnomqxYsBjI_HQts3pBKVh9YB8dYjlVsUZLaE0nWyAFP_GxB4-Nh7GiBG3BYy_efM1okXVmxdbrX9sc1lCNFk7DDWD2Ubq9gsbfNpX2fRKyOVKmVUa3Ia3rU5NqytW7cX55BLCe_KRB9nn_xnXHJ_SJk2uHoNe3W5uHIHHvrX9-ozDb5OPIhZDJBFSyWmpEX3XFV27EHbLtPmb0mFeFILefNC0j4M27BCITxpfZz4awVQvKvjHn3cZ9RFZRttgTCGg' },
              { title: 'KSTAR Member Exclusive', desc: 'Đăng ký thành viên ngay để nhận vô vàn ưu đãi và tích điểm đổi quà không giới hạn.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIpX0wb_SVnLddHWQ6H6t5L1TKVj0eKg5m15G89hEbyYpjNt60ml9AhnD6w0jZg0zDMpdPw-2Fm4PV7ggbTZwXYYplirxh6JOp82ncSVzy3J0EWfOWcmyTRdOvwY7_Vysio6sDphCkbfAJ2vWOAGs3U4QmxgAm5nwwDH4HvfJfJfS60vBK4F3f1punNsHpTHHOrDmM94VxBk-D20uT2QVV6GXm3_boyOjknmDiigSe_K6OnakauVd6mWBomfEmeWpxngXuxhcO05o' }
            ].map((item, idx) => (
              <Col xs={24} sm={12} md={6} key={idx}>
                <div className="promo-card-container" style={{ ...styles.glassCard, padding: 16, height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.4s' }}>
                  <div style={{ overflow: 'hidden', borderRadius: 8, marginBottom: 16 }}>
                    <img src={item.img} alt={item.title} className="promo-img" style={{ width: '100%', height: 130, objectFit: 'cover', transition: 'transform 0.5s' }} />
                  </div>
                  <Title level={5} style={{ color: styles.onSurface, marginBottom: 8 }}>{item.title}</Title>
                  <Text style={{ color: styles.onSurfaceVariant, flex: 1 }}>{item.desc}</Text>
                  <Button type="link" style={{ color: styles.primary, paddingLeft: 0, marginTop: 16 }} icon={<ArrowRightOutlined />} onClick={handlePromoDetail}>Chi tiết</Button>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <style>{`
        .promo-card-container:hover { transform: translateY(-8px); box-shadow: 0 8px 24px rgba(0,0,0,0.2) !important; }
        .promo-card-container:hover .promo-img { transform: scale(1.1); }
      `}</style>

      {/* Contact & Newsletter */}
      <Content style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto' }}>
        <Row gutter={[64, 32]}>
          <Col xs={24} lg={12}>
            <Title level={2} style={{ color: styles.onSurface }}>Bạn cần hỗ trợ?</Title>
            <Paragraph style={{ color: styles.onSurfaceVariant, fontSize: 18 }}>Liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào về dịch vụ, đặt vé hoặc chương trình khuyến mãi.</Paragraph>
            <Space direction="vertical" size="middle">
              <Space size="middle">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: styles.surfaceVariant, display: 'flex', alignItems: 'center', justifyContent: 'center', color: styles.primary }}><PhoneOutlined style={{ fontSize: 24 }} /></div>
                <div><Text style={{ color: styles.onSurfaceVariant }}>Hotline 24/7</Text><br /><Text strong style={{ color: styles.onSurface, fontSize: 16 }}>1900 123 456</Text></div>
              </Space>
              <Space size="middle">
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: styles.surfaceVariant, display: 'flex', alignItems: 'center', justifyContent: 'center', color: styles.primary }}><MailOutlined style={{ fontSize: 24 }} /></div>
                <div><Text style={{ color: styles.onSurfaceVariant }}>Email hỗ trợ</Text><br /><Text strong style={{ color: styles.onSurface, fontSize: 16 }}>support@kstarcinema.vn</Text></div>
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <div style={{ ...styles.glassCard, padding: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -48, right: -48, width: 128, height: 128, background: 'rgba(255,180,170,0.1)', borderRadius: '50%', filter: 'blur(32px)' }} />
              <Title level={4} style={{ color: styles.onSurface }}>Đăng ký nhận tin</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant }}>Đừng bỏ lỡ các siêu phẩm và ưu đãi độc quyền. Đăng ký nhận tin ngay hôm nay!</Paragraph>
              <Form onFinish={handleNewsletter} layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
                <Form.Item name="email" rules={[{ required: true, type: 'email' }]} style={{ flex: 1, margin: 0 }}>
                  <Input placeholder="Địa chỉ email của bạn" style={{ borderRadius: 40, padding: '10px 20px', background: '#ffffff25' }} value={email} onChange={e => setEmail(e.target.value)} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit" style={{ background: styles.primaryRed, borderColor: styles.primaryRed, borderRadius: 40, padding: '0 32px', height: 44 }}>Đăng ký</Button>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Footer */}
      <Footer style={{ background: '#1a0908', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '48px 48px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} style={{ color: styles.primary, marginBottom: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>KSTAR</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant }}>Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang lại trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</Paragraph>
              <Space size="middle">
                <Button shape="circle" icon={<GlobalOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
                <Button shape="circle" icon={<VideoCameraOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
                <Button shape="circle" icon={<ShareAltOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurfaceVariant }} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary }}>Phim Đang Chiếu</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Phim Hành Động</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Phim Hoạt Hình</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Phim Kinh Dị</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Phim Việt Nam</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary }}>Thông Tin</Title>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>About Us</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Terms of Service</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>Privacy Policy</a></li>
                <li><a href="#" style={{ color: styles.onSurfaceVariant }}>FAQs</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: styles.primary }}>Tải Ứng Dụng</Title>
              <Paragraph style={{ color: styles.onSurfaceVariant }}>Nhận vé nhanh chóng qua app KSTAR Mobile.</Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button block icon={<AndroidOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurface, textAlign: 'left' }}>Google Play</Button>
                <Button block icon={<AppstoreOutlined />} style={{ background: styles.surfaceVariant, border: 'none', color: styles.onSurface, textAlign: 'left' }}>App Store</Button>
              </Space>
            </Col>
          </Row>
          <Divider style={{ background: 'rgba(255,255,255,0.05)', margin: '32px 0 24px' }} />
          <Text style={{ color: styles.onSurfaceVariant, display: 'block', textAlign: 'center' }}>© 2024 KSTAR Cinema. All Rights Reserved.</Text>
        </div>
      </Footer>

      {/* FAB */}
      <button onClick={handleBookTicket} style={{ position: 'fixed', bottom: 32, right: 32, width: 56, height: 56, borderRadius: '50%', background: styles.primaryRed, border: 'none', color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        <TagOutlined style={{ fontSize: 28 }} />
        <span style={{ position: 'absolute', right: '100%', marginRight: 8, background: styles.primary, color: '#410001', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 'bold', whiteSpace: 'nowrap', opacity: 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} className="tooltip-text">Book Tickets</span>
      </button>

      <style>{`
        button:hover .tooltip-text { opacity: 1; }
        .ant-menu-dark.ant-menu-horizontal > .ant-menu-item:hover { color: #ffb4aa; }
        .ant-btn-link:hover { color: #ffb4aa !important; }
      `}</style>
    </Layout>
  );
};

export default LandingPage;