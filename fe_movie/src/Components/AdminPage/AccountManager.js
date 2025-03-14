import { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Alert } from "react-bootstrap";
import User_Service from "../../services/user";

function AccountManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await User_Service.getUsers();
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải danh sách người dùng");
      setLoading(false);
    }
  };

  const handleUpdateActive = async (userId, currentStatus) => {
    try {
      await User_Service.UpdateActiveUser(userId, { isActive: !currentStatus });
      setSuccessMessage("Cập nhật trạng thái thành công!");
      fetchUsers(); // Tải lại danh sách sau khi cập nhật
    } catch (err) {
      setError("Không thể cập nhật trạng thái người dùng");
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Quản lý tài khoản người dùng</h2>
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
          {successMessage}
        </Alert>
      )}
      <Table striped bordered hover>
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
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>
                <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {user.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                </span>
              </td>
              <td>
                <Button
                  variant={user.isActive ? "danger" : "success"}
                  onClick={() => handleUpdateActive(user.id, user.isActive)}
                >
                  {user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AccountManager;
