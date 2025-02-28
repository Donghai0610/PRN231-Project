import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container, Alert } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [newAccount, setNewAccount] = useState(initialAccountState());
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

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

  const fetchAccounts = async () => {
    try {
      const data = await fetchData("accounts");
      setAccounts(data);
    } catch {
      setErrorMessage("Không thể tải danh sách tài khoản!");
    }
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
      validationErrors.email = "Email không đươc bỏ trống!";
    } else if (!emailRegex.test(newAccount.email)) {
      validationErrors.email = "Email không đúng định dạng! (....@gmail.com)";
    } else if (
      !currentAccount &&
      accounts.some((acc) => acc.email.toLowerCase() === newAccount.email.toLowerCase())
    ) {
      validationErrors.email = "Email đã được đăng ký!";
    }

    if (!newAccount.phone) {
      validationErrors.phone = "Số điện thoại không được bỏ trống!";
    } else if (!phoneRegex.test(newAccount.phone)) {
      validationErrors.phone = "Số điện thoại không đúng định dạng! (Bắt đầu bằng số 0 và 10-11 số)";
    } else if (
      !currentAccount &&
      accounts.some((acc) => acc.phone === newAccount.phone)
    ) {
      validationErrors.phone = "Số điện thoại đã được đăng ký!";
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
      let updatedAccount;

      if (currentAccount) {
        updatedAccount = await updateData("accounts", currentAccount.id, newAccount);
        setAccounts((prev) =>
          prev.map((account) => (account.id === updatedAccount.id ? updatedAccount : account))
        );
      } else {
        updatedAccount = await postData("accounts", newAccount);
        setAccounts((prev) => [...prev, updatedAccount]);
      }
      const accountToSave = {
        id: updatedAccount.id,
        password: updatedAccount.password,
        role: updatedAccount.role,
        email: updatedAccount.email,
        phone: updatedAccount.phone,
        full_name: updatedAccount.full_name,
      };
      const sessionAccount = JSON.parse(sessionStorage.getItem("account"));
      if (sessionAccount && sessionAccount.id === updatedAccount.id) {
        sessionStorage.setItem("account", JSON.stringify(updatedAccount));
      }

      const localAccount = JSON.parse(localStorage.getItem("rememberedAccount"));
      if (localAccount && localAccount.id === updatedAccount.id) {
        localStorage.setItem("rememberedAccount", JSON.stringify(accountToSave));
      }

      setSuccessMessage("Cập nhật tài khoản thành công!");
      setShowModal(false);
      setNewAccount(initialAccountState());
      setErrors({});
    } catch {
      setErrorMessage("Có lỗi xảy ra trong quá trình lưu, vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;

    try {
      await deleteData("accounts", accountToDelete.id);
      setAccounts((prev) => prev.filter((acc) => acc.id !== accountToDelete.id));
      setSuccessMessage("Xóa tài khoản thành công!");
      setShowDeleteModal(false);
    } catch {
      setErrorMessage("Không thể xóa tài khoản, vui lòng thử lại!");
    }
  };

  const toggleStatus = async (id) => {
    try {
      const account = accounts.find((acc) => acc.id === id);
      const updated = await updateData("accounts", id, {
        ...account,
        status: account.status === "active" ? "inactive" : "active",
      });
      setAccounts((prev) =>
        prev.map((acc) => (acc.id === updated.id ? updated : acc))
      );
      setSuccessMessage("Cập nhật trạng thái tài khoản thành công!");
    } catch {
      setErrorMessage("Không thể cập nhật trạng thái tài khoản, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setErrors({});
    setNewAccount(initialAccountState());
  };

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
  const handleCancel = () => {
    setShowModal(false);
    setErrors({});
    setNewAccount(initialAccountState());
  };
  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Tài Khoản</h2>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
          {errorMessage}
        </Alert>
      )}

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Họ và Tên</th>
            <th>Ngày Sinh</th>
            <th>Giới Tính</th>
            <th>Email</th>
            <th>Mật Khẩu</th>
            <th>Điện Thoại</th>
            <th>Địa Chỉ</th>
            <th>Vai Trò</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.full_name}</td>
              <td>{account.dob}</td>
              <td>{account.gender}</td>
              <td>{account.email}</td>
              <td>{account.password}</td>
              <td>{account.phone}</td>
              <td>{account.address}</td>
              <td>{account.role === "1" ? "Admin" : "User"}</td>
              <td>
                <Button
                  variant={account.status === "active" ? "success" : "secondary"}
                  onClick={() => toggleStatus(account.id)}
                >
                  {account.status === "active" ? "Hoạt động" : "Vô hiệu"}
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentAccount(account);
                    setNewAccount(account);
                    setShowModal(true);
                  }}
                >
                  Sửa
                </Button>
                <Button
                style={{ marginTop: "10px" }}
                  variant="danger"
                  onClick={() => {
                    setAccountToDelete(account);
                    setShowDeleteModal(true);
                  }}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        variant="primary"
        onClick={() => {
          setCurrentAccount(null);
          setNewAccount(initialAccountState());
          setShowModal(true);
        }}
      >
        Thêm Tài Khoản
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentAccount ? "Sửa Tài Khoản" : "Thêm Tài Khoản"}
          </Modal.Title>
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
              <Form.Control.Feedback type="invalid">
                {errors.full_name}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.dob}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>* Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={newAccount.email.toLowerCase()}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.phone}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
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
              <Form.Control.Feedback type="invalid">
                {errors.role}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
            Hủy
          </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu
            </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Xóa Tài Khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa tài khoản này không?
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AccountManager;
