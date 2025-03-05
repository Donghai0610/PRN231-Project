import React, { useState, useEffect } from "react";
import { Card, Button, Form, InputGroup, Modal, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postData, fetchData } from "../API/ApiService";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../CSS/LoginRegister.css";
import Auth_Services from "../../services/auth";
import { toast } from "react-toastify";

const LoginRegister = () => {
  const [currentForm, setCurrentForm] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFull_name] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({ title: "", message: "" });
  const [resetValidationErrors, setResetValidationErrors] = useState({});
  const navigate = useNavigate();

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

    // Step 1: Validate user input (optional but a good practice)
    if (!email || !password) {
      toast.error("Email và mật khẩu không được để trống!"); // Show error toast
      return;
    }

    try {
      const response = await Auth_Services.loginHandle(email, password);  // Call the login API

      if (response && response.data) {
        localStorage.setItem("token", response.data);
        localStorage.setItem("account", email);

        if (remember) {
          const accountData = { email, password };
          localStorage.setItem("rememberedAccount", JSON.stringify(accountData));
        } else {
          localStorage.removeItem("rememberedAccount");
        }

        window.location.replace("/");
      } else {
        toast.error("Đăng nhập thất bại, vui lòng thử lại!");
      }
    } catch (error) {
      // Log the error and display the exact error message
      console.error("Error during login:", error.response?.data || error.message);
      toast.error(error.response?.data);  // Display the exact error message from the response
    }
  };

  const validateResetPassword = () => {
    const resetValidationErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!resetToken) {
      resetValidationErrors.resetToken = "Token không được bỏ trống!"
    }
    if (!newPassword) {
      resetValidationErrors.newPassword = "Mật khẩu không được bỏ trống!";
    } else if (!passwordRegex.test(newPassword)) {
      resetValidationErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 chữ hoa và 1 số!";
    }

    if (!confirmNewPassword) {
      resetValidationErrors.confirmNewPassword = "Vui lòng xác nhận mật khẩu!";
    } else if (newPassword !== confirmNewPassword) {
      resetValidationErrors.confirmNewPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";
    }

    setResetValidationErrors(resetValidationErrors);
    return Object.keys(resetValidationErrors).length === 0;
  };


  const validateFields = async () => {
    const validationErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/; // Updated regex
  
    if (!username) {
      validationErrors.username = "Tên người dùng không được bỏ trống!";
    }
  
    if (!email) {
      validationErrors.email = "Email không được bỏ trống!";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Email không đúng định dạng!";
    }
  
    if (!password) {
      validationErrors.password = "Mật khẩu không được bỏ trống!";
    } else if (!passwordRegex.test(password)) {
      validationErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, ít nhất 1 chữ hoa, 1 chữ số và 1 ký tự đặc biệt!";
    }
  
    if (!confirmPassword) {
      validationErrors.confirmPassword = "Vui lòng xác nhận mật khẩu!";
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";
    }
  
    setValidationErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  


  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate the fields (username, email, password, confirmPassword)
    const isValid = await validateFields();
    if (!isValid) return;

    // Call the register function and pass necessary data (username, password, email)
    try {
        const response = await Auth_Services.register(username, password, email); // Calling the register function

        // Assuming successful registration
        console.log("Registration successful", response);

        setShowSuccessModal(true);
        setCurrentForm("login");  // Switch to the login form after successful registration
    } catch (error) {
        console.error("Registration error:", error);
        setErrorMessage(error.message);  // Display the error message to the user
    }
};

  


  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMessage("Email không được để trống");
      return;
    }
    setIsSubmitting(true);
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
    setConfirmPassword("");
    setResetToken("");
    setNewPassword("");
    setConfirmNewPassword("");
    setErrorMessage("");
    setValidationErrors({});
    setCurrentForm("login");
  };
  return (
    <div className="login-register-container">
      <ToastContainer />
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
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    required
                    style={{ margin: "0" }}
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
                    onChange={(e) => { setPassword(e.target.value); setErrorMessage("") }}
                    style={{ margin: "0" }}
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
                    placeholder="* Username"
                    value={username}
                    style={{ margin: "0" }}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMessage("");
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        username: "",
                      }));
                    }}
                    isInvalid={!!validationErrors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.username}
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
                    style={{ margin: "0" }}
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
                    style={{ margin: "0" }}
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
                      
                    style={{ margin: "0" }}
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

                {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <Button style={{ marginBottom: "5px" }} variant="secondary" onClick={handleCancel}>
                  <i className="bi bi-x-circle"> Hủy</i>
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
                <p>Tài Khoản Của Bạn Đã Được Tạo Thành Công. Vui Lòng Kiểm Tra Email, Ấn Xác Nhận Để Kích Hoạt Tài Khoản!</p>
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
                      onChange={(e) => { setEmail(e.target.value.toLowerCase()); setErrorMessage("") }}
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
                      <i className="bi bi-check2-circle"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      value={resetToken}
                      onChange={(e) => {
                        setResetToken(e.target.value); setErrorMessage(""); setResetValidationErrors((prevErrors) => ({
                          ...prevErrors,
                          resetToken: "",
                        }))
                      }}
                      placeholder="Nhập mã reset"
                      isInvalid={!!resetValidationErrors.resetToken}
                    />
                    <Form.Control.Feedback type="invalid">
                      {resetValidationErrors.resetToken}
                    </Form.Control.Feedback>
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
                          setNewPassword: "",
                        }))
                      }}
                      placeholder="Nhập mật khẩu mới"
                      isInvalid={!!resetValidationErrors.newPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {resetValidationErrors.newPassword}
                    </Form.Control.Feedback>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <i className="bi bi-lock-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => { setConfirmNewPassword(e.target.value); setErrorMessage(""); setResetValidationErrors((prevErrors) => ({ ...prevErrors, confirmNewPassword: "" })) }}
                      placeholder="Xác nhận mật khẩu mới"
                      isInvalid={!!resetValidationErrors.confirmNewPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {resetValidationErrors.confirmNewPassword}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button style={{ marginBottom: "5px" }} variant="secondary" onClick={handleCancel}>
                    <i class="bi bi-x-circle"> Hủy</i>
                  </Button>
                  <Button variant="primary" type="submit" className="w-100">
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