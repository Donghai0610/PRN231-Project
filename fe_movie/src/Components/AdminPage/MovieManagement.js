import React, { useState, useEffect } from "react";
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
  Checkbox,
  ListItemText,
  Box,
  Typography,
} from "@mui/material";
import { FaEdit, FaTrashAlt, FaPlus, FaSearch } from "react-icons/fa";
import Genre_Services from "../../services/genre";
import Movie_Service from "../../services/movie";
import axiosInstance from "../../services/axios";
import { toast, ToastContainer } from "react-toastify";
import Actor_Service from "../../services/actor";
import MultipleSelectChip from "./component/MultipleSelectChip";

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]); // List actors (if applicable)
  const [showModal, setShowModal] = useState(false); // Modal hiển thị khi thêm hoặc chỉnh sửa phim
  const [newMovie, setNewMovie] = useState({
    movieName: "",
    description: "",
    releaseDate: "",
    isActive: true,
    actors: [],
    genres: [],
    image: "",
    movieUrl: "",
  });
  const [editMovie, setEditMovie] = useState(null); // Phim để chỉnh sửa
  const [page, setPage] = useState(0); // Trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số dòng trên mỗi trang
  const [search, setSearch] = useState({
    movieName: null,
    genre: null,
    actor: null,
  });
  const [totalMoviesCount, setTotalMoviesCount] = useState(0);

  // Load movies and genres when component mounts
  useEffect(() => {
    const loadMoviesAndGenres = async () => {
      try {
        const genreResponse = await Genre_Services.GetAllGenre();
        setGenres(genreResponse.data);

        const actorResponse = await Actor_Service.GetAllActors(); // Fetch actors if required
        setActors(actorResponse.data);
      } catch (error) {
        console.error("Error loading genres or actors:", error);
      }

      // Load movies first time without any filter
      await loadMovies();
    };

    loadMoviesAndGenres();
  }, []);

  const loadMovies = async (skip = 0, rowsPerPage = 5) => {
    const { movieName, genre, actor } = search;

    try {
      const allMoviesResponse = await axiosInstance.get("/api/Movies"); // Không phân trang
      const totalItems = allMoviesResponse.data.length;
      setTotalMoviesCount(totalItems);

      const response = await Movie_Service.GetAllMovies(genre, actor, movieName, skip, rowsPerPage); // Dùng skip cho phân trang

      setMovies(response);
    } catch (error) {
      console.error("Lỗi khi lấy phim:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const skip = newPage * rowsPerPage;
    loadMovies(skip, rowsPerPage);
  };


  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = () => {
    loadMovies();
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    loadMovies();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Nếu đang chỉnh sửa phim, cập nhật vào editMovie
    if (editMovie) {
      setEditMovie((prevMovie) => ({
        ...prevMovie,
        [name]: value,
      }));
    } else {
      // Nếu đang tạo mới phim, cập nhật vào newMovie
      setNewMovie((prevMovie) => ({
        ...prevMovie,
        [name]: value,
      }));
    }
  };

  // Handle selecting multiple items for actors or genres
  const handleSelectMultipleChange = (e, field) => {
    const selectedIds = e.target.value; // Mảng ID do MUI trả về

    if (field === "actors") {
      // Tìm toàn bộ object diễn viên tương ứng
      const selectedActors = actors.filter(actor =>
        selectedIds.includes(actor.actorId)
      );
      if (editMovie) {
        setEditMovie(prev => ({ ...prev, actors: selectedActors }));
      } else {
        setNewMovie(prev => ({ ...prev, actors: selectedActors }));
      }
    }
    else if (field === "genres") {
      const selectedGenres = genres.filter(genre =>
        selectedIds.includes(genre.genreId)
      );
      if (editMovie) {
        setEditMovie(prev => ({ ...prev, genres: selectedGenres }));
      } else {
        setNewMovie(prev => ({ ...prev, genres: selectedGenres }));
      }
    }
  };


  const handleAdd = () => {

    setNewMovie({
      movieName: "",
      description: "",
      releaseDate: "",
      isActive: true,
      actors: [],
      genres: [],
      image: "",
      movieUrl: "",
    });
    setEditMovie(null);  // Reset editMovie
    setShowModal(true);  // Mở modal thêm phim mới
  };

  const handleSubmit = async () => {
    // Kiểm tra nếu không có ảnh mới, chỉ khi thêm phim mới mới cần kiểm tra ảnh
    if (!newMovie.image && !editMovie) {
      toast.error("Vui lòng chọn ảnh cho phim!");
      return;
    }
    let finalActors = editMovie
      ? editMovie.actors.map(a => a.actorId)
      : newMovie.actors.map(a => a.actorId);

    let finalGenres = editMovie
      ? editMovie.genres.map(g => g.genreId)
      : newMovie.genres.map(g => g.genreId);


      const updatedMovieData = {
      ...newMovie,
      image: newMovie.image || editMovie?.image,  // Use the image if provided, else use existing
      actors: finalActors,
      genres: finalGenres,
    };

    try {
      let imageToUpload = updatedMovieData.image;

      // If the image is unchanged, we don't upload it again
      if (updatedMovieData.image === editMovie?.image) {
        imageToUpload = null;
      }
      console.log("Update : " + updatedMovieData.actors.length);
      // Cập nhật phim nếu đang chỉnh sửa
      if (editMovie) {
        await Movie_Service.UpdateMovie(editMovie.movieId, updatedMovieData);
        setMovies(movies.map((movie) =>
          movie.id === editMovie.id ? { ...updatedMovieData, id: editMovie.id } : movie
        ));
        toast.success("Đã cập nhật phim thành công!");
      } else {
        // Thêm phim mới
        const createdMovie = await Movie_Service.CreateMovie(updatedMovieData);
        setMovies([...movies, { ...createdMovie, id: movies.length + 1 }]);
        toast.success("Đã thêm phim mới thành công!");
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error submitting movie:", error);
    }
  };



  const handleEdit = (movie) => {
    // Check the structure of the movie object before setting it
    console.log('Editing movie:', movie);

    setEditMovie(movie);
    setNewMovie({ ...movie });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await Movie_Service.DeleteMovie(id);
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Nếu đang chỉnh sửa phim, cập nhật vào editMovie
        if (editMovie) {
          setEditMovie((prevMovie) => ({
            ...prevMovie,
            image: reader.result,

          }));
        } else {
          setNewMovie((prevMovie) => ({
            ...prevMovie,
            image: reader.result, // base64 data
          }));
        }
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Chỉ lấy phần ngày "yyyy-MM-dd"
  };
  return (
    <Box sx={{ p: 2 }}>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <Typography variant="h4" gutterBottom>
        Quản Lý Phim
      </Typography>

      {/* Search Section */}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <TextField
          label="Tìm kiếm theo tên phim"
          name="movieName"
          value={search.movieName || ""}
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
            {genres.map((genre) => (
              <MenuItem key={genre.gerneId} value={genre.name}>
                {genre.name}
              </MenuItem>
            ))}
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
          startIcon={<FaSearch />}
          onClick={handleSearch}
        >
          Tìm Kiếm
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlus />}
          onClick={handleAdd}
        >
          Thêm Phim Mới
        </Button>
      </Box>

      {/* Movie Table */}
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
              .map((movie, index) => (
                <TableRow key={`${movie.movieId}-${index}`}>  {/* Kết hợp movieId và index */}

                  <TableCell style={{ width: 100, height: 150 }}>
                    <img
                      src={movie.image}
                      alt={movie.movieName}
                      style={{ objectFit: "cover", width: 100, height: 150 }}
                    />
                  </TableCell>
                  <TableCell style={{ fontFamily: 'cursive', fontSize: '20px' }} >{movie.movieName}</TableCell>
                  <TableCell style={{ fontFamily: 'cursive', fontSize: '20px' }} >
                    {movie.actors && movie.actors.length > 0
                      ? movie.actors.map((actor) => actor.fullName).join(", ")
                      : "Không có diễn viên"}
                  </TableCell>
                  <TableCell style={{ fontFamily: 'cursive', fontSize: '20px' }}>
                    {movie.genres && movie.genres.length > 0
                      ? movie.genres.map((genre) => genre.name).join(", ")
                      : "Không có thể loại"}
                  </TableCell>
                  <TableCell style={{ fontFamily: 'cursive', fontSize: '20px' }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip movieName="Sửa">
                        <IconButton style={{ width: 'fit-content' }}
                          color="warning" onClick={() => handleEdit(movie)}>
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip movieName="Xóa">
                        <IconButton style={{ width: 'fit-content' }} color="error" onClick={() => handleDelete(movie.id)}>
                          <FaTrashAlt />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>

                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalMoviesCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-movieName"
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
          <Typography variant="h6" id="modal-movieName" textAlign="center">
            {editMovie ? "Chỉnh Sửa Phim" : "Thêm Phim Mới"}
          </Typography>
          <form>
            {/* Movie Form Fields */}
            <TextField
              label="Tên Phim"
              name="movieName"
              value={editMovie ? editMovie.movieName : newMovie.movieName || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Mô Tả"
              name="description"
              value={editMovie ? editMovie.description : newMovie.description || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Ngày Phát Hành"
              name="releaseDate"
              type="date"
              value={editMovie ? formatDate(editMovie.releaseDate) : (newMovie.releaseDate ? formatDate(newMovie.releaseDate) : "")}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Link Phim"
              name="movieUrl"
              type="text"
              value={editMovie ? editMovie.movieUrl : newMovie.movieUrl || ""}
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
                value={editMovie ? editMovie.isActive : newMovie.isActive}
                onChange={handleInputChange}
                label="Trạng Thái"
              >
                <MenuItem value={true}>Chiếu</MenuItem>
                <MenuItem value={false}>Chưa Chiếu</MenuItem>
              </Select>
            </FormControl>

            <MultipleSelectChip
              names={
                actors && actors.length > 0
                  ? actors.map(actor => ({ id: actor.actorId, name: actor.fullName }))
                  : []
              }
              // Lấy ra mảng ID từ editMovie.actors (là mảng object) hoặc newMovie.actors (mảng object)
              selectedValues={
                editMovie
                  ? (editMovie.actors || []).map(a => a.actorId)
                  : (newMovie.actors || []).map(a => a.actorId)
              }
              handleChange={(e) => handleSelectMultipleChange(e, "actors")}
              label="Diễn Viên"
            />

            <MultipleSelectChip
              names={genres && genres.length > 0 ? genres.map(genre => ({ id: genre.genreId, name: genre.name })) : []}
              selectedValues={editMovie
                ? (editMovie.genres || []).map(a => a.genreId)
                : (newMovie.genres || []).map(a => a.genreId)
              }
              handleChange={(e) => handleSelectMultipleChange(e, 'genres')}
              label="Thể Loại"
            />





            {/* Image Upload and Preview */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: 10 }}
            />

            {/* Hiển thị ảnh preview khi chọn ảnh mới */}
            {/* Hiển thị ảnh cũ khi chỉnh sửa phim */}
            {/* {editMovie && editMovie.image && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2">Ảnh Preview:</Typography>
                <img
                  src={editMovie.image}  // Dùng URL ảnh hiện tại từ Cloudinary hoặc server
                  alt="Movie image"
                  style={{ width: "100px", height: "auto", justifyContent: "center" }}
                />
              </Box>
            )} */}

            {/* Hiển thị ảnh preview khi người dùng chọn ảnh mới */}
            {newMovie.image && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2">Ảnh Preview:</Typography>
                <img
                  src={newMovie.image}  // Hiển thị ảnh mới chọn
                  alt="Movie image"
                  style={{ width: "100px", height: "auto", justifyContent: "center" }}
                />
              </Box>
            )}

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 2 }}>
              {editMovie ? "Cập Nhật" : "Thêm Phim"}
            </Button>
          </form>
        </Box>
      </Modal>

    </Box>
  );
};

export default MovieManagement;
