import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  InputAdornment,
  Input,
  FormHelperText,
} from "@mui/material";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]); // Dữ liệu phim
  const [showModal, setShowModal] = useState(false); // Modal hiển thị khi thêm hoặc chỉnh sửa phim
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    releaseDate: "",
    isActive: true,
    actors: [],
    genres: [],
    poster: "",
    movieUrl: "",
  });
  const [editMovie, setEditMovie] = useState(null); // Phim để chỉnh sửa
  const [page, setPage] = useState(0); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số dòng trên mỗi trang
  const [search, setSearch] = useState({
    title: "",
    genre: "",
    actor: "",
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset trang khi thay đổi số dòng mỗi trang
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleSelectMultipleChange = (e, field) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewMovie({ ...newMovie, [field]: value });
  };

  const handleSubmit = () => {
    if (editMovie) {
      setMovies(
        movies.map((movie) =>
          movie.id === editMovie.id ? { ...newMovie, id: editMovie.id } : movie
        )
      );
    } else {
      setMovies([...movies, { ...newMovie, id: movies.length + 1 }]);
    }
    setShowModal(false);
  };

  const handleEdit = (movie) => {
    setEditMovie(movie);
    setNewMovie({ ...movie });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setMovies(movies.filter((movie) => movie.id !== id));
  };

  // Chức năng để xử lý upload ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMovie((prevMovie) => ({
          ...prevMovie,
          poster: reader.result, // Chỉ lưu URL base64 tạm thời
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Quản Lý Phim
      </Typography>

      {/* Tìm kiếm */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Tìm kiếm theo tên phim"
          name="title"
          value={search.title}
          onChange={handleSearchChange}
          fullWidth
          variant="outlined"
          size="small"
        />
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel>Thể Loại</InputLabel>
          <Select
            name="genre"
            value={search.genre}
            onChange={handleSearchChange}
            label="Thể Loại"
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="Action">Action</MenuItem>
            <MenuItem value="Comedy">Comedy</MenuItem>
            <MenuItem value="Drama">Drama</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Tìm kiếm theo diễn viên"
          name="actor"
          value={search.actor}
          onChange={handleSearchChange}
          fullWidth
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={() => setShowModal(true)}
        >
          Thêm Phim Mới
        </Button>
      </Box>

      {/* Table for Movie List */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên Phim</TableCell>
              <TableCell>Diễn Viên</TableCell>
              <TableCell>Thể Loại</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .filter((movie) => {
                return (
                  (movie.title.toLowerCase().includes(search.title.toLowerCase()) ||
                    search.title === "") &&
                  (movie.genres.some((genre) => genre.toLowerCase().includes(search.genre.toLowerCase())) ||
                    search.genre === "") &&
                  (movie.actors.some((actor) => actor.toLowerCase().includes(search.actor.toLowerCase())) ||
                    search.actor === "")
                );
              })
              .map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      style={{ width: "100px", height: "auto" }}
                    />
                  </TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.actors.join(", ")}</TableCell>
                  <TableCell>{movie.genres.join(", ")}</TableCell>
                  <TableCell>
                    <Tooltip title="Sửa">
                      <IconButton color="warning" onClick={() => handleEdit(movie)}>
                        <FaEdit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton color="error" onClick={() => handleDelete(movie.id)}>
                        <FaTrashAlt />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={movies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Modal for Add/Edit Movie */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-title"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            padding: 4,
            borderRadius: 1,
            maxWidth: 600,
            width: "100%",
          }}
        >
          <Typography variant="h6" id="modal-title" textAlign="center">
            {editMovie ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}
          </Typography>
          <form>
            <TextField
              label="Tên Phim"
              name="title"
              value={newMovie.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Mô Tả"
              name="description"
              value={newMovie.description}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />

            <TextField
              label="Ngày Phát Hành"
              name="releaseDate"
              type="date"
              value={newMovie.releaseDate}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                name="isActive"
                value={newMovie.isActive}
                onChange={handleInputChange}
                label="Trạng Thái"
              >
                <MenuItem value={true}>Đang Chiếu</MenuItem>
                <MenuItem value={false}>Chưa Chiếu</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Diễn Viên</InputLabel>
              <Select
                multiple
                name="actors"
                value={newMovie.actors}
                onChange={(e) => handleSelectMultipleChange(e, "actors")}
                label="Diễn Viên"
              >
                <MenuItem value="Actor 1">Actor 1</MenuItem>
                <MenuItem value="Actor 2">Actor 2</MenuItem>
                <MenuItem value="Actor 3">Actor 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Thể Loại</InputLabel>
              <Select
                multiple
                name="genres"
                value={newMovie.genres}
                onChange={(e) => handleSelectMultipleChange(e, "genres")}
                label="Thể Loại"
              >
                <MenuItem value="Action">Action</MenuItem>
                <MenuItem value="Comedy">Comedy</MenuItem>
                <MenuItem value="Drama">Drama</MenuItem>
              </Select>
            </FormControl>

            {/* Preview ảnh khi tải lên */}
            <Button
              variant="contained"
              component="label"
              fullWidth
              margin="normal"
              sx={{ mt: 2 }}
            >
              Tải Ảnh Phim
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </Button>

            {/* Hiển thị ảnh tải lên */}
            {newMovie.poster && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <img
                  src={newMovie.poster}
                  alt="Preview"
                  style={{ width: "100px", height: "auto" }}
                />
              </Box>
            )}

            <TextField
              label="URL Video"
              name="movieUrl"
              value={newMovie.movieUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
              {editMovie ? "Cập Nhật" : "Thêm Phim"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default MovieManagement;
