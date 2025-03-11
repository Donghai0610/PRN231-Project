import { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { Lock } from "react-bootstrap-icons";
import { InputGroup, FormControl } from "react-bootstrap";

function UserProfile() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [updating, setUpdating] = useState(false);
  const [show, setShow] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, like validation and API call
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Handle password change logic here
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

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

    </div>
  );
}

export default UserProfile;
