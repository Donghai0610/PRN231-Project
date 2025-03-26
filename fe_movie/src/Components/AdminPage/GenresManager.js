import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Modal,
  Button,
  TextField,
  Box,
  Typography,
  InputAdornment,
  Pagination,
  Paper,
  Fade,
  Backdrop,
  Grid,
  Divider,
  Alert,
} from "@mui/material";
import { FaPlus, FaEdit, FaTrashAlt, FaSearch, FaTimes } from "react-icons/fa";
import Genre_Services from "../../services/genre";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from 'use-debounce';
import axiosInstance from "../../services/axios";
import "./GenresManager.css";

const GenresManager = () => {
  const [genres, setGenres] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGenreId, setDeleteGenreId] = useState(null);
  const [page, setPage] = useState(0); 
  const [totalCount, setTotalCount] = useState(0); 
  const [validationError, setValidationError] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [loading, setLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Fetch genres with pagination
  const fetchGenres = async (searchTerm = "", page = 0, rowsPerPage = 10) => {
    try {
      setLoading(true);
      const skip = page * rowsPerPage;  
      let filter = "";  

      if (searchTerm) {
        filter = `&$filter=contains(name, '${searchTerm}')`;  
      }

      const response = await Genre_Services.GetAllGenre(filter, skip, rowsPerPage);
      const totalGenresLength = await axiosInstance.get('/odata/Genre');
      
      setGenres(response.data);  
      setTotalCount(totalGenresLength.data.length);  
      setLoading(false);
    } catch (error) {
      console.error("Error fetching genres:", error);
      toast.error("Không thể tải danh sách thể loại!");
      setLoading(false);
    }
  };

  const validateGenre = (name) => {
    return genres.some((genre) => genre.name.toLowerCase() === name.toLowerCase()); 
  };

  const addGenre = async () => {
    if (!newGenre.trim()) {
      setValidationError("Tên thể loại không được để trống!");
      return;
    }
    if (validateGenre(newGenre)) {
      setValidationError("Thể loại này đã tồn tại!");
      return;
    }
    try {
      setLoading(true);
      const added = await Genre_Services.CreateGenre({ name: newGenre });

      setGenres((prev) => [added, ...prev]);
      setNewGenre(""); 
      setShowModal(false);
      setValidationError("");
      toast.success("Thêm thể loại thành công!");
      setLoading(false);
    } catch (error) {
      toast.error("Không thể thêm thể loại!");
      setLoading(false);
    }
  };

  const editGenre = async () => {
    if (!currentGenre || !currentGenre.name || !currentGenre.name.trim() || !currentGenre.genreId) {
      setValidationError("Tên thể loại không được để trống hoặc id không hợp lệ!");
      return;
    }

    try {
      setLoading(true);
      await Genre_Services.UpdateGenre(parseInt(currentGenre.genreId, 10), {
        genreId: parseInt(currentGenre.genreId, 10),
        name: currentGenre.name,
      });

      fetchGenres(searchTerm, page);
      setCurrentGenre(null);
      setShowModal(false);
      setValidationError("");
      toast.success("Cập nhật thể loại thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật thể loại!");
      setLoading(false);
    }
  };

  const prepareDeleteGenre = (genre) => {
    setDeleteGenreId(genre.genreId);
    setItemToDelete(genre);
    setShowDeleteModal(true);
  };

  const deleteGenre = async () => {
    try {
      setLoading(true);
      await Genre_Services.DeleteGenre(deleteGenreId);
      setGenres((prev) => prev.filter((genre) => genre.genreId !== deleteGenreId));
      toast.success("Xóa thể loại thành công!");
      setShowDeleteModal(false);
      setLoading(false);
    } catch (error) {
      toast.error("Không thể xóa thể loại!");
      setShowDeleteModal(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page]);  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);  
    fetchGenres(debouncedSearchTerm, newPage - 1);  
  };

  return (
    <Box className="genres-manager-container">
      <Paper className="genres-manager-content" elevation={3}>
        <Typography variant="h4" className="page-title" gutterBottom>
          Quản Lý Thể Loại
        </Typography>

        <Divider className="main-divider" />

        <Grid container spacing={2} className="search-actions-container">
          <Grid item xs={12} md={6}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm thể loại..."
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              className="search-input"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch className="search-icon" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm("")} size="small">
                      <FaTimes />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} className="add-button-container">
            <Button
              variant="contained"
              color="primary"
              className="add-button"
              size="small"
              onClick={() => {
                setCurrentGenre(null);
                setNewGenre("");
                setValidationError("");
                setShowModal(true);
              }}
            >
              <FaPlus size={14} className="icon-margin-right" /> Thêm thể loại
            </Button>
          </Grid>
        </Grid>

        <TableContainer className="table-container">
          <Table aria-label="genres table">
            <TableHead>
              <TableRow>
                <TableCell className="table-header-cell">STT</TableCell>
                <TableCell className="table-header-cell">Tên Thể Loại</TableCell>
                <TableCell className="table-header-cell" align="center">Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="loading-cell">
                    <div className="loading-spinner"></div>
                    <div>Đang tải...</div>
                  </TableCell>
                </TableRow>
              ) : genres && genres.length > 0 ? (
                genres.map((genre, index) => (
                  <TableRow key={genre.genreId} className="table-row">
                    <TableCell className="table-cell">{page * 10 + index + 1}</TableCell>
                    <TableCell className="table-cell">{genre.name}</TableCell>
                    <TableCell className="table-cell" align="center">
                      <div className="action-buttons">
                        <Tooltip title="Chỉnh sửa" arrow>
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setCurrentGenre(genre);
                              setValidationError("");
                              setShowModal(true);
                            }}
                            className="edit-button"
                            size="small"
                          >
                            <FaEdit size={14} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa" arrow>
                          <IconButton
                            color="error"
                            onClick={() => prepareDeleteGenre(genre)}
                            className="delete-button"
                            size="small"
                          >
                            <FaTrashAlt size={14} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" className="no-data-cell">
                    <div className="no-data-message">
                      <FaTimes size={40} />
                      <Typography variant="h6">Không có dữ liệu</Typography>
                      <Typography variant="body2">
                        {searchTerm ? "Không tìm thấy thể loại phù hợp" : "Chưa có thể loại nào được thêm vào"}
                      </Typography>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalCount > 0 && (
          <Box className="pagination-container">
            <Pagination
              count={Math.ceil(totalCount / 10)}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
              className="pagination"
            />
          </Box>
        )}
      </Paper>

      {/* Modal for Add/Edit Genre */}
      <Modal 
        open={showModal} 
        onClose={() => {
          setShowModal(false);
          setValidationError("");
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="modal-container"
      >
        <Fade in={showModal}>
          <Box className="modal-content">
            <Typography variant="h6" className="modal-title">
              {currentGenre ? "Sửa Thể Loại" : "Thêm Thể Loại Mới"}
            </Typography>
            
            <Divider className="modal-divider" />
            
            {validationError && (
              <Alert severity="error" className="validation-alert">
                {validationError}
              </Alert>
            )}
            
            <TextField
              label="Tên Thể Loại"
              variant="outlined"
              value={currentGenre ? currentGenre.name : newGenre}
              onChange={(e) => {
                currentGenre
                  ? setCurrentGenre({ ...currentGenre, name: e.target.value })
                  : setNewGenre(e.target.value);
                setValidationError("");
              }}
              fullWidth
              margin="normal"
              className="modal-input"
              autoFocus
            />
            
            <Box className="modal-actions">
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => {
                  setShowModal(false);
                  setValidationError("");
                }}
                className="cancel-button"
              >
                Hủy
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={currentGenre ? editGenre : addGenre}
                disabled={loading}
                className="save-button"
              >
                {loading ? (
                  <span className="button-loading">
                    <div className="button-spinner"></div>
                    Xử lý...
                  </span>
                ) : (
                  "Lưu"
                )}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Modal for Deleting Genre */}
      <Modal 
        open={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="modal-container"
      >
        <Fade in={showDeleteModal}>
          <Box className="modal-content delete-modal">
            <Typography variant="h6" className="modal-title">
              Xác Nhận Xóa Thể Loại
            </Typography>
            
            <Divider className="modal-divider" />
            
            <Typography variant="body1" className="delete-message">
              Bạn có chắc chắn muốn xóa thể loại <b>{itemToDelete?.name}</b>?
            </Typography>
            
            <Typography variant="body2" className="delete-warning">
              Hành động này không thể hoàn tác.
            </Typography>
            
            <Box className="modal-actions">
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Hủy
              </Button>
              <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={deleteGenre}
                disabled={loading}
                className="delete-confirm-button"
              >
                {loading ? (
                  <span className="button-loading">
                    <div className="button-spinner"></div>
                    Xử lý...
                  </span>
                ) : (
                  "Xóa"
                )}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default GenresManager;
