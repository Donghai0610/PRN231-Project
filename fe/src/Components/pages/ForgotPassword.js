import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData, fetchData } from "../API/ApiService";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../CSS/LoginRegister.css";

const LoginRegister = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFull_name] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetValidationErrors, setResetValidationErrors] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const rememberedAccount = localStorage.getItem("rememberedAccount");
    if (rememberedAccount) {
      const { email, password } = JSON.parse(rememberedAccount);
      setEmail(email);
      setPassword(password);
      setRemember(true);
    }

    const account = localStorage.getItem("account");
    if (account) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const users = await fetchData("accounts");
      const existUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (existUser) {
        if (existUser.status === "inactive") {
          setErrorMessage("Tài khoản đã bị khóa!");
          return;
        }

        if (remember) {
          const userData = {
            id: existUser.id,
            email: existUser.email,
            phone: existUser.phone,
            password: existUser.password,
            full_name: existUser.full_name,
            role: existUser.role,
          };
          localStorage.setItem("rememberedAccount", JSON.stringify(userData));
        } else {
          localStorage.removeItem("rememberedAccount");
        }

        sessionStorage.setItem("account", JSON.stringify(existUser));
        window.location.replace("/");
      } else {
        setErrorMessage("Tài khoản hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      setErrorMessage("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };
  const validateResetPassword = () => {
    const resetValidationErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!resetPassword) {
      resetValidationErrors.resetPassword = "Mật khẩu không được bỏ trống!";
    } else if (!passwordRegex.test(resetPassword)) {
      resetValidationErrors.resetPassword = "Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 chữ hoa và 1 số!";
    }

    if (!confirmResetPassword) {
      resetValidationErrors.confirmResetPassword = "Vui lòng xác nhận mật khẩu!";
    } else if (resetPassword !== confirmResetPassword) {
      resetValidationErrors.confirmResetPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";
    }

    setResetValidationErrors(resetValidationErrors);
    return Object.keys(resetValidationErrors).length === 0;
  };

  const validateFields = async () => {
    const validationErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^0\d{9,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    const today = new Date();

    if (!full_name) validationErrors.full_name = "Họ và tên không được bỏ trống!";
    if (!gender) validationErrors.gender = "Giới tính không được bỏ trống!";
    if (!email) {
      validationErrors.email = "Email không được bỏ trống!";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Email không đúng định dạng!";
    } else {
      const users = await fetchData("accounts");
      const emailExists = users.some((user) => user.email === email);
      if (emailExists) validationErrors.email = "Email đã được đăng ký!";
    }

    if (!phone) {
      validationErrors.phone = "Số điện thoại không được bỏ trống!";
    } else if (!phoneRegex.test(phone)) {
      validationErrors.phone = "Số điện thoại không đúng định dạng!";
    } else {
      const users = await fetchData("accounts");
      const phoneExists = users.some((user) => user.phone === phone);
      if (phoneExists) validationErrors.phone = "Số điện thoại đã được đăng ký!";
    }

    if (!dob) {
      validationErrors.dob = "Ngày sinh không được bỏ trống!";
    } else if (new Date(dob) > today) {
      validationErrors.dob = "Ngày sinh không được là ngày sau hôm nay!";
    }

    if (!password) {
      validationErrors.password = "Mật khẩu không được bỏ trống!";
    } else if (!passwordRegex.test(password)) {
      validationErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 chữ hoa và 1 số!";
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = "Vui lòng xác nhận mật khẩu!";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";
    }

    if (!address) validationErrors.address = "Địa chỉ không được bỏ trống!";

    setValidationErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const handleRegister = async (e) => {
    e.preventDefault();

    const isValid = await validateFields();
    if (!isValid) return;

    const data = { full_name, email, password, dob, phone, gender, address, role: "2", status: "active" };

    try {
      const response = await postData("accounts", data);
      console.log("Registration successful", response);
      setShowSuccessModal(true);
      setCurrentForm("login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred while registering");
    }
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    if (!email.trim()) {
      setErrorMessage("Email không được để trống");
      return;
    }
  
    setIsSubmitting(true); // Bắt đầu gửi, vô hiệu hóa nút
  
    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setPopupContent({
          title: "Yêu cầu thành công",
          message: data.message || "Yêu cầu đặt lại mật khẩu đã được gửi.",
        });
        setPopupVisible(true);
        setCurrentForm("resetPassword");
      } else {
        setErrorMessage(data.message || "Đã xảy ra lỗi khi gửi yêu cầu!");
      }
    } catch (error) {
      console.error("Error in forgot password:", error);
      setErrorMessage("Không thể kết nối đến server, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false); // Hoàn tất, kích hoạt lại nút
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const isValid = validateResetPassword();
    if (!isValid) return;

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), resetToken, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setPopupContent({
          title: "Thay đổi thành công",
          message: data.message || "Mật khẩu đã được thay đổi.",
        });
        setPopupVisible(true);
        setCurrentForm("login");
      } else {
        setErrorMessage(data.message || "Đã xảy ra lỗi khi thay đổi mật khẩu!");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("Không thể kết nối đến server, vui lòng thử lại.");
    }
  };
  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setFull_name("");
    setPhone("");
    setDob("");
    setGender("");
    setAddress("");
    setConfirmPassword("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrorMessage("");
    setValidationErrors({});
    setCurrentForm("login");
  };

  const handleCancelReset = () => {
    setResetPassword("");
    setConfirmResetPassword("");
    setResetValidationErrors({});
    setErrorMessage("");
    setCurrentForm("login");
  };

  return (
    <div className="login-register-container">
      <Card className="text-center border-0">
        <Card.Body>
          <div className="tabs mb-4">
            <Button
              variant="outline-danger"
              className={`me-2 ${currentForm === "login" ? "active-tab" : ""}`}
              onClick={() => setCurrentForm("login")}
            >
              <i className="bi bi-box-arrow-in-right"> Đăng nhập</i>
            </Button>
            <Button
              variant="outline-warning"
              className={currentForm === "register" ? "active-tab" : ""}
              onClick={() => setCurrentForm("register")}
            >
              <i className="bi bi-person-plus-fill"> Đăng ký</i>
            </Button>
          </div>

          <div className="form-container">
            {currentForm === "login" && (
              <Form onSubmit={handleLogin}>
                <h2>Đăng nhập</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value.toLowerCase()); setErrorMessage("")}}
                    required
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setErrorMessage("")}}
                    required
                  />
                </InputGroup>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <Form.Group
                  className="mb-3"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "left",
                    marginLeft: "10px",
                  }}
                >
                  <Form.Check.Input type="checkbox" id="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ marginRight: "10px" }} />
                  <Form.Check.Label htmlFor="remember">Remember</Form.Check.Label>
                </Form.Group>

                <div className="forgot-password">
                  <Button
                    style={{
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrentForm("forgotPassword")}
                  >
                    <i className="bi bi-question-circle"> Quên mật khẩu?</i>
                  </Button>
                </div>
                <Button type="submit" className="btn-danger w-100">
                  <i className="bi bi-box-arrow-in-right"> Đăng nhập</i>
                </Button>
              </Form>
            )}

            {currentForm === "register" && (
              <Form onSubmit={handleRegister}>
                <h2>Đăng ký</h2>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-person"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Họ tên"
                    value={full_name}
                    onChange={(e) => {
                      setFull_name(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        full_name: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.full_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.full_name}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="* Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.toLowerCase());
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="* Mật khẩu"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        password: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-lock-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="* Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        confirmPassword: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-telephone-fill"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Số điện thoại"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        phone: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.phone}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-calendar-date"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    placeholder="* Ngày sinh"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        dob: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.dob}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.dob}
                  </Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-gender-ambiguous"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    as={"select"}
                    placeholder="Giới Tính"
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        gender: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.gender}
                  >
                    <option value="">* Giới Tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.gender}
                  </Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <i className="bi bi-geo-alt"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="* Địa chỉ"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        address: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.address}
                  </Form.Control.Feedback>
                </InputGroup>

                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <Button style={{ marginBottom: "5px" }} variant="secondary" onClick={handleCancel}>
                  <i class="bi bi-x-circle"> Hủy</i>
                </Button>
                <Button type="submit" className="btn-warning w-100">
                  <i className="bi bi-person-plus-fill"> Đăng ký</i>
                </Button>
              </Form>

            )}
            <Modal
              show={showSuccessModal}
              onHide={() => setShowSuccessModal(false)}
              backdrop="static"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Tạo Tài Khoản Thành Công</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Tài Khoản Của Bạn Đã Được Tạo Thành Công. Vui Lòng Đăng Nhập Để Trải Nghiệm!</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
            {currentForm === "forgotPassword" && (
              <>
                <Form onSubmit={handleForgotPassword}>
                  {errorMessage && <div className="text-danger">{errorMessage}</div>}

                  <h2 className="mb-4">Quên mật khẩu</h2>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-envelope"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => {setEmail(e.target.value.toLowerCase()); setErrorMessage("")}}
                      placeholder="Nhập email"
                      required
                    />
                  </InputGroup>
                  <Button style={{ marginBottom: "5px" }} disabled={isSubmitting} variant="secondary" onClick={handleCancel}>
                    <i class="bi bi-x-circle"> Hủy</i>
                  </Button>
                  <Button variant="primary" disabled={isSubmitting} type="submit" className="w-100">
                    <i class="bi bi-send"> Gửi yêu cầu đặt lại mật khẩu</i>
                  </Button>
                </Form>
              </>
            )}

            {currentForm === "resetPassword" && (
              <>
                <Form onSubmit={handleResetPassword}>
                  {errorMessage && <div className="text-danger">{errorMessage}</div>}

                  <h2 className="mb-4">Đặt lại mật khẩu</h2>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i class="bi bi-check2-circle"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={resetToken}
                      onChange={(e) => {setResetToken(e.target.value); setErrorMessage("")}}
                      placeholder="Nhập mã reset"
                      required
                    />
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-key"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMessage("");
                        setResetValidationErrors((prevErrors) => ({
                          ...prevErrors,
                          resetPassword: "",
                        }));
                      }}
                      placeholder="Nhập mật khẩu mới"
                      isInvalid={!!resetValidationErrors.resetPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {resetValidationErrors.resetPassword}
                    </Form.Control.Feedback>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-lock-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                        setErrorMessage("");
                        setResetValidationErrors((prevErrors) => ({
                          ...prevErrors,
                          confirmResetPassword: "",
                        }));
                      }}
                      placeholder="Xác nhận mật khẩu mới"
                      isInvalid={!!resetValidationErrors.confirmResetPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {resetValidationErrors.confirmResetPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button style={{ marginBottom: "5px" }} variant="secondary" onClick={handleCancelReset}>
                    <i class="bi bi-x-circle"> Hủy</i>
                  </Button>
                  <Button variant="primary" disabled={!resetPassword || !confirmResetPassword} type="submit" className="w-100">
                    <i class="bi bi-check-circle"> Đặt lại mật khẩu</i>
                  </Button>
                </Form>
              </>
            )}

          </div>
        </Card.Body>
      </Card>
      <Modal show={popupVisible} onHide={() => setPopupVisible(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{popupContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{popupContent.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setPopupVisible(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginRegister;