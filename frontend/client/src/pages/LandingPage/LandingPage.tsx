import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MovieCard from "@/components/common/MovieCard";
import { useAuthStore } from '@/store/auth';
import './LandingPage.css';
import {
  Row, Col, Typography, Space, Button, Input, Form, Divider, Modal, Layout, Menu, Badge, Avatar, Dropdown
} from 'antd';
import {
  GlobalOutlined,
  VideoCameraOutlined,
  ShareAltOutlined,
  SearchOutlined,
  BellOutlined,
} from '@ant-design/icons';
// 🟢 IMPORT KHO DỮ LIỆU TỔNG
import { moviesData } from '@/api/movies';

const { Title, Paragraph, Text } = Typography;

const MOCK_BLOGS = [
  { id: 1, title: "Top 10 phim được mong chờ nhất hè này", date: "26/05/2026", summary: "Khám phá những bom tấn điện ảnh hot nhất sắp ra mắt tại KSTAR.", image: "/banners/Su_kien1.png" },
  { id: 2, title: "Đồng giá vé chỉ từ 50K", date: "25/05/2026", summary: "Ưu đãi cực sốc dành riêng cho Thứ Tư vui vẻ.", image: "/banners/Su_kien2.png" },
  { id: 3, title: "IMAX có gì đặc biệt?", date: "24/05/2026", summary: "Trải nghiệm công nghệ hình ảnh và âm thanh sống động nhất.", image: "/banners/Su_kien3.png" },
  { id: 4, title: "Cú đêm săn vé", date: "23/05/2026", summary: "Đi 4 tính tiền 2 cho tất cả suất chiếu sau 22h.", image: "/banners/Su_kien4.png" },
];

const HERO_SLIDES = [
  { id: 1, title: "KSTAR Cinema", subtitle: "Khám phá thế giới điện ảnh sống động với công nghệ IMAX hiện đại.", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1974&auto=format&fit=crop" },
  { id: 2, title: "Bom Tấn Mỗi Tuần", subtitle: "Cập nhật những bộ phim hot nhất tại hệ thống rạp KSTAR.", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop" },
  { id: 3, title: "Trải Nghiệm IMAX", subtitle: "Âm thanh đỉnh cao và hình ảnh sắc nét chưa từng có.", image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2070&auto=format&fit=crop" },
];

const { Header } = Layout;

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [movieTab, setMovieTab] = useState<"dang-chieu" | "sap-chieu">("dang-chieu");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  const user = useAuthStore((s: any) => s.user);
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const requireAuth = (callback: () => void) => {
    if (!isLoggedIn) {
      setPendingAction(() => callback);
      setShowLoginModal(true);
    } else {
      callback();
    }
  };

  const handleProtectedAction = (e: SyntheticEvent, callback: () => void) => {
    e.preventDefault();
    requireAuth(callback);
  };

  const handleLoginNow = () => {
    setShowLoginModal(false);
    navigate('/auth/login');
  };

  const handleCancel = () => {
    setShowLoginModal(false);
    setPendingAction(null);
  };

  // 🚀 LỌC DỮ LIỆU TỪ KHO API TỔNG (moviesData)
  const filteredMovies = moviesData.filter((movie: any) => {
    const matchTab = movie.category === movieTab;
    const matchGenre = selectedGenre === "all" || (movie.genre && movie.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchTab && matchGenre;
  });

  const footerStyles = {
    surfaceVariant: '#462f2c',
    onSurfaceVariant: '#e9bcb6',
    primary: '#ff1e00',
    primaryRed: '#E50914',
    surface: '#200e0c',
    onSurface: '#ffdad5'
  };

  const menuItems = [
    { key: 'home', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: '#fff', fontWeight: 600 }}>Trang chủ</span>, onClick: () => scrollToSection('home') },
    { key: 'movies', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: footerStyles.onSurfaceVariant }}>Phim</span>, onClick: () => scrollToSection('movies') },
    { key: 'blog', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: footerStyles.onSurfaceVariant }}>Tin tức</span>, onClick: () => scrollToSection('blog') },
    { key: 'contact', label: <span style={{ fontSize: '15px', transition: 'color 0.3s', color: footerStyles.onSurfaceVariant }}>Liên hệ</span>, onClick: () => scrollToSection('contact') },
  ];

  return (
    <>
      {/* Header */}
      <Header
        style={{
          position: 'sticky', top: 0, zIndex: 1000,
          background: 'rgba(24, 10, 8, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          padding: '1rem 48px', height: 'auto', lineHeight: 'normal', transition: 'all 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            <Title level={3} onClick={() => scrollToSection("home")} style={{ margin: 0, color: footerStyles.primary, fontWeight: 800, letterSpacing: '-0.02em', fontSize: '28px', textShadow: '0 2px 10px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
              KSTAR
            </Title>
            <Menu mode="horizontal" selectedKeys={['home']} style={{ background: 'transparent', border: 'none', minWidth: 360, lineHeight: 'normal' }} items={menuItems} />
          </div>
          
          <Space size="large">
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 40, padding: '6px 20px', width: 260, boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2)', transition: 'all 0.3s ease' }}>
              <SearchOutlined style={{ color: footerStyles.onSurfaceVariant, fontSize: 18 }} />
              <Input placeholder="Tìm phim..." bordered={false} style={{ background: 'transparent', color: footerStyles.onSurface, marginLeft: 8 }} />
            </div>
            
            {isLoggedIn ? (
              <>
                <Badge dot offset={[2, 0]}>
                  <BellOutlined style={{ fontSize: 22, color: footerStyles.onSurfaceVariant, cursor: 'pointer', transition: 'transform 0.3s ease' }} />
                </Badge>
                <Avatar 
                  src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuCs1hn6nDRgKqiNDwmEKBKHUjkw4Idae_YTNR6hF_Hz2VtFL1dIgaTw0lE_v6mBr2Wq-oIeiahjrVQ2KTCnAFu5Y_b9l05sZA4FA9bLEDBzoXl16aZiR40jis_t0XpX8E1tmlwUd3mtKTDYKIZPUnyeDaWbVV7K38FN1DvhkkOdhre-qNgWkobUaGgIss0U30Bs_XBVdfbtyY1qr7txJah7MnZNmhc9jJOS3u0cTYRTH9LdSeqwiXPnzbIpExYqscFtqVH6LPvFmhQ"} 
                  style={{ border: `2px solid ${footerStyles.primaryRed}`, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.4)', transition: 'transform 0.3s ease' }} 
                  onClick={() => navigate('/profile')}
                />
              </>
            ) : (
              <button
                onClick={() => navigate('/auth/login')}
                style={{
                  background: 'linear-gradient(135deg, #E50914 0%, #b2070f 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '8px 24px',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 4px 12px rgba(229, 9, 20, 0.3)',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ff1e2e 0%, #d40a14 100%)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(229, 9, 20, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #E50914 0%, #b2070f 100%)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(229, 9, 20, 0.3)';
                }}
              >
                Đăng nhập
              </button>
            )}
          </Space>
        </div>
      </Header>

      <div className="cinema-marquee">
        <div className="cinema-track">
          <div className="cinema-item">🔥 DEADLINE có thể đợi nhưng suất chiếu thì không • 🍿 Đặt vé ngay tại KSTAR Cinema • 🎞️ Thế giới điện ảnh đang chờ bạn •</div>
          <div className="cinema-item">🔥 DEADLINE có thể đợi nhưng suất chiếu thì không • 🍿 Đặt vé ngay tại KSTAR Cinema • 🎞️ Thế giới điện ảnh đang chờ bạn •</div>
        </div>
      </div>

      <main>
        <section id="home" className="hero-section" key={currentSlide} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${HERO_SLIDES[currentSlide].image})` }}>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <span className="hero-tag">CHÀO MỪNG ĐẾN VỚI</span>
            <h1 className="hero-title">{HERO_SLIDES[currentSlide].title}</h1>
            <p className="hero-description">{HERO_SLIDES[currentSlide].subtitle}</p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToSection("movies")}>🎟 Xem ngay</button>
              <button className="btn-secondary" onClick={(e) => handleProtectedAction(e, () => scrollToSection("blog"))}>🍿 Khuyến mãi</button>
            </div>
            <div className="hero-dots">
              {HERO_SLIDES.map((_, index) => (
                <span key={index} className={currentSlide === index ? "dot active" : "dot"} onClick={() => setCurrentSlide(index)} />
              ))}
            </div>
          </div>
        </section>

        <section id="movies" className="movies-section">
          <div className="section-header">
            <div className="section-title-row">
              <h2>Phim nổi bật</h2>
              <div className="tab-buttons">
                <button className={`tab-btn ${movieTab === "dang-chieu" ? "active" : ""}`} onClick={() => setMovieTab("dang-chieu")}>Đang Chiếu</button>
                <button className={`tab-btn ${movieTab === "sap-chieu" ? "active" : ""}`} onClick={() => setMovieTab("sap-chieu")}>Sắp Chiếu</button>
              </div>
            </div>
            <div className="filter-container">
              <span className="filter-label">Thể loại:</span>
              <button className={`filter-btn ${selectedGenre === "all" ? "active" : ""}`} onClick={() => setSelectedGenre("all")}>Tất cả</button>
              <button className={`filter-btn ${selectedGenre === "Hành động" ? "active" : ""}`} onClick={() => setSelectedGenre("Hành động")}>Hành động</button>
              <button className={`filter-btn ${selectedGenre === "Tình cảm" ? "active" : ""}`} onClick={() => setSelectedGenre("Tình cảm")}>Tình cảm</button>
              <button className={`filter-btn ${selectedGenre === "Hoạt hình" ? "active" : ""}`} onClick={() => setSelectedGenre("Hoạt hình")}>Hoạt hình</button>
              <button className={`filter-btn ${selectedGenre === "Kinh dị" ? "active" : ""}`} onClick={() => setSelectedGenre("Kinh dị")}>Kinh dị</button>
            </div>
          </div>
          <div className="movie-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie: any) => (
                <MovieCard 
                  key={movie.id} 
                  movie={{...movie, image: movie.poster}} // Gắn trường poster vào props image để khớp với thẻ MovieCard
                  onBook={(e: any) => handleProtectedAction(e, () => navigate(`/movie/${movie.id}`))} 
                />
              ))
            ) : (
              <div className="no-results">Không tìm thấy phim phù hợp với bộ lọc hiện tại.</div>
            )}
          </div>
          <div className="more-movies-action">
            <Button type="primary" size="large" style={{ background: footerStyles.primaryRed, borderRadius: 40, fontWeight: 'bold' }} onClick={() => navigate("/home")}>Vào trang chủ chính</Button>
          </div>
        </section>

        <section id="blog" className="blog-section">
          <div className="section-header"><h2>Tin tức</h2></div>
          <div className="blog-grid">
            {MOCK_BLOGS.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-thumb"><img src={blog.image} alt={blog.title} /></div>
                <div className="blog-content">
                  <span className="blog-date">{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.summary}</p>
                  <Link to={`/blog/${blog.id}`} className="blog-more" onClick={(e) => handleProtectedAction(e, () => navigate(`/blog/${blog.id}`))}>Đọc tiếp →</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Liên hệ</h2>
              <ul>
                <li><strong>Địa chỉ:</strong> Tầng 5, Tòa nhà KSTAR, Hà Nội</li>
                <li><strong>Hotline:</strong> 1900 xxxx (8:00 - 22:00)</li>
              </ul>
            </div>
            <div className="contact-form-box">
              <h3>Đăng ký nhận khuyến mãi</h3>
              <p>Đừng bỏ lỡ các suất chiếu sớm hot nhất tại rạp</p>
              <form className="subscribe-form" onSubmit={(e) => handleProtectedAction(e, () => alert("Đăng ký thành công!"))}>
                <input type="email" placeholder="Nhập email của bạn..." required />
                <button type="submit">Đăng ký</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer giữ nguyên */}
      <footer style={{ background: '#110706', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '56px 48px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} style={{ color: footerStyles.primary, marginBottom: 20, fontWeight: 800, fontSize: '24px' }}>KSTAR</Title>
              <Paragraph style={{ color: footerStyles.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang lại trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</Paragraph>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 20 }}>Chăm sóc khách hàng</Title>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 20 }}>Về chúng tôi</Title>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 20 }}>Đăng ký bản tin</Title>
              <Form layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
                <Form.Item name="email" style={{ flex: 1, margin: 0 }}>
                  <Input placeholder="Email của bạn" style={{ borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit" style={{ background: footerStyles.primaryRed, border: 'none', borderRadius: 40 }}>Gửi</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </footer>

      {/* Modal yêu cầu đăng nhập */}
      <Modal open={showLoginModal} footer={null} closable={false} centered width={480} styles={{ content: { background: '#0f0f0f', borderRadius: 20, padding: 0 }, body: { padding: '32px 24px' } }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#ffffff' }}>Yêu cầu đăng nhập để thực hiện tiếp</div>
          <div style={{ fontSize: 15, color: '#b0b0b0', marginBottom: 28, lineHeight: 1.5 }}>Vui lòng đăng nhập để tiếp tục thao tác.</div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={handleCancel} style={{ background: 'rgba(255,255,255,0.08)', color: '#e0e0e0', padding: '8px 24px', borderRadius: 40, border: 'none', cursor: 'pointer' }}>Quay lại</button>
            <button onClick={handleLoginNow} style={{ background: '#E50914', color: '#fff', padding: '8px 28px', borderRadius: 40, border: 'none', cursor: 'pointer' }}>Đăng nhập ngay</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;