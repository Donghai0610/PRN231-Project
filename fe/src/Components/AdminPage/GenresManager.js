import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container, Alert } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const GenresManager = () => {
  const [genres, setGenres] = useState([]);
  const [currentGenre, setCurrentGenre] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteGenreId, setDeleteGenreId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationError, setValidationError] = useState("");

  const fetchGenres = async () => {
    try {
      const data = await fetchData("genres");
      setGenres(data);
    } catch (error) {
      console.error("Không thể lấy dữ liệu thể loại:", error);
    }
  };

  const validateGenre = (name) => {
    const isDuplicate = genres.some((genre) => genre.name.toLowerCase() === name.toLowerCase());
    return isDuplicate;
  };

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
      const added = await postData("genres", { name: newGenre, status: newStatus });
      setGenres((prev) => [...prev, added]);
      setNewGenre("");
      setNewStatus("active");
      setShowModal(false);
      setValidationError("");
      setSuccess("Thêm thể loại thành công!");
      setError(null);
    } catch (error) {
      console.error("Không thể thêm thể loại:", error);
      setValidationError("Không thể thêm thể loại. Vui lòng thử lại!");
      setError("Không thể thêm thể loại!");
      setSuccess(null);
    }
  };

  const editGenre = async () => {
    if (!currentGenre || !currentGenre.name) {
      setValidationError("Tên thể loại không được để trống!");
      return;
    }

    if (validateGenre(currentGenre.name)) {
      setValidationError("Thể loại này đã tồn tại!");
      return;
    }

    try {
      const updated = await updateData("genres", currentGenre.id, {
        id: currentGenre.id,
        name: currentGenre.name,
        status: currentGenre.status,
      });
      setGenres((prev) =>
        prev.map((genre) => (genre.id === updated.id ? updated : genre))
      );
      setCurrentGenre(null);
      setShowModal(false);
      setValidationError("");
      setSuccess("Cập nhật thể loại thành công!");
    } catch (error) {
      console.error("Không thể cập nhật thể loại:", error);
      setValidationError("Không thể cập nhật thể loại. Vui lòng thử lại!");
      setError("Không thể cập nhật thể loại!");
      setSuccess(null);
    }
  };

  const toggleStatus = async (genre) => {
    const updatedStatus = genre.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateData("genres", genre.id, {
        ...genre,
        status: updatedStatus,
      });
      setGenres((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setSuccess("Cập nhật trạng thái thể loại thành công!");
      setError(null);
    } catch (error) {
      console.error("Không thể thay đổi trạng thái thể loại:", error);
      setError("Không thể thay đổi trạng thái thể loại. Vui lòng thử lại!");
      setSuccess(null);
    }
  };

  const deleteGenre = async () => {
    try {
      await deleteData("genres", deleteGenreId);
      setGenres((prev) => prev.filter((genre) => genre.id !== deleteGenreId));
      setSuccess("Xóa thể loại thành công!");
      setError(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Không thể xóa thể loại:", error);
      setError("Không thể xóa thể loại. Vui lòng thử lại!");
      setSuccess(null);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setValidationError("");
    setShowModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteGenreId(null);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Thể Loại</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Thể Loại</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre) => (
            <tr key={genre.id}>
              <td>{genre.id}</td>
              <td>{genre.name}</td>
              <td>
                <Button
                  variant={genre.status === "active" ? "success" : "secondary"}
                  onClick={() => toggleStatus(genre)}
                >
                  {genre.status === "active" ? "Hoạt động" : "Vô hiệu"}
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentGenre(genre);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setDeleteGenreId(genre.id);
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="bi bi-trash"></i> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        variant="primary"
        className="mt-3"
        onClick={() => {
          setCurrentGenre(null);
          setNewGenre("");
          setNewStatus("active");
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Thể Loại
      </Button>

      <Modal
        show={showModal}
        onHide={handleCancel}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentGenre ? "Sửa Thể Loại" : "Thêm Thể Loại"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGenreName">
              <Form.Label>* Tên Thể Loại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên thể loại"
                value={currentGenre ? currentGenre.name : newGenre}
                onChange={(e) => {
                  currentGenre
                    ? setCurrentGenre({
                      ...currentGenre,
                      name: e.target.value,
                    })
                    : setNewGenre(e.target.value);
                  setValidationError("");
                }}
                isInvalid={validationError}
              />
              {validationError && (
                <Form.Control.Feedback type="invalid">
                  {validationError}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={currentGenre ? editGenre : addGenre}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={handleDeleteCancel}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Xóa Thể Loại</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa thể loại này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Hủy
          </Button>
          <Button variant="danger" onClick={deleteGenre}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GenresManager;
