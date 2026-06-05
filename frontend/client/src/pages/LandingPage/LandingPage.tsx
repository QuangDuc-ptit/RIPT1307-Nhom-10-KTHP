import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MovieCard from "@/components/common/MovieCard";
import { useAuthStore } from '@/store/auth';
import './LandingPage.css';

import {
  Row, Col, Typography, Space, Button, Input, Form, Divider, Modal
} from 'antd';
import {
  GlobalOutlined,
  VideoCameraOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

/* ================= MOCK DATA CHUẨN ================= */
const MOCK_MOVIES = [
  { id: 1, title: "Cục Vàng Của Ngoại", category: "dang-chieu", genre: "tinh-cam", image: "/movies/Cuc_Vang_Cua_Ngoai.jpg", rating: "9.2", age: "P" },
  { id: 2, title: "Phim: Mai", category: "dang-chieu", genre: "tinh-cam", image: "/movies/Mai.jpg", rating: "9.5", age: "T18" },
  { id: 3, title: "Mắt Biếc", category: "sap-chieu", genre: "tinh-cam", image: "/movies/Mat_Biec.jpg", rating: "Chưa chiếu", age: "T16" },
  { id: 4, title: "Nhà Bà Nữ", category: "sap-chieu", genre: "tinh-cam", image: "/movies/Nha_Ba_Nu.jpg", rating: "Chưa chiếu", age: "T16" },
  { id: 5, title: "Us", category: "dang-chieu", genre: "kinh-di", image: "/movies/Us.jpg", rating: "8.8", age: "T16" },
  { id: 6, title: "Your Name", category: "sap-chieu", genre: "hoat-hinh", image: "/movies/Your_Name.jpg", rating: "Chưa chiếu", age: "P" },
  { id: 7, title: "The Wild Robot", category: "dang-chieu", genre: "hoat-hinh", image: "/movies/The_Wild_Robot.jpg", rating: "8.8", age: "T16" },
  { id: 8, title: "Tiệc Trăng Máu", category: "sap-chieu", genre: "hanh-dong", image: "/movies/Tiec_Trang_Mau.jpg", rating: "Chưa chiếu", age: "P" },
  { id: 9, title: "Larva", category: "dang-chieu", genre: "hoat-hinh", image: "/movies/Larva.jpg", rating: "8.8", age: "T16" },
  { id: 10, title: "Doremon Bản Giao Hưởng Địa Cầu", category: "sap-chieu", genre: "hoat-hinh", image: "/movies/Ban_Giao_Huong.jpg", rating: "Chưa chiếu", age: "P" },
];

const MOCK_BLOGS = [
  { id: 1, title: "Top 10 phim được mong chờ nhất hè này", date: "26/05/2026", summary: "Khám phá những bom tấn điện ảnh hot nhất sắp ra mắt tại KSTAR.", image: "/banners/Su_kien1.png" },
  { id: 2, title: "Đồng giá vé chỉ từ 50K", date: "25/05/2026", summary: "Ưu đãi cực sốc dành riêng cho Thứ Tư vui vẻ.", image: "/banners/Su_kien2.png" },
  { id: 3, title: "IMAX có gì đặc biệt?", date: "24/05/2026", summary: "Trải nghiệm công nghệ hình ảnh và âm thanh sống động nhất.", image: "/banners/Su_kien3.png" },
  { id: 4, title: "Cú đêm săn vé", date: "23/05/2026", summary: "Đi 4 tính tiền 2 cho tất cả suất chiếu sau 22h.", image: "/banners/Su_kien4.png" },
];

const HERO_SLIDES = [
  {
    id: 1,
    title: "KSTAR Cinema",
    subtitle: "Khám phá thế giới điện ảnh sống động với công nghệ IMAX hiện đại.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Bom Tấn Mỗi Tuần",
    subtitle: "Cập nhật những bộ phim hot nhất tại hệ thống rạp KSTAR.",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Trải Nghiệm IMAX",
    subtitle: "Âm thanh đỉnh cao và hình ảnh sắc nét chưa từng có.",
    image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2070&auto=format&fit=crop",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [movieTab, setMovieTab] = useState<"dang-chieu" | "sap-chieu">("dang-chieu");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
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

  const filteredMovies = MOCK_MOVIES.filter((movie) => {
    const matchTab = movie.category === movieTab;
    const matchGenre = selectedGenre === "all" || movie.genre === selectedGenre;
    return matchTab && matchGenre;
  });

  const footerStyles = {
    surfaceVariant: '#462f2c',
    onSurfaceVariant: '#e9bcb6',
    primary: '#ff1e00',
    primaryRed: '#E50914'
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => scrollToSection("home")}>
          <h2>KSTAR</h2>
        </div>
        <nav className="navbar">
          <button onClick={() => scrollToSection("home")} className="nav-btn">Trang chủ</button>
          <button onClick={() => scrollToSection("movies")} className="nav-btn">Phim</button>
          <button onClick={() => scrollToSection("blog")} className="nav-btn">Tin tức</button>
          <button onClick={() => scrollToSection("contact")} className="nav-btn">Liên hệ</button>
          <Link
            to="/profile"
            className="nav-link-custom"
            onClick={(e) => handleProtectedAction(e, () => navigate("/profile"))}
          >
            Cá nhân
          </Link>
        </nav>
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
            letterSpacing: '0.5px',
            marginLeft: '16px',
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
      </header>

      {/* Marquee */}
      <div className="cinema-marquee">
        <div className="cinema-track">
          <div className="cinema-item">
            🔥 DEADLINE có thể đợi nhưng suất chiếu thì không • 🍿 Đặt vé ngay tại KSTAR Cinema • 🎞️ Thế giới điện ảnh đang chờ bạn •
          </div>
          <div className="cinema-item">
            🔥 DEADLINE có thể đợi nhưng suất chiếu thì không • 🍿 Đặt vé ngay tại KSTAR Cinema • 🎞️ Thế giới điện ảnh đang chờ bạn •
          </div>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="hero-section"
          key={currentSlide}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${HERO_SLIDES[currentSlide].image})`
          }}
        >
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
                <span
                  key={index}
                  className={currentSlide === index ? "dot active" : "dot"}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Movies Section */}
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
              <button className={`filter-btn ${selectedGenre === "hanh-dong" ? "active" : ""}`} onClick={() => setSelectedGenre("hanh-dong")}>Hành động</button>
              <button className={`filter-btn ${selectedGenre === "tinh-cam" ? "active" : ""}`} onClick={() => setSelectedGenre("tinh-cam")}>Tình cảm</button>
              <button className={`filter-btn ${selectedGenre === "hoat-hinh" ? "active" : ""}`} onClick={() => setSelectedGenre("hoat-hinh")}>Hoạt hình</button>
              <button className={`filter-btn ${selectedGenre === "kinh-di" ? "active" : ""}`} onClick={() => setSelectedGenre("kinh-di")}>Kinh dị</button>
            </div>
          </div>
          <div className="movie-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onBook={(e) => handleProtectedAction(e, () => navigate(`/movie/${movie.id}`))}
                />
              ))
            ) : (
              <div className="no-results">Không tìm thấy phim phù hợp với bộ lọc hiện tại.</div>
            )}
          </div>
          <div className="more-movies-action">
            <button className="btn-view-more" onClick={(e) => handleProtectedAction(e, () => alert("Tải thêm dữ liệu phim..."))}>Xem thêm phim</button>
          </div>
        </section>

        {/* Blog Section */}
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
                  <Link
                    to={`/blog/${blog.id}`}
                    className="blog-more"
                    onClick={(e) => handleProtectedAction(e, () => navigate(`/blog/${blog.id}`))}
                  >
                    Đọc tiếp →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contact Section */}
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

      {/* Footer */}
      <footer style={{ background: '#110706', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '56px 48px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} md={6}>
              <Title level={4} style={{ color: footerStyles.primary, marginBottom: 20, fontWeight: 800, fontSize: '24px' }}>KSTAR</Title>
              <Paragraph style={{ color: footerStyles.onSurfaceVariant, fontSize: 14, lineHeight: 1.6 }}>Hệ thống rạp chiếu phim hiện đại hàng đầu Việt Nam, mang lại trải nghiệm điện ảnh chân thực và đẳng cấp nhất.</Paragraph>
              <Space size="middle">
                <Button shape="circle" icon={<GlobalOutlined />} style={{ background: footerStyles.surfaceVariant, border: 'none', color: footerStyles.onSurfaceVariant }} />
                <Button shape="circle" icon={<VideoCameraOutlined />} style={{ background: footerStyles.surfaceVariant, border: 'none', color: footerStyles.onSurfaceVariant }} />
                <Button shape="circle" icon={<ShareAltOutlined />} style={{ background: footerStyles.surfaceVariant, border: 'none', color: footerStyles.onSurfaceVariant }} />
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: footerStyles.primary, marginBottom: 20, fontWeight: 600 }}>Chăm sóc khách hàng</Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>FAQs</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>Terms of Service</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>Privacy Policy</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>Contact Us</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: footerStyles.primary, marginBottom: 20, fontWeight: 600 }}>Về chúng tôi</Title>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>About Us</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>Careers</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>Membership</a></li>
                <li style={{ marginBottom: 12 }}><a href="#" style={{ color: footerStyles.onSurfaceVariant }}>Cinemas</a></li>
              </ul>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: footerStyles.primary, marginBottom: 20, fontWeight: 600 }}>Đăng ký bản tin</Title>
              <Paragraph style={{ color: footerStyles.onSurfaceVariant, fontSize: 13 }}>Nhận thông báo về các bộ phim bom tấn và ưu đãi mới nhất.</Paragraph>
              <Form layout="inline" style={{ flexWrap: 'wrap', gap: 12 }}>
                <Form.Item name="email" style={{ flex: 1, margin: 0 }}>
                  <Input placeholder="Email của bạn" style={{ borderRadius: 40, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff' }} />
                </Form.Item>
                <Form.Item style={{ margin: 0 }}>
                  <Button type="primary" htmlType="submit" style={{ background: footerStyles.primaryRed, borderColor: footerStyles.primaryRed, borderRadius: 40, height: 44, padding: '0 20px' }}>Gửi</Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Divider style={{ background: 'rgba(255,255,255,0.05)', margin: '40px 0 24px' }} />
          <Text style={{ color: footerStyles.onSurfaceVariant, display: 'block', textAlign: 'center', fontSize: '13px' }}>© 2024 KSTAR Cinema. All Rights Reserved.</Text>
        </div>
      </footer>

      {/* Modal yêu cầu đăng nhập (nền đen, 2 nút) */}
      <Modal
        open={showLoginModal}
        footer={null}
        closable={false}
        centered
        width={480}
        styles={{
          content: {
            background: '#0f0f0f',
            borderRadius: 20,
            padding: 0,
            boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(229,9,20,0.3) inset',
            border: 'none',
          },
          body: {
            background: '#0f0f0f',
            borderRadius: 20,
            padding: '32px 24px',
          }
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 48, display: 'block' }}>🎬</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#ffffff' }}>
            Yêu cầu đăng nhập để thực hiện tiếp
          </div>
          <div style={{ fontSize: 15, color: '#b0b0b0', marginBottom: 28, lineHeight: 1.5 }}>
            Vui lòng đăng nhập để tiếp tục thao tác.
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button
              onClick={handleCancel}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 24px',
                borderRadius: 40,
                color: '#e0e0e0',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Quay lại
            </button>
            <button
              onClick={handleLoginNow}
              style={{
                background: '#E50914',
                border: 'none',
                padding: '8px 28px',
                borderRadius: 40,
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(229,9,20,0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff1e2e';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E50914';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;