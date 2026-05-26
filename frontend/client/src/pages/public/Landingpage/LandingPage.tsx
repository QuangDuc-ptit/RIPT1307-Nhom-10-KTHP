import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import MovieCard from "./components/MovieCard";
import "./LandingPage.css";

/* ================= IMPORT IMAGES ================= */
import imgCucVang from "../../../assets/images/Cuc_Vang_Cua_Ngoai.jpg";
import imgMai from "../../../assets/images/Mai.jpg";
import imgMatBiec from "../../../assets/images/Mat_Biec.jpg";
import imgNhaBaNu from "../../../assets/images/Nha_Ba_Nu.jpg";
import imgUs from "../../../assets/images/Us.jpg";
import imgYourName from "../../../assets/images/Your_Name.jpg";
import imgTheWildRobot from "../../../assets/images/The_Wild_Robot.jpg";
import imgTiecTrangMau from "../../../assets/images/Tiec_Trang_Mau.jpg";
import imgLarva from "../../../assets/images/Larva.jpg";
import imgBanGiaoHuong from "../../../assets/images/Ban_Giao_Huong.jpg";

import imgSu_kien4 from "../../../assets/images/su_kien4.png";
import imgSu_kien3 from "../../../assets/images/su_kien3.png";
import imgSu_kien2 from "../../../assets/images/su_kien2.png";
import imgSu_kien from "../../../assets/images/su_kien1.png";

/* ================= MOCK DATA PHIM BỔ SUNG THỂ LOẠI ================= */
const MOCK_MOVIES = [
  { id: 1, title: "Cục Vàng Của Ngoại", category: "dang-chieu", genre: "tinh-cam", image: imgCucVang, rating: "9.2", age: "P" },
  { id: 2, title: "Phim: Mai", category: "dang-chieu", genre: "tinh-cam", image: imgMai, rating: "9.5", age: "T18" },
  { id: 3, title: "Mắt Biếc", category: "sap-chieu", genre: "tinh-cam", image: imgMatBiec, rating: "Chưa chiếu", age: "T16" },
  { id: 4, title: "Nhà Bà Nữ", category: "sap-chieu", genre: "tinh-cam", image: imgNhaBaNu, rating: "Chưa chiếu", age: "T16" },
  { id: 5, title: "Us", category: "dang-chieu", genre: "kinh-di", image: imgUs, rating: "8.8", age: "T16" },
  { id: 6, title: "Your Name", category: "sap-chieu", genre: "hoat-hinh", image: imgYourName, rating: "Chưa chiếu", age: "P" },
  { id: 7, title: "The Wild Robot", category: "dang-chieu", genre: "hoat-hinh", image: imgTheWildRobot, rating: "8.8", age: "T16" },
  { id: 8, title: "Tiệc Trăng Máu", category: "sap-chieu", genre: "hanh-dong", image: imgTiecTrangMau, rating: "Chưa chiếu", age: "P" },
  { id: 9, title: "Larva", category: "dang-chieu", genre: "hoat-hinh", image: imgLarva, rating: "8.8", age: "T16" },
  { id: 10, title: "Doremon Bản Giao Hưởng Địa Cầu", category: "sap-chieu", genre: "hoat-hinh", image: imgBanGiaoHuong, rating: "Chưa chiếu", age: "P" },
];

const MOCK_BLOGS = [
  { id: 1, title: "Top 10 phim được mong chờ nhất hè này", date: "26/05/2026", summary: "Khám phá những bom tấn điện ảnh hot nhất sắp ra mắt tại KSTAR.", image: imgSu_kien },
  { id: 2, title: "Đồng giá vé chỉ từ 50K", date: "25/05/2026", summary: "Ưu đãi cực sốc dành riêng cho Thứ Tư vui vẻ.", image: imgSu_kien2 },
  { id: 3, title: "IMAX có gì đặc biệt?", date: "24/05/2026", summary: "Trải nghiệm công nghệ hình ảnh và âm thanh sống động nhất.", image: imgSu_kien3 },
  { id: 4, title: "Cú đêm săn vé", date: "23/05/2026", summary: "Đi 4 tính tiền 2 cho tất cả suất chiếu sau 22h.", image: imgSu_kien4 },
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
  const [movieTab, setMovieTab] = useState<"dang-chieu" | "sap-chieu">("dang-chieu");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const isLoggedIn = false; // Mock Auth State quản lý đăng nhập

  /* ================= TỰ ĐỘNG CHUYỂN SLIDE ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ================= CUỘN TRANG MƯỢT MÀ ================= */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ================= GUARD ACTION BẮT ĐĂNG NHẬP ================= */
  const handleProtectedAction = (e: React.SyntheticEvent, callback: () => void) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      callback();
    }
  };

  /* ================= LỌC PHIM ĐA ĐIỀU KIỆN ================= */
  const filteredMovies = MOCK_MOVIES.filter((movie) => {
    const matchTab = movie.category === movieTab;
    const matchGenre = selectedGenre === "all" || movie.genre === selectedGenre;
    return matchTab && matchGenre;
  });

  return (
    <>
      {/* ================= HEADER ================= */}
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

        <div className="header-actions">
          <Link to="/auth/login">
            <button className="btn-login">Đăng nhập</button>
          </Link>
        </div>
      </header>

      {/* ================= MARQUEE ================= */}
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
        {/* ================= HERO SECTION ================= */}
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
            <span className="hero-tag">🎬 CHÀO MỪNG ĐẾN VỚI</span>
            <h1 className="hero-title">{HERO_SLIDES[currentSlide].title}</h1>
            <p className="hero-description">{HERO_SLIDES[currentSlide].subtitle}</p>

            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollToSection("movies")}>
                🎟 Xem ngay
              </button>
              <button className="btn-secondary" onClick={(e) => handleProtectedAction(e, () => scrollToSection("blog"))}>
                🍿 Khuyến mãi
              </button>
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

        {/* ================= MOVIES SECTION (CẢI TIẾN LỌC VÀ XEM THÊM) ================= */}
        <section id="movies" className="movies-section">
          <div className="section-header">
            <div className="section-title-row">
              <h2>Phim nổi bật</h2>
              
              {/* Tab Đang chiếu / Sắp Chiếu */}
              <div className="tab-buttons">
                <button
                  className={`tab-btn ${movieTab === "dang-chieu" ? "active" : ""}`}
                  onClick={() => setMovieTab("dang-chieu")}
                >
                  Đang Chiếu
                </button>
                <button
                  className={`tab-btn ${movieTab === "sap-chieu" ? "active" : ""}`}
                  onClick={() => setMovieTab("sap-chieu")}
                >
                  Sắp Chiếu
                </button>
              </div>
            </div>

            {/* Thanh lọc thể loại phim mới */}
            <div className="filter-container">
              <span className="filter-label">Thể loại:</span>
              <button className={`filter-btn ${selectedGenre === "all" ? "active" : ""}`} onClick={() => setSelectedGenre("all")}>Tất cả</button>
              <button className={`filter-btn ${selectedGenre === "hanh-dong" ? "active" : ""}`} onClick={() => setSelectedGenre("hanh-dong")}>Hành động</button>
              <button className={`filter-btn ${selectedGenre === "tinh-cam" ? "active" : ""}`} onClick={() => setSelectedGenre("tinh-cam")}>Tình cảm</button>
              <button className={`filter-btn ${selectedGenre === "hoat-hinh" ? "active" : ""}`} onClick={() => setSelectedGenre("hoat-hinh")}>Hoạt hình</button>
              <button className={`filter-btn ${selectedGenre === "kinh-di" ? "active" : ""}`} onClick={() => setSelectedGenre("kinh-di")}>Kinh dị</button>
            </div>
          </div>

          {/* Lưới danh sách thẻ phim */}
          <div className="movie-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onBook={(e) =>
                    handleProtectedAction(e, () => navigate(`/movie/${movie.id}`))
                  }
                />
              ))
            ) : (
              <div className="no-results">Không tìm thấy phim phù hợp với bộ lọc hiện tại.</div>
            )}
          </div>

          {/* Nút hành động xem thêm yêu cầu đăng nhập */}
          <div className="more-movies-action">
            <button 
              className="btn-view-more" 
              onClick={(e) => handleProtectedAction(e, () => alert("Tải thêm dữ liệu phim..."))}
            >
              Xem thêm phim
            </button>
          </div>
        </section>

        {/* ================= BLOG SECTION ================= */}
        <section id="blog" className="blog-section">
          <div className="section-header">
            <h2>Tin tức</h2>
          </div>

          <div className="blog-grid">
            {MOCK_BLOGS.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-thumb">
                  <img src={blog.image} alt={blog.title} />
                </div>
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

        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="contact-section">
          <div className="contact-container">
            <div className="contact-info">
              <h2>Liên hệ</h2>
              <ul>
                <li>📍 <strong>Địa chỉ:</strong> Tầng 5, Tòa nhà KSTAR, Hà Nội</li>
                <li>📞 <strong>Hotline:</strong> 1900 xxxx (8:00 - 22:00)</li>
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

      <Footer />

      {/* ================= AUTH MODAL ================= */}
      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAuthModal(false)}>×</button>
            <h3>Yêu cầu đăng nhập 🔒</h3>
            <p>Vui lòng đăng nhập tài khoản KSTAR để trải nghiệm đầy đủ các tính năng.</p>
            <div className="modal-actions">
              <button className="btn-modal-close" onClick={() => setShowAuthModal(false)}>Để sau</button>
              <button className="btn-modal-login" onClick={() => navigate("/auth/login")}>Đăng nhập ngay</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingPage;