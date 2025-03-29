import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import User_Service from "../../services/user";
import Swal from "sweetalert2";

function AccountManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await User_Service.getUsers();
      setUsers(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách người dùng',
        icon: 'error',
        confirmButtonColor: '#e50914'
      });
    }
  };

  const handleUpdateActive = async (userId, currentStatus) => {
    try {
      // Hiển thị hộp thoại xác nhận trước khi thực hiện
      const confirmResult = await Swal.fire({
        title: currentStatus ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?',
        text: currentStatus 
          ? 'Bạn có chắc chắn muốn khóa tài khoản này không?' 
          : 'Bạn có chắc chắn muốn mở khóa tài khoản này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: currentStatus ? '#dc3545' : '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: currentStatus ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
        cancelButtonText: 'Hủy'
      });
      
      if (confirmResult.isConfirmed) {
        const response = await User_Service.UpdateActiveUser(userId, !currentStatus);
        if (response) {
          Swal.fire({
            title: 'Thành công!',
            text: currentStatus 
              ? 'Đã khóa tài khoản thành công!' 
              : 'Đã mở khóa tài khoản thành công!',
            icon: 'success',
            confirmButtonColor: '#e50914'
          });
          // Cập nhật lại danh sách người dùng
          fetchUsers();
        }
      }
    } catch (err) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể cập nhật trạng thái người dùng',
        icon: 'error',
        confirmButtonColor: '#e50914'
      });
    }
  };

  if (loading) return <div className="loading-container p-5 text-center"><i className="fas fa-spinner fa-spin me-2"></i>Đang tải...</div>;

  return (
    <Container fluid className="mt-4 p-4">
      <h2 className="mb-4 fw-bold">Quản lý tài khoản người dùng</h2>
      <div className="table-responsive">
        <Table striped bordered hover className="account-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td>
                  <Button
                    variant={user.isActive ? "outline-danger" : "outline-success"}
                    onClick={() => handleUpdateActive(user.id, user.isActive)}
                    size="sm"
                    className="px-3"
                  >
                    {user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {users.length === 0 && !loading && (
        <div className="text-center p-5">
          <p>Không có tài khoản nào.</p>
        </div>
      )}
    </Container>
  );
}

export default AccountManager;
