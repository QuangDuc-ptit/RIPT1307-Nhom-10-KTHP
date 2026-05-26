import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Cột 1: Thương hiệu & Mô tả */}
        <div className="footer-column">
          <h2>
            {/* Dùng icon máy quay phim gần giống hình ảnh thiết kế của bạn */}
            <span style={{ fontSize: '20px' }}>📹</span> KSTAR
          </h2>
          <p>
            Điểm đến lý tưởng dành cho những người yêu điện ảnh.
            Trải nghiệm chất lượng rạp chiếu tốt nhất và đặt vé dễ
            dàng chỉ với vài thao tác.
          </p>
          <div className="social-icons">
            <span>🌐</span>
            <span>🌐</span>
            <span>✉️</span>
          </div>
        </div>

        {/* Cột 2: Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>
          <a href="#movies">Tất cả phim</a>
          <a href="#home">Hệ thống rạp</a>
          <a href="#blog">Khuyến mãi</a>
          <a href="#contact">Ưu đãi</a>
        </div>

        {/* Cột 3: Chăm sóc khách hàng */}
        <div className="footer-column">
          <h3>Chăm sóc khách hàng</h3>
          <a href="#">Trung tâm trợ giúp</a>
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản dịch vụ</a>
          <a href="#">Chính sách hoàn tiền</a>
        </div>

        {/* Cột 4: Nút Tải ứng dụng (Màu nền nút đã chỉnh trong CSS) */}
        <div className="footer-column">
          <h3>Tải ứng dụng</h3>
          
          <button className="app-btn">
            <span className="app-icon">🤖</span>
            <div className="app-btn-text">
              <small>TẢI TRÊN</small>
              <p>Google Play</p>
            </div>
          </button>

          <button className="app-btn">
            <span className="app-icon">🍏</span>
            <div className="app-btn-text">
              <small>TẢI TRÊN</small>
              <p>App Store</p>
            </div>
          </button>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} KStar Cinema. Mọi quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;