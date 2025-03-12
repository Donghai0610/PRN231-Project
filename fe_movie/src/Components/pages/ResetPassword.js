import React, { useState, useEffect } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Auth_Services from '../../services/auth';
import './ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy token và email từ URL search params
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        // Kiểm tra nếu không có token hoặc email thì chuyển về trang login
        if (!token || !email) {
            toast.error("Link đặt lại mật khẩu không hợp lệ!");
            navigate('/login');
        }
    }, [token, email, navigate]);

    const validateFields = () => {
        const errors = {};
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (!newPassword) {
            errors.newPassword = "Mật khẩu mới không được bỏ trống!";
        } else if (!passwordRegex.test(newPassword)) {
            errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 số và 1 ký tự đặc biệt!";
        }

        if (!confirmNewPassword) {
            errors.confirmNewPassword = "Vui lòng xác nhận mật khẩu mới!";
        } else if (newPassword !== confirmNewPassword) {
            errors.confirmNewPassword = "Mật khẩu mới và xác nhận không khớp!";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateFields()) return;

        setIsSubmitting(true);

        try {
            const response = await Auth_Services.resetPassword(email, token, newPassword,confirmNewPassword);
            
            if (response) {
                toast.success("Đặt lại mật khẩu thành công!");
                navigate('/login');
            }
        } catch (error) {
            console.error("Lỗi đặt lại mật khẩu:", error);
            toast.error(error.response?.data || "Đã xảy ra lỗi khi đặt lại mật khẩu");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/login');
    };

    return (
        <div className="reset-password-container">
            <Card className="text-center border-0">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <h2 className="mb-4">Đặt lại mật khẩu</h2>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <i className="bi bi-key"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                isInvalid={!!validationErrors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.newPassword}
                            </Form.Control.Feedback>
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <InputGroup.Text>
                                <i className="bi bi-lock-fill"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Xác nhận mật khẩu mới"
                                isInvalid={!!validationErrors.confirmNewPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationErrors.confirmNewPassword}
                            </Form.Control.Feedback>
                        </InputGroup>

                        <Button 
                            variant="secondary" 
                            onClick={handleCancel}
                            className="me-2"
                            disabled={isSubmitting}
                        >
                            <i className="bi bi-x-circle"> Hủy</i>
                        </Button>
                        <Button 
                            variant="primary" 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <i className="bi bi-check-circle"> Đặt lại mật khẩu</i>
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ResetPassword; 