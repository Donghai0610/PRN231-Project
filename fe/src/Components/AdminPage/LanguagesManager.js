import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal, Container, Alert } from "react-bootstrap";
import { fetchData, postData, updateData, deleteData } from "../API/ApiService";
import "../../CSS/LanguagesManager.css";

const LanguagesManager = () => {
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [newLanguage, setNewLanguage] = useState("");
  const [newStatus, setNewStatus] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLanguageId, setDeleteLanguageId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationError, setValidationError] = useState("");

  const fetchLanguages = async () => {
    try {
      const data = await fetchData("languages");
      setLanguages(data);
    } catch (error) {
      console.error("Không thể lấy dữ liệu ngôn ngữ:", error);
    }
  };

  const validateLanguage = (name) => {
    const isDuplicate = languages.some((lang) => lang.name.toLowerCase() === name.toLowerCase());
    return isDuplicate;
  };

  const addLanguage = async () => {
    if (!newLanguage) {
      setValidationError("Tên ngôn ngữ không được để trống!");
      return;
    }

    if (validateLanguage(newLanguage)) {
      setValidationError("Ngôn ngữ này đã tồn tại!");
      return;
    }

    try {
      const added = await postData("languages", {
        name: newLanguage,
        status: newStatus,
      });
      setLanguages((prev) => [...prev, added]);
      setNewLanguage("");
      setNewStatus("active");
      setShowModal(false);
      setValidationError("");
      setSuccess("Thêm ngôn ngữ thành công!");
      setError(null);
    } catch (error) {
      console.error("Không thể thêm ngôn ngữ:", error);
      setValidationError("Không thể thêm ngôn ngữ. Vui lòng thử lại!");
      setError("Không thể thêm ngôn ngữ!");
      setSuccess(null);
    }
  };

  const editLanguage = async () => {
    if (!currentLanguage || !currentLanguage.name) {
      setValidationError("Tên ngôn ngữ không được để trống!");
      return;
    }

    if (validateLanguage(currentLanguage.name)) {
      setValidationError("Ngôn ngữ này đã tồn tại!");
      return;
    }

    try {
      const updated = await updateData("languages", currentLanguage.id, {
        id: currentLanguage.id,
        name: currentLanguage.name,
        status: currentLanguage.status,
      });
      setLanguages((prev) =>
        prev.map((lang) => (lang.id === updated.id ? updated : lang))
      );
      setCurrentLanguage(null);
      setShowModal(false);
      setValidationError("");
      setSuccess("Cập nhật ngôn ngữ thành công!");
    } catch (error) {
      console.error("Không thể cập nhật ngôn ngữ:", error);
      setValidationError("Không thể cập nhật ngôn ngữ. Vui lòng thử lại!");
      setError("Không thể cập nhật ngôn ngữ!");
      setSuccess(null);
    }
  };

  const toggleStatus = async (lang) => {
    const updatedStatus = lang.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateData("languages", lang.id, {
        ...lang,
        status: updatedStatus,
      });
      setLanguages((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setSuccess("Cập nhật trạng thái ngôn ngữ thành công!");
      setError(null);
    } catch (error) {
      console.error("Không thể thay đổi trạng thái:", error);
      setError("Không thể thay đổi trạng thái ngôn ngữ. Vui lòng thử lại!");
      setSuccess(null);
    }
  };

  const deleteLanguage = async () => {
    try {
      await deleteData("languages", deleteLanguageId);
      setLanguages((prev) => prev.filter((lang) => lang.id !== deleteLanguageId));
      setSuccess("Xóa ngôn ngữ thành công!");
      setError(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Không thể xóa ngôn ngữ:", error);
      setError("Không thể xóa ngôn ngữ. Vui lòng thử lại!");
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
    setDeleteLanguageId(null);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <Container>
      <h2 className="my-4 text-center">Quản Lý Ngôn Ngữ</h2>
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Ngôn Ngữ</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang) => (
            <tr key={lang.id}>
              <td>{lang.id}</td>
              <td>{lang.name}</td>
              <td>
                <Button
                  variant={lang.status === "active" ? "success" : "secondary"}
                  onClick={() => toggleStatus(lang)}
                >
                  {lang.status === "active" ? "Hoạt động" : "Vô hiệu"}
                </Button>
              </td>
              <td>
                <Button
                  variant="warning"
                  className="me-2"
                  onClick={() => {
                    setCurrentLanguage(lang);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i> Sửa
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setDeleteLanguageId(lang.id);
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
          setCurrentLanguage(null);
          setNewLanguage("");
          setNewStatus("active");
          setShowModal(true);
        }}
      >
        <i className="bi bi-plus-circle"></i> Thêm Ngôn Ngữ
      </Button>

      <Modal
        show={showModal}
        onHide={handleCancel}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {currentLanguage ? "Sửa Ngôn Ngữ" : "Thêm Ngôn Ngữ"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formLanguageName">
              <Form.Label>* Tên Ngôn Ngữ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên ngôn ngữ"
                value={currentLanguage ? currentLanguage.name : newLanguage}
                onChange={(e) => {
                  currentLanguage
                    ? setCurrentLanguage({ ...currentLanguage, name: e.target.value })
                    : setNewLanguage(e.target.value);
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
            onClick={currentLanguage ? editLanguage : addLanguage}
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
          <Modal.Title>Xác Nhận Xóa Ngôn Ngữ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa ngôn ngữ này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Hủy
          </Button>
          <Button variant="danger" onClick={deleteLanguage}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LanguagesManager;
