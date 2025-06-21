import React from "react";
import "../../static/style/footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <h2 className="footer-brand-title">Beverage</h2>
            <p className="footer-social-text">KẾT NỐI VỚI CHÚNG TÔI</p>
            <div className="footer-social-links">
              <Link to="#" className="social-link facebook">
                <FaFacebookF />
              </Link>
              <Link to="#" className="social-link twitter">
                <FaTwitter />
              </Link>
              <Link to="#" className="social-link youtube">
                <FaYoutube />
              </Link>
              <Link to="#" className="social-link instagram">
                <FaInstagram />
              </Link>
            </div>
          </div>

          {/* Company Info Section */}
          <div>
            <h3 className="footer-section-title">CÔNG TY</h3>
            <ul className="footer-list">
              <li>Số ĐKKD: 0123456789</li>
              <li>Địa chỉ: Học viện Công nghệ Bưu Chính Viễn Thông, Hà Nội</li>
              <li>Email: beverage24@vdt.vn</li>
              <li>Hotline: 1900 6750</li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h3 className="footer-section-title">VỀ CHÚNG TÔI</h3>
            <ul className="footer-list">
              <li>
                <Link to="#">Giới thiệu</Link>
              </li>
              <li>
                <Link to="#">Liên hệ</Link>
              </li>
              <li>
                <Link to="#">Tin tức</Link>
              </li>
              <li>
                <Link to="#">Hệ thống cửa hàng</Link>
              </li>
              <li>
                <Link to="#">Sản phẩm</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Section */}
          <div>
            <h3 className="footer-section-title">DỊCH VỤ KHÁCH HÀNG</h3>
            <ul className="footer-list">
              <li>
                <Link to="#">Kiểm tra đơn hàng</Link>
              </li>
              <li>
                <Link to="#">Chính sách đổi trả</Link>
              </li>
              <li>
                <Link to="#">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link to="#">Hỏi đáp thành viên</Link>
              </li>
              <li>
                <Link to="#">Đăng ký tài khoản</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">
            © 2025 Bevarage Ecommerce by Trọng. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
