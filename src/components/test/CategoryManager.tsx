import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { getIdUserByToken } from "../../utils/JwtService";
import { URL } from "../../utils/UrlBackend";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

const CategoryManager: React.FC = () => {
  const userId = getIdUserByToken();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<Category>({ id: "", name: "", type: "expense" });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // 🔹 Lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URL}/api/categories/${userId}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Có lỗi khi lấy danh mục:", error);
      alert("Lỗi khi lấy danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Thêm danh mục mới
  const createCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${URL}/api/categories/create/${userId}`, newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowAddModal(false);
      fetchCategories(); // Cập nhật danh sách
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      alert("Không thể thêm danh mục. Vui lòng thử lại.");
    }
  };

  // 🔹 Chỉnh sửa danh mục
  const updateCategory = async () => {
    if (!selectedCategory || !selectedCategory.id) {
      alert("Lỗi: ID danh mục không hợp lệ!");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${URL}/api/categories/${selectedCategory.id}`, selectedCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setShowEditModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      alert("Không thể cập nhật danh mục. Vui lòng thử lại.");
    }
  };
  

  // 🔹 Xóa danh mục
  const handleDeleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      alert("Không thể xóa danh mục. Vui lòng thử lại.");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Danh sách danh mục</Card.Title>
              <Button
                variant="primary"
                onClick={() => {
                  setNewCategory({ id: "", name: "", type: "expense" });
                  setShowAddModal(true);
                }}
                className="mb-3"
              >
                Thêm danh mục
              </Button>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Tên danh mục</th>
                    <th>Loại</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.type === "income" ? "Thu nhập" : "Chi tiêu"}</td>
                      <td>
                        <Button
                          variant="warning"
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowEditModal(true);
                          }}
                          className="me-2"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteCategory(category.id)}>
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm danh mục */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="categoryType">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as "income" | "expense" })}
              >
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={createCategory}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal chỉnh sửa danh mục */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa danh mục</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục"
                value={selectedCategory?.name || ""}
                onChange={(e) => setSelectedCategory((prev) => prev ? { ...prev, name: e.target.value } : null)}
              />
            </Form.Group>
            <Form.Group controlId="categoryType">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={selectedCategory?.type || "expense"}
                onChange={(e) =>
                  setSelectedCategory((prev) => prev ? { ...prev, type: e.target.value as "income" | "expense" } : null)
                }
              >
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={updateCategory}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryManager;
