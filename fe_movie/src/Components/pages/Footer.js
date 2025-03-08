import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#222", color: "#fff", padding: "40px 0" }}>
      <div style={{ display: "flex", justifyContent: "center", maxWidth: "1000px", margin: "0 auto", flexWrap: "wrap" }}>
        {/* Cột 1: Thông tin liên hệ */}
        <div style={{ flex: 1, minWidth: "250px", textAlign: "center", padding: "10px" }}>
          <h3>Hi-Movie</h3>
          <p>Địa chỉ: 123 Đường Điện Biên Phủ, Quận 1, TP.HCM</p>
          <p>Điện thoại: <a href="tel:0123456789" style={{ color: "#ffc107" }}>0123 456 789</a></p>
          <p>Email: <a href="mailto:contact@himovie.com" style={{ color: "#ffc107" }}>contact@himovie.com</a></p>
        </div>

        {/* Cột 2: Dịch vụ */}
        <div style={{ flex: 1, minWidth: "250px", textAlign: "center", padding: "10px" }}>
          <h3>Dịch vụ</h3>
          <p>Xem phim trực tuyến</p>
          <p>Chất lượng Full HD, 4K</p>
          <p>Kho phim phong phú</p>
          <p>Hỗ trợ đa nền tảng</p>
        </div>

        {/* Cột 3: Mạng xã hội */}
        <div style={{ flex: 1, minWidth: "250px", textAlign: "center", padding: "10px" }}>
          <h3>Kết nối với chúng tôi</h3>
          <p>
            <a href="#" style={{ color: "#ffc107", marginRight: "10px" }}>Facebook</a>
            <a href="#" style={{ color: "#ffc107", marginRight: "10px" }}>Instagram</a>
            <a href="#" style={{ color: "#ffc107", marginRight: "10px" }}>YouTube</a>
            <a href="#" style={{ color: "#ffc107" }}>Twitter</a>
          </p>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>&copy; {new Date().getFullYear()} Hi-Movie. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
