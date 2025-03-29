import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Typography,
  Box,
  Chip
} from "@mui/material";
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

  if (loading) {
    return (
      <Box className="loading-container p-5 text-center">
        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
        <Typography variant="body1" sx={{ mt: 2 }}>Đang tải...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} className="mt-4 p-4 admin-content" disableGutters sx={{ px: 3 }}>
      <Typography variant="h4" component="h2" className="mb-4 fw-bold" gutterBottom>
        Quản lý tài khoản người dùng
      </Typography>
      
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <TableContainer sx={{ width: '100%' }}>
          <Table stickyHeader aria-label="user accounts table" sx={{ width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                <TableCell width="10%">ID</TableCell>
                <TableCell width="30%">Email</TableCell>
                <TableCell width="25%">Họ tên</TableCell>
                <TableCell width="15%">Trạng thái</TableCell>
                <TableCell width="20%" align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.id}</TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.userName}</TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isActive ? 'Đang hoạt động' : 'Đã khóa'} 
                      color={user.isActive ? 'success' : 'error'} 
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color={user.isActive ? "error" : "success"}
                      onClick={() => handleUpdateActive(user.id, user.isActive)}
                      size="small"
                      sx={{ minWidth: '140px' }}
                    >
                      {user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {users.length === 0 && !loading && (
        <Box sx={{ 
          textAlign: 'center', 
          p: 5, 
          mt: 2, 
          backgroundColor: theme => theme.palette.background.paper,
          borderRadius: 2,
          boxShadow: 1
        }}>
          <Typography variant="h6" color="text.secondary">
            Không có tài khoản nào.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default AccountManager;
