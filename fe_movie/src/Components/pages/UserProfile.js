import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Modal, Table } from "react-bootstrap";
import { fetchData, updateData } from "../API/ApiService";
import { PencilSquare, Lock, Key } from 'react-bootstrap-icons';
import { InputGroup, FormControl } from 'react-bootstrap';

function UserProfile() {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [userData, setUserData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchData(`accounts/${id}`);
        setUserData(data);
        setFormData({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          address: data.address,
          gender: data.gender,
        });

        const userTickets = data.tickets || [];
        setAccounts(userTickets);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [id]);

  const filterTickets = (ticket) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(lowerSearchTerm) ||
      ticket.movie.toLowerCase().includes(lowerSearchTerm) ||
      ticket.cinema.toLowerCase().includes(lowerSearchTerm) ||
      ticket.seats.toLowerCase().includes(lowerSearchTerm) ||
      ticket.date.toLowerCase().includes(lowerSearchTerm) ||
      ticket.startTime.toLowerCase().includes(lowerSearchTerm) ||
      ticket.endTime.toLowerCase().includes(lowerSearchTerm)
    );
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  const handleClose = () => {
    setShow(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
  };
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleShow = () => setShow(true);
  const handleModalClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData({
        ...formData,
        [name]: value.toLowerCase(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setErrors({ ...errors, [name]: "" });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const validateFields = () => {
    const validationErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^0\d{9,10}$/;
    const today = new Date();

    if (!formData.full_name) validationErrors.full_name = "Họ và tên không được bỏ trống!";
    if (!formData.gender) validationErrors.gender = "Giới tính không được bỏ trống!";

    if (!formData.email) {
      validationErrors.email = "Email không được bỏ trống!";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Email không đúng định dạng! (....@gmail.com)";
    }

    if (!formData.phone) {
      validationErrors.phone = "Số điện thoại không được bỏ trống!";
    } else if (!phoneRegex.test(formData.phone)) {
      validationErrors.phone = "Số điện thoại không đúng định dạng! (Bắt đầu bằng số 0 và 10-11 số)";
    }

    if (!formData.dob) {
      validationErrors.dob = "Ngày sinh không được bỏ trống!";
    } else if (new Date(formData.dob) > today) {
      validationErrors.dob = "Ngày sinh không được là ngày sau hôm nay!";
    }

    if (!formData.address) validationErrors.address = "Địa chỉ không được bỏ trống!";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const validatePasswordFields = () => {
    const validationErrors = {};

    if (!passwordData.currentPassword) {
      validationErrors.currentPassword = "Mật khẩu hiện tại không được bỏ trống!";
    } else if (passwordData.currentPassword !== userData.password) {
      validationErrors.currentPassword = "Mật khẩu hiện tại không đúng.";
    }

    if (!passwordData.newPassword) {
      validationErrors.newPassword = "Mật khẩu mới không được bỏ trống!";
    } else if (passwordData.newPassword.length < 8) {
      validationErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự!";
    }

    if (!passwordData.confirmPassword) {
      validationErrors.confirmPassword = "Xác nhận mật khẩu không được bỏ trống!";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu mới và xác nhận mật khẩu không trùng khớp.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const getUserData = async () => {
    try {
      setLoading(true);
      const data = await fetchData(`accounts/${id}`);
      setUserData(data);
      setFormData({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
        address: data.address,
        gender: data.gender,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setUpdating(true);
    try {
      const updatedData = {
        ...userData,
        ...formData,
      };
      await updateData("accounts", id, updatedData);
      setSuccessMessage("Cập nhật thành công!");
      setShowSuccessModal(true);
      await getUserData();
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSuccessMessage("Có lỗi xảy ra, vui lòng thử lại.");
      setShowSuccessModal(true);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordFields()) return;
    setUpdating(true);
    try {
      const updatedData = {
        ...userData,
        password: passwordData.newPassword,
      };
      await updateData("accounts", id, updatedData);
      setSuccessMessage("Đổi mật khẩu thành công!");
      setShowSuccessModal(true);
      handleClose();
    } catch (error) {
      console.error("Failed to update password:", error);
      setSuccessMessage("Có lỗi xảy ra khi cập nhật mật khẩu.");
      setShowSuccessModal(true);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="center">
      <Container>
        <Row>
          <Col>
            <Form onSubmit={handleSubmit}>
              <h4 className="text-center mb-4">Thông tin tài khoản</h4>
              <Row>
                <Col md={6}>
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.full_name}
                    placeholder="Họ và tên"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.full_name}
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone}
                    placeholder="Số điện thoại"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Ngày Sinh</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    isInvalid={!!errors.dob}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dob}
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    isInvalid={!!errors.address}
                    placeholder="Nhập địa chỉ của bạn"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Giới tính</Form.Label>
                  <Form.Control
                    as="select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    isInvalid={!!errors.gender}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Col>
              </Row>

              <Row style={{ marginTop: "2rem" }}>
                <Col>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleShow();
                  }}>
                    <Lock size={18} /> Đổi mật khẩu
                  </a>
                </Col>
              </Row>

              <Row className="d-flex justify-content-center" style={{ marginTop: "2rem" }}>
                <Col xs="auto">
                  <Button
                    style={{ width: "8rem", background: "#2891d3" }}
                    type="submit"
                    disabled={updating}
                  >
                    {updating ? "Đang cập nhật..." : "Cập nhật"}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row style={{ marginTop: "2rem" }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
            <h2 style={{ color: '#343a40' }}>Lịch Sử Dặt Vé</h2>

            <InputGroup className="mb-3">
              <FormControl
                placeholder="Tìm kiếm theo ID vé, Tên phim, Rạp, Ghế, Ngày"
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Mã Vé</th>
                  <th>Phim</th>
                  <th>Rạp</th>
                  <th>Ghế</th>
                  <th>Ngày</th>
                  <th>Thời gian</th>
                  <th>Tổng giá</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length > 0 ? (
                  accounts.filter(filterTickets).map(ticket => (
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.movie}</td>
                      <td>{ticket.cinema}</td>
                      <td>{ticket.seats.join(", ")}</td>
                      <td>{ticket.date}</td>
                      <td>{ticket.startTime} - {ticket.endTime}</td>
                      <td>{formatCurrency(ticket.totalPrice)}</td>
                      <td>
                        <span className={`badge ${ticket.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                          {ticket.status === 'active' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">Không có vé nào.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Row>
      </Container>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thay đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Label>Mật khẩu hiện tại</Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.currentPassword}
                  placeholder="Nhập mật khẩu hiện tại"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {errors.currentPassword}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Label>Mật khẩu mới</Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.newPassword}
                  placeholder="Nhập mật khẩu mới"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={5}>
                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              </Col>
              <Col md={7}>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors.confirmPassword}
                  placeholder="Nhập xác nhận mật khẩu mới"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  style={{ width: "8rem", background: "#2891d3" }}
                  type="submit"
                  disabled={updating}
                >
                  {updating ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal centered show={showSuccessModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

  );
}

export default UserProfile;
