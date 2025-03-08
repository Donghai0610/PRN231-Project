import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Actor_Service from "../../services/actor";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const ActorManagement = () => {
  const [actors, setActors] = useState([]);
  const [currentActor, setCurrentActor] = useState(null);
  const [newActor, setNewActor] = useState("");
  const [newBio, setNewBio] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [page, setPage] = useState(1); // Current page
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalItems, setTotalItems] = useState(0); // Total number of items
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // State to handle show details modal
  const [deleteActorId, setDeleteActorId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationError, setValidationError] = useState("");

  // Fetch actors based on search, page, and pageSize
  const fetchActors = async (searchTerm = "", page = 0, pageSize = 5) => {
    try {
      const data = await Actor_Service.GetAllActors(page, pageSize, searchTerm); // Get actors from API with search
      setActors(data.data); // Set the actors data to state (data.data is the array of actors)
      setTotalItems(data.totalItems); // Set total items for pagination
    } catch (error) {
      console.error("Không thể lấy danh sách diễn viên:", error);
    }
  };

  // Search term change handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage); // Update the current page
    fetchActors(searchTerm, newPage, pageSize); // Fetch data when page changes
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = event.target.value;
    setPageSize(newPageSize); // Update page size
    setPage(1); // Reset page to 0 when page size changes
    fetchActors(searchTerm, 0, newPageSize); // Fetch data for the first page
  };

  useEffect(() => {
    fetchActors(searchTerm, page, pageSize); // Fetch actors whenever searchTerm, page, or pageSize changes
  }, [searchTerm, page, pageSize]);

  const validateActor = (name) => {
    const isDuplicate = actors.some((actor) => actor.fullName.toLowerCase() === name.toLowerCase());
    return isDuplicate;
  };

  const addActor = async () => {
    if (!newActor) {
      setValidationError("Tên diễn viên không được để trống!");
      return;
    }

    if (validateActor(newActor)) {
      setValidationError("Diễn viên này đã tồn tại!");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", newActor);
    formData.append("bio", newBio);
    formData.append("birthDate", newBirthDate);
    if (newImage) formData.append("image", newImage);

    try {
      const added = await Actor_Service.AddActor(newActor, newBio, newBirthDate, newImage);
      setActors((prev) => [...prev, added]);
      setNewActor("");
      setNewBio("");
      setNewBirthDate("");
      setNewImage(null);
      setNewImagePreview(null);
      setShowAddEditModal(false);
      setValidationError("");
      toast.success("Thêm diễn viên thành công!");
      setError(null);
    } catch (error) {
      setValidationError("Không thể thêm diễn viên. Vui lòng thử lại!");
      toast.error("Không thể thêm diễn viên!");
    }
  };

  const editActor = async () => {
    if (!currentActor || !currentActor.fullName) {
      setValidationError("Tên diễn viên không được để trống!");
      return;
    }

    const formData = new FormData();
    formData.append("actorId", currentActor.actorId);
    formData.append("fullName", currentActor.fullName);
    formData.append("bio", currentActor.bio);
    formData.append("birthDate", currentActor.birthDate);
    if (newImage) formData.append("image", newImage);

    try {
      const updated = await Actor_Service.UpdateActor(currentActor.actorId, currentActor.fullName, currentActor.bio, currentActor.birthDate, newImage);
      setActors((prev) => prev.map((actor) => (actor.actorId === updated.actorId ? updated : actor)));
      setCurrentActor(null);
      setShowAddEditModal(false);
      setValidationError("");
      toast.success("Cập nhật diễn viên thành công!");
      fetchActors(searchTerm, page, pageSize); // Fetch again to reload the list
    } catch (error) {
      setValidationError("Không thể cập nhật diễn viên. Vui lòng thử lại!");
      toast.error("Không thể cập nhật diễn viên!");
    }
  };

  const deleteActor = async () => {
    try {
      await Actor_Service.DeleteActor(deleteActorId);
      setActors((prev) => prev.filter((actor) => actor.actorId !== deleteActorId));
      toast.success("Xóa diễn viên thành công!");
      fetchActors(searchTerm, page, pageSize); // Fetch again to reload the list
      setShowDeleteModal(false);
      setDeleteActorId(null);
    } catch (error) {
      toast.error("Không thể xóa diễn viên. Vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    setValidationError("");
    setShowAddEditModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteActorId(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Modal to view details of an actor
  const handleViewDetailsClose = () => {
    setShowDetailModal(false);  // Close the detail modal
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Chỉ lấy phần ngày "yyyy-MM-dd"
  };

  // Ví dụ sử dụng trong component
  const formattedDate = formatDate("2025-02-28T00:00:00");
  console.log(formattedDate);  // Output: "2025-02-28"


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Quản Lý Diễn Viên
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Tìm kiếm diễn viên"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentActor(null);
              setNewActor("");
              setNewBio("");
              setNewBirthDate("");
              setNewImage(null);
              setNewImagePreview(null);
              setShowAddEditModal(true);
            }}
          >
            Thêm Diễn Viên
          </Button>
        </Grid>
      </Grid>

      {/* Table for displaying actors */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell >ID</TableCell>
              <TableCell>Tên Diễn Viên</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Phim Tham Gia</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actors.map((actor) => (
              <TableRow key={actor.actorId}>
                <TableCell>{actor.actorId}</TableCell>
                <TableCell>{actor.fullName}</TableCell>
                <TableCell>
                  <img
                    src={actor.image}
                    alt={actor.fullName}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>
                  {actor.movies && actor.movies.length > 0
                    ? actor.movies.map((movie) => movie.movieName).join(", ")
                    : "Chưa có phim tham gia"}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
                    <Tooltip title="Chỉnh sửa" arrow>
                      <IconButton
                        color="warning"
                        onClick={() => {
                          setCurrentActor(actor);
                          setShowAddEditModal(true);
                        }}
                        style={{ width: "25%" }}
                      >
                        <FaEdit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Xóa" arrow>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setDeleteActorId(actor.actorId);
                          setShowDeleteModal(true);
                        }}
                        style={{ width: "25%" }}
                      >
                        <FaTrashAlt />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Hiển thị chi tiết" arrow>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setCurrentActor(actor);
                          setShowDetailModal(true); // Show details modal on click
                        }}
                        style={{ width: "25%" }}
                      >
                        <FaEye />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <ToastContainer position="top-right" autoClose={5000} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={totalItems}
        page={page - 1}
        onPageChange={(e, newPage) => setPage(newPage + 1)} // Adjust page numbering to start from 1
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => setPageSize(e.target.value)}
        rowsPerPageOptions={[5, 10]}
      />

      {/* Add/Edit Actor Modal */}
      <Dialog open={showAddEditModal} onClose={handleCancel}>
        <DialogTitle>{currentActor ? "Sửa Diễn Viên" : "Thêm Diễn Viên"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên Diễn Viên"
            value={currentActor ? currentActor.fullName : newActor}
            onChange={(e) =>
              currentActor
                ? setCurrentActor({ ...currentActor, fullName: e.target.value })
                : setNewActor(e.target.value)
            }
            error={!!validationError}
            helperText={validationError}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Tiểu Sử"
            value={currentActor ? currentActor.bio : newBio}
            onChange={(e) =>
              currentActor
                ? setCurrentActor({ ...currentActor, bio: e.target.value })
                : setNewBio(e.target.value)
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Ngày Sinh"
            type="date"
            value={currentActor ? formatDate(currentActor.birthDate) : newBirthDate}
            onChange={(e) =>
              currentActor
                ? setCurrentActor({ ...currentActor, birthDate: e.target.value })
                : setNewBirthDate(e.target.value)
            }
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: 20 }}
          />
          {newImagePreview && <img src={newImagePreview} alt="preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Hủy
          </Button>
          <Button onClick={currentActor ? editActor : addActor} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Actor Confirmation Modal */}
      <Dialog open={showDeleteModal} onClose={handleDeleteCancel}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa diễn viên này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Hủy
          </Button>
          <Button onClick={deleteActor} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Actor Details Modal */}
      <Dialog open={showDetailModal} onClose={handleViewDetailsClose}>
        <DialogTitle>Thông Tin Diễn Viên</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Tên Diễn Viên: {currentActor?.fullName}</Typography>
          <Typography variant="body1">Tiểu Sử: {currentActor?.bio}</Typography>
          <Typography variant="body1">Ngày Sinh: {currentActor?.birthDate}</Typography>
          <img src={currentActor?.image} alt={currentActor?.fullName} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDetailsClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActorManagement;
