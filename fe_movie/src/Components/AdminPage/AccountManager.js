import { useState } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";

function AccountManager() {
  const [newAccount, setNewAccount] = useState(initialAccountState());
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  function initialAccountState() {
    return {
      password: "",
      role: "2",
      dob: "",
      gender: "",
      address: "",
      email: "",
      phone: "",
      full_name: "",
      status: "active",
      tickets: [],
    };
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateFields = () => {
    const validationErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^0\d{9,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const today = new Date();

    if (!newAccount.full_name) validationErrors.full_name = "Họ và tên không được bỏ trống!";
    if (!newAccount.gender) validationErrors.gender = "Giới tính không được bỏ trống!";
    if (!newAccount.email) {
      validationErrors.email = "Email không được bỏ trống!";
    } else if (!emailRegex.test(newAccount.email)) {
      validationErrors.email = "Email không đúng định dạng! (....@gmail.com)";
    }

    if (!newAccount.phone) {
      validationErrors.phone = "Số điện thoại không được bỏ trống!";
    } else if (!phoneRegex.test(newAccount.phone)) {
      validationErrors.phone = "Số điện thoại không đúng định dạng! (Bắt đầu bằng số 0 và 10-11 số)";
    }

    if (!newAccount.dob) {
      validationErrors.dob = "Ngày sinh không được bỏ trống!";
    } else if (new Date(newAccount.dob) > today) {
      validationErrors.dob = "Ngày sinh không được là ngày sau hôm nay!";
    }

    if (!newAccount.password) {
      validationErrors.password = "Mật khẩu không được bỏ trống!";
    } else if (!passwordRegex.test(newAccount.password)) {
      validationErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 chữ viết hoa và ít nhất 1 số!";
    }

    if (!newAccount.address) validationErrors.address = "Địa chỉ không được bỏ trống!";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      // Handle save logic here (e.g., API call to save the account)
      setShowModal(false);
      setNewAccount(initialAccountState());
      setErrors({});
      alert("Account saved successfully!");
    } catch {
      alert("There was an error while saving the account. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
    setNewAccount(initialAccountState());
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Tài Khoản</h2>

      <Button variant="primary" onClick={() => setShowModal(true)}>
        Thêm Tài Khoản
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Thêm Tài Khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>* Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Họ và Tên"
                name="full_name"
                value={newAccount.full_name}
                onChange={handleInputChange}
                isInvalid={!!errors.full_name}
              />
              <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Ngày Sinh</Form.Label>
              <Form.Control
                type="date"
                placeholder="Ngày Sinh"
                name="dob"
                value={newAccount.dob}
                onChange={handleInputChange}
                isInvalid={!!errors.dob}
              />
              <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Giới Tính</Form.Label>
              <Form.Select
                name="gender"
                value={newAccount.gender}
                onChange={handleInputChange}
                isInvalid={!!errors.gender}
              >
                <option value="">-- Chọn Giới Tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={newAccount.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Mật Khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={newAccount.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Số điện thoại"
                name="phone"
                value={newAccount.phone}
                onChange={handleInputChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Địa Chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Địa chỉ"
                name="address"
                value={newAccount.address}
                onChange={handleInputChange}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Vai trò</Form.Label>
              <Form.Select
                name="role"
                value={newAccount.role}
                onChange={handleInputChange}
                isInvalid={!!errors.role}
              >
                <option value="">-- Chọn Vai Trò --</option>
                <option value="1">Admin</option>
                <option value="2">User</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AccountManager;
