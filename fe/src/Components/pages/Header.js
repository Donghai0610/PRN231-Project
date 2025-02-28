import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Container, Row, Col, Navbar, Nav, Dropdown } from "react-bootstrap";
import "../../CSS/Header.css";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [greeting, setGreeting] = useState("");
  const [userId, setUserId] = useState("");
  const location = useLocation();

  const updateUserData = () => {
    const sessionUser = JSON.parse(sessionStorage.getItem("account"));
    const localUser = JSON.parse(localStorage.getItem("rememberedAccount"));

    if (sessionUser) {
      setIsLoggedIn(true);
      setUsername(sessionUser.full_name);
      setRole(sessionUser.role);
      setUserId(sessionUser.id);
    } else if (localUser) {
      setIsLoggedIn(true);
      setUsername(localUser.full_name);
      setRole(localUser.role);
      setUserId(localUser.id);
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

  const handleLogout = () => {
    sessionStorage.removeItem("account");
    localStorage.removeItem("rememberedAccount");
    setIsLoggedIn(false);
    setUsername("");
    setRole("");
    setUserId("");
    window.location.replace("/");
  };

  const isActive = (path) => location.pathname === path ? 'active-tab' : '';

  return (
    <>
      <Container fluid className="bg-black">
        <Row className="d-flex justify-content-end py-2">
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
        className="bg-white border-bottom"
        style={{ marginBottom: "30px" }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to={"/"}
            className="d-flex align-items-center nav-image"
          >
            <img src="../assets/Logo/black_on_trans.png" alt="Movie 88" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="fw-bold fs-5 custom-nav">
              <Nav.Link
                href="/showtime"
                className={isActive("/showtime")}
              >
                Lịch Chiếu Theo Rạp
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
                to={"/info"}
                className={isActive("/info")}
              >
                Rạp
              </Nav.Link>
              <Nav.Link
                as={Link}
                to={"/price"}
                className={isActive("/price")}
              >
                Giá Vé
              </Nav.Link>
              {role === "1" && (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-management"
                    className="nav-link"
                  >
                    Quản Lý
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to="/account"
                      className={isActive("/account")}
                    >
                      Quản Lý Tài Khoản
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/managermovies"
                      className={isActive("/managermovies")}
                    >
                      Quản Lý Phim
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/languages"
                      className={isActive("/languages")}
                    >
                      Quản Lý Ngôn Ngữ
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/genres"
                      className={isActive("/genres")}
                    >
                      Quản Lý Thể Loại
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/movietypes"
                      className={isActive("/movietypes")}
                    >
                      Quản Lý Loại Phim
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/screens"
                      className={isActive("/screens")}
                    >
                      Quản Lý Màn Hình
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/tickets"
                      className={isActive("/tickets")}
                    >
                      Quản Lý Vé
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
