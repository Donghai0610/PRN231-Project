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
  TablePagination,
  Pagination,
} from "@mui/material";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import Genre_Services from "../../services/genre";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDebounce } from 'use-debounce';
const GenresManager = () => {
  const [genres, setGenres] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // for search
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGenreId, setDeleteGenreId] = useState(null);
  const [page, setPage] = useState(0); // Track the current page for pagination
  const [totalCount, setTotalCount] = useState(0); // Total number of items
  const [validationError, setValidationError] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // Delay is 500ms
  // Fetch genres with pagination
  const fetchGenres = async (searchTerm = "", page = 0, rowsPerPage = 10) => {
    try {
      const skip = page * rowsPerPage;  // Calculate skip based on current page
      let filter = "";  // Default empty filter

      // If there's a searchTerm, apply the filter
      if (searchTerm) {
        filter = `&$filter=contains(name, '${searchTerm}')`;  // Filter genres by name
      }

      // Call the API to fetch data
      const response = await Genre_Services.GetAllGenre(filter, skip, rowsPerPage);

      // Correct the total count based on the response length
      const totalGenres = 100;  // Make sure you get the correct count here
      setGenres(response.data);  // Set the genres in state
      setTotalCount(totalGenres);  // Set the total count in state

    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };



  // Validate genre name to prevent duplicates
  const validateGenre = (name) => {
    return genres.some((genre) => genre.name === name); // Check for duplicates
  };

  // Add a new genre
  const addGenre = async () => {
    if (!newGenre) {
      setValidationError("Tên thể loại không được để trống!");
      return;
    }
    if (validateGenre(newGenre)) {
      setValidationError("Thể loại này đã tồn tại!");
      return;
    }
    try {
      const added = await Genre_Services.CreateGenre({ name: newGenre });

      // Thêm thể loại mới vào mảng genres trong state mà không cần phải reload lại
      setGenres((prev) => [added, ...prev]);

      setNewGenre(""); // Reset input
      setShowModal(false);
      setValidationError("");
      toast.success("Thêm thể loại thành công!");
    } catch (error) {
      toast.error("Không thể thêm thể loại!");
    }
  };

  const editGenre = async () => {
    if (!currentGenre || !currentGenre.name || !currentGenre.genreId) {
      setValidationError("Tên thể loại không được để trống hoặc id không hợp lệ!");
      return;
    }

    try {
      const updated = await Genre_Services.UpdateGenre(parseInt(currentGenre.genreId, 10), {
        genreId: parseInt(currentGenre.genreId, 10),
        name: currentGenre.name,
      });

      // Optionally refetch genres to make sure everything is up to date
      fetchGenres(searchTerm, page);

      setCurrentGenre(null);
      setShowModal(false);
      setValidationError("");
      toast.success("Cập nhật thể loại thành công!");
    } catch (error) {
      toast.error("Không thể cập nhật thể loại!");
    }
  };


  // Delete a genre
  const deleteGenre = async () => {
    try {
      await Genre_Services.DeleteGenre(deleteGenreId);

      // Loại bỏ thể loại bị xóa khỏi genres trong state
      setGenres((prev) => prev.filter((genre) => genre.genreId !== deleteGenreId));

      toast.success("Xóa thể loại thành công!");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Không thể xóa thể loại!");
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchGenres(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page]);  // Fetch again only when debouncedSearchTerm or page changes

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Update search term
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);  // Cập nhật trang (subtract 1 vì trang bắt đầu từ 1 trong Pagination)
    fetchGenres(debouncedSearchTerm, newPage - 1);  // Gọi lại API để tải dữ liệu trang mới
  };
  


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Quản Lý Thể Loại
      </Typography>

      {/* Search bar */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <TextField
          variant="outlined"
          label="Tìm kiếm theo tên thể loại"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          sx={{ maxWidth: "300px" }}
        />

        {/* Add Genre Button */}
        <Button
          variant="contained"
          color="primary"
          style={{ textTransform: "none", width: "150px" }}
          onClick={() => {
            setCurrentGenre(null);
            setNewGenre("");
            setShowModal(true);
          }}
          sx={{ marginLeft: "auto" }}
        >
          <FaPlus />
        </Button>
      </Box>

      <TableContainer>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" ,justifyContent: "center"}}>
          Tên Thể Loại
        </TableCell>
        <TableCell sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", justifyContent: "center" }}>
          Hành Động
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {genres && genres.length > 0 ? (
        genres.map((genre) => (
          <TableRow key={genre.genreId}>
            <TableCell>{genre.name}</TableCell>
            <TableCell>
              <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setCurrentGenre(genre);
                      setShowModal(true);
                    }}
                    style={{ width: "32px", height: "32px" }}
                  >
                    <FaEdit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton
                    color="error"
                    onClick={() => {
                      setDeleteGenreId(genre.genreId);
                      setShowDeleteModal(true);
                    }}
                    style={{ width: "32px", height: "32px" }}
                  >
                    <FaTrashAlt />
                  </IconButton>
                </Tooltip>
              </Box>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={2} align="center">
            Không có dữ liệu
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

{/* Pagination */}
<Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
  <Pagination
    count={Math.ceil(totalCount / 10)}  // Tính tổng số trang
    page={page + 1}  // Chuyển trang hiện tại từ 0 sang 1
    onChange={handlePageChange}  // Cập nhật trang khi người dùng thay đổi
    color="primary"
    showFirstButton
    showLastButton
  />
</Box>







      {/* Modal for Add/Edit Genre */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            p: 3,
            backgroundColor: "white",
            borderRadius: 1,
            maxWidth: "400px",
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {currentGenre ? "Sửa Thể Loại" : "Thêm Thể Loại"}
          </Typography>
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
            error={!!validationError}
            helperText={validationError}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="contained" color="primary" onClick={currentGenre ? editGenre : addGenre}>
              Lưu
            </Button>
          </Box>
        </Box>
      </Modal>


      {/* Modal for Deleting Genre */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} centered>
        <Box sx={{ p: 3, backgroundColor: "white", borderRadius: 1, maxWidth: "400px", width: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Xác Nhận Xóa Thể Loại
          </Typography>
          <Typography>Bạn có chắc chắn muốn xóa thể loại này không?</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button variant="outlined" onClick={() => setShowDeleteModal(false)}>
              Hủy
            </Button>
            <Button variant="contained" color="error" onClick={deleteGenre}>
              Xóa
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Toast notifications */}
      <ToastContainer />
    </Box>
  );
};

export default GenresManager;
