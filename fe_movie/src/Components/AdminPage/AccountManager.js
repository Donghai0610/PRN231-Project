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
  Chip,
  Stack,
  Tooltip,
  Avatar,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Fade,
  IconButton,
  useTheme,
  alpha
} from "@mui/material";
import { FaUser, FaUserShield, FaCalendarAlt, FaSearch, FaSync, FaFilter } from "react-icons/fa";
import User_Service from "../../services/user";
import Swal from "sweetalert2";

function AccountManager() {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      const response = await User_Service.getUsers();
      setUsers(response);
      setFilteredUsers(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      const isDarkMode = document.body.classList.contains('dark-mode');
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể tải danh sách người dùng',
        icon: 'error',
        confirmButtonColor: '#e50914',
        background: isDarkMode ? '#1e1e1e' : '#ffffff',
        color: isDarkMode ? '#f1f1f1' : '#1a1a1a'
      });
    }
  };

  const filterUsers = () => {
    let result = [...users];
    
    // Lọc theo tìm kiếm email hoặc username
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(query) || 
        user.userName.toLowerCase().includes(query)
      );
    }
    
    // Lọc theo vai trò
    if (roleFilter !== "all") {
      result = result.filter(user => 
        user.roles && user.roles.includes(roleFilter)
      );
    }
    
    setFilteredUsers(result);
  };

  const handleUpdateActive = async (userId, currentStatus) => {
    try {
      const isDarkMode = document.body.classList.contains('dark-mode');
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
        cancelButtonText: 'Hủy',
        background: isDarkMode ? '#1e1e1e' : '#ffffff',
        color: isDarkMode ? '#f1f1f1' : '#1a1a1a'
      });
      
      if (confirmResult.isConfirmed) {
        const response = await User_Service.UpdateActiveUser(userId, !currentStatus);
        if (response) {
          const isDarkMode = document.body.classList.contains('dark-mode');
          Swal.fire({
            title: 'Thành công!',
            text: currentStatus 
              ? 'Đã khóa tài khoản thành công!' 
              : 'Đã mở khóa tài khoản thành công!',
            icon: 'success',
            confirmButtonColor: '#e50914',
            background: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#f1f1f1' : '#1a1a1a'
          });
      fetchUsers();   
        }
      }
    } catch (err) {
      const isDarkMode = document.body.classList.contains('dark-mode');
      Swal.fire({
        title: 'Lỗi!',
        text: 'Không thể cập nhật trạng thái người dùng',
        icon: 'error',
        confirmButtonColor: '#e50914',
        background: isDarkMode ? '#1e1e1e' : '#ffffff',
        color: isDarkMode ? '#f1f1f1' : '#1a1a1a'
      });
    }
  };

  // Kiểm tra xem người dùng có phải là admin không
  const isAdmin = (user) => {
    return user.roles && user.roles.includes("Admin");
  };

  // Format ngày tháng 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          component="h2" 
          className="fw-bold"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Quản lý tài khoản người dùng
        </Typography>
        <IconButton 
          onClick={() => fetchUsers()} 
          sx={{ 
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              transform: 'rotate(180deg)',
              transition: 'transform 0.5s ease'
            }
          }}
        >
          <FaSync />
        </IconButton>
      </Box> */}

      <Fade in={true} timeout={500}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 2,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 1
          }}>
            <FaFilter style={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Bộ lọc và tìm kiếm
            </Typography>
          </Box>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tìm kiếm người dùng"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo email hoặc tên người dùng..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch style={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="role-filter-label">Vai trò</InputLabel>
                <Select
                  labelId="role-filter-label"
                  id="role-filter"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Vai trò"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <MenuItem value="all">Tất cả vai trò</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Customer">Khách hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                }}
                sx={{ 
                  height: '56px',
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  '&:hover': {
                    borderColor: theme.palette.error.dark,
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  }
                }}
              >
                Đặt lại bộ lọc
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
      
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={3} 
          sx={{ 
            width: '100%', 
            overflow: 'hidden', 
            borderRadius: 2,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}
        >
          <TableContainer sx={{ width: '100%', maxHeight: 650 }}>
            <Table stickyHeader aria-label="user accounts table" sx={{ width: '100%', tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="10%"
                  >
                    ID
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="15%"
                  >
                    Email
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="12%"
                  >
                    Tên người dùng
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="15%"
                  >
                    Vai trò
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="13%"
                  >
                    Trạng thái
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="15%"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <FaCalendarAlt style={{ marginRight: '8px' }} />
                      Ngày tạo
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      fontWeight: 'bold',
                      color: theme.palette.primary.main
                    }}
                    width="20%" 
                    align="center"
                  >
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.id}</TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.userName}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {user.roles && user.roles.map((role, index) => (
                          <Chip 
                            key={index}
                            avatar={
                              <Avatar sx={{ bgcolor: 'transparent' }}>
                                {role === "Admin" ? <FaUserShield /> : <FaUser />}
                              </Avatar>
                            }
                            label={role}
                            color={role === "Admin" ? "primary" : "secondary"}
                            size="small"
                            variant="filled"
                            sx={{ 
                              fontWeight: 'bold',
                              borderRadius: '16px',
                              boxShadow: 1,
                              '&:hover': {
                                boxShadow: 2,
                                transform: 'translateY(-1px)',
                                transition: 'all 0.2s'
                              },
                              '& .MuiChip-avatar': {
                                color: role === "Admin" ? '#1976d2' : '#9c27b0'
                              }
                            }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isActive ? 'Đang hoạt động' : 'Đã khóa'} 
                        color={user.isActive ? 'success' : 'error'} 
                        size="small"
                        variant="filled"
                        sx={{ 
                          fontWeight: 'medium',
                          borderRadius: '16px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: 1,
                          '&:hover': {
                            boxShadow: 2,
                            transform: 'translateY(-1px)',
                            transition: 'all 0.2s'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                      {!isAdmin(user) && (
                        <Tooltip title={user.isActive ? "Khóa tài khoản này" : "Mở khóa tài khoản này"}>
                <Button
                            variant="contained"
                            color={user.isActive ? "error" : "success"}
                  onClick={() => handleUpdateActive(user.id, user.isActive)}
                            size="small"
                            sx={{ 
                              minWidth: '140px',
                              fontWeight: 'bold',
                              boxShadow: 2,
                              '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.2s'
                            }}
                >
                  {user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                </Button>
                        </Tooltip>
                      )}
                      {isAdmin(user) && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic', 
                            color: 'text.secondary',
                            backgroundColor: alpha(theme.palette.warning.main, 0.1),
                            padding: '8px 16px',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}
                        >
                          Không thể thay đổi trạng thái tài khoản Admin
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
      </Table>
          </TableContainer>
        </Paper>
      </Fade>
      
      {filteredUsers.length === 0 && !loading && (
        <Fade in={true} timeout={1000}>
          <Box sx={{ 
            textAlign: 'center', 
            p: 5, 
            mt: 2, 
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            boxShadow: 1,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <FaSearch style={{ color: theme.palette.primary.main }} />
              {searchQuery || roleFilter !== "all" 
                ? "Không tìm thấy người dùng phù hợp với bộ lọc đã chọn."
                : "Không có tài khoản nào."}
            </Typography>
          </Box>
        </Fade>
      )}
    </Container>
  );
}

export default AccountManager;
