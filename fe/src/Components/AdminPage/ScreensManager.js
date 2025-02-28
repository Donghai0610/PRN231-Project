import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container, Alert } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";

const ScreensManager = () => {
  const [screens, setScreens] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null);
  const [newScreen, setNewScreen] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteScreenId, setDeleteScreenId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationError, setValidationError] = useState("");

  const fetchScreens = async () => {
    try {
      const data = await fetchData("screens");
      setScreens(data);
    } catch (error) {
      console.error("Không thể lấy danh sách màn hình:", error);
    }
  };

  const validateScreen = (name) => {
    const isDuplicate = screens.some((screen) => screen.name.toLowerCase() === name.toLowerCase());
    return isDuplicate;
  };

  const addScreen = async () => {
    if (!newScreen) {
      setValidationError("Tên màn hình không được để trống!");
      return;
    }

    if (validateScreen(newScreen)) {
      setValidationError("Màn hình này đã tồn tại!");
      return;
    }

    try {
      const added = await postData("screens", { name: newScreen, status: newStatus });
      setScreens((prev) => [...prev, added]);
      setNewScreen("");
      setNewStatus("active");
      setShowAddEditModal(false);
      setValidationError("");
      setSuccess("Thêm màn hình thành công!");
      setError(null);
    } catch (error) {
      console.error("Không thể thêm màn hình:", error);
      setValidationError("Không thể thêm màn hình. Vui lòng thử lại!");
      setError("Không thể thêm màn hình!");
      setSuccess(null);
    }
  };

  const editScreen = async () => {
    if (!currentScreen || !currentScreen.name) {
      setValidationError("Tên màn hình không được để trống!");
      return;
    }

    if (validateScreen(currentScreen.name)) {
      setValidationError("Màn hình này đã tồn tại!");
      return;
    }

    try {
      const updated = await updateData("screens", currentScreen.id, {
        id: currentScreen.id,
        name: currentScreen.name,
        status: currentScreen.status,
      });
      setScreens((prev) =>
        prev.map((screen) => (screen.id === updated.id ? updated : screen))
      );
      setCurrentScreen(null);
      setShowAddEditModal(false);
      setValidationError("");
      setSuccess("Cập nhật màn hình thành công!");
    } catch (error) {
      console.error("Không thể cập nhật màn hình:", error);
      setValidationError("Không thể cập nhật màn hình. Vui lòng thử lại!");
      setError("Không thể cập nhật màn hình!");
      setSuccess(null);
    }
  };

  const toggleStatus = async (screen) => {
    const updatedStatus = screen.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateData("screens", screen.id, {
        ...screen,
        status: updatedStatus,
      });
      setScreens((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setSuccess("Cập nhật trạng thái màn hình thành công!");
      setError(null);
    } catch (error) {
      console.error("Không thể thay đổi trạng thái:", error);
      setError("Không thể thay đổi trạng thái màn hình. Vui lòng thử lại!");
      setSuccess(null);
    }
  };

  const deleteScreen = async () => {
    try {
      await deleteData("screens", deleteScreenId);
      setScreens((prev) => prev.filter((screen) => screen.id !== deleteScreenId));
      setSuccess("Xóa màn hình thành công!");
      setError(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Không thể xóa màn hình:", error);
      setError("Không thể xóa màn hình. Vui lòng thử lại!");
      setSuccess(null);
      setShowDeleteModal(false);
    }
  };

  const handleCancel = () => {
    setValidationError("");
    setShowAddEditModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDeleteScreenId(null);
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Màn Hình</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên Màn Hình</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((screen) => (
            <tr key={screen.id}>
              <td>{screen.id}</td>
              <td>{screen.name}</td>
              <td>
                <Button
                  variant={screen.status === "active" ? "success" : "secondary"}
                  onClick={() => toggleStatus(screen)}
                >
                  {screen.status === "active" ? "Hoạt động" : "Vô hiệu"}
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentScreen(screen);
                    setShowAddEditModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setDeleteScreenId(screen.id);
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
          setCurrentScreen(null);
          setNewScreen("");
          setNewStatus("active");
          setShowAddEditModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Màn Hình
      </Button>

      <Modal
        show={showAddEditModal}
        onHide={handleCancel}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentScreen ? "Sửa Màn Hình" : "Thêm Màn Hình"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formScreenName">
              <Form.Label>* Tên Màn Hình</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên màn hình"
                value={currentScreen ? currentScreen.name : newScreen}
                onChange={(e) => {
                  currentScreen
                    ? setCurrentScreen({
                      ...currentScreen,
                      name: e.target.value,
                    })
                    : setNewScreen(e.target.value);
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
            onClick={currentScreen ? editScreen : addScreen}
          >
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác nhận xóa */}
      <Modal
        show={showDeleteModal}
        onHide={handleDeleteCancel}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa màn hình này?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Hủy
          </Button>
          <Button variant="danger" onClick={deleteScreen}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ScreensManager;
