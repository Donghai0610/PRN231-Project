import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav, Button } from "react-bootstrap";
import "../../CSS/Header.css";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { FaMoon, FaSun } from "react-icons/fa";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [greeting, setGreeting] = useState("");
  const [userId, setUserId] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const location = useLocation();

  const updateUserData = () => {
    const token = localStorage.getItem("token");
    const account = localStorage.getItem("account");

    if (token && account) {
      const decodedToken = jwtDecode(token);
      setIsLoggedIn(true);
      setUsername(account);
      setRole(decodedToken.role);
      setUserId(decodedToken.nameid);
    } else {
      setIsLoggedIn(false);
      setUsername("");
      setRole("");
      setUserId("");
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) {
      setGreeting("Chào buổi sáng");
    } else if (hour >= 11 && hour < 13) {
      setGreeting("Chào buổi trưa");
    } else if (hour < 18) {
      setGreeting("Chào buổi chiều");
    } else {
      setGreeting("Chào buổi tối");
    }
  };

  useEffect(() => {
    updateUserData();
    updateGreeting();

    const interval = setInterval(() => {
      updateGreeting();
      updateUserData();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Áp dụng dark mode cho toàn bộ trang web
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    Swal.fire({
      title: "Đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      background: isDarkMode ? '#1e1e1e' : '#ffffff',
      color: isDarkMode ? '#f1f1f1' : '#1a1a1a'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("account");
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    setUserId("");
  };




  const isActive = (path) => location.pathname === path ? 'active-tab' : '';

  return (
    <>
      <Container fluid className={`${darkMode ? 'bg-dark' : 'bg-black'}`}>
        <Row className="d-flex justify-content-between py-2 align-items-center">
          <Col xs="auto" className="text-white d-flex align-items-center">
            <Button
              variant={darkMode ? "light" : "dark"}
              size="sm"
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>
          </Col>
          {isLoggedIn ? (
            <Col className="text-right text-white Sig">
              <Link to={`/profile/${userId}`} className="text-white text-decoration-none">
                <span className="me-3 fancy-font">
                  {greeting}, {username}!
                </span>
              </Link>
              <Link
                to="#"
                onClick={handleLogout}
                className="text-white text-decoration-none"
              >
                <i className="bi bi-box-arrow-right"></i>
              </Link>
            </Col>
          ) : (
            <Col className="text-right Sig">
              <Link to="/login" className="text-white me-3">
                Đăng Nhập
              </Link>
              <Link to="/login" className="text-white">
                Đăng Ký
              </Link>
            </Col>
          )}
        </Row>
      </Container>

      <Navbar
        expand="lg"
        className={`${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-white'} border-bottom`}
        style={{ marginBottom: "0px" }}
      >
        <Container style={{ marginBottom: "0px" }}>
          <Navbar.Brand
            as={Link}
            to={"/"}
            className="d-flex align-items-center nav-image"
          >
            <img src="../assets/Logo/logo.png" alt="Movie 88" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="fw-bold fs-5 custom-nav">
              <Nav.Link
                href="/"
                className={isActive("/showtime")}
              >
                Trang Chủ
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={"/movie"}
                className={isActive("/movie")}
              >
                Phim
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={"/blog-review"}
                className={isActive("/blog-review")}
              >
                Blog
              </Nav.Link>
              {/* <Nav.Link
                as={Link}
                to={"/price"}
                className={isActive("/price")}
              >
                Diễn Viên
              </Nav.Link> */}
              {role === "Admin" && (
                <Button
                  variant="link"
                  id="admin-management-button"
                  className="nav-link"
                  as={Link}
                  to="/admin/dashboard"  // Chuyển hướng đến "/admin" khi nhấn vào button
                >
                  Quản Lý
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
