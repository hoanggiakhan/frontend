import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { URL } from "../../utils/UrlBackend";
import { getIdUserByToken } from "../../utils/JwtService";
import { Category } from "./CategoryManager";

// Interface
interface Budget {
  id: number;
  category: string;
  amount: number;
  spent: number;
  status: "within" | "warning" | "exceeded";
}

const BudgetManager: React.FC = () => {
  const userId = getIdUserByToken();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<Partial<Budget>>({
    category: "",
    amount: 0,
    spent: 0,
  });

  // Lấy danh sách ngân sách từ backend
  const fetchBudgets = () => {
    axios.get(`${URL}/api/budgets/${userId}`)
      .then((response) => setBudgets(response.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  };

  // Lấy danh sách danh mục từ backend
  useEffect(() => {
    axios.get(`${URL}/api/categories/${userId}`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Lỗi khi lấy danh mục:", error));
  }, []);

  // Gọi fetchBudgets khi component mount
  useEffect(() => {
    fetchBudgets();
  }, []);

  // Thêm ngân sách mới
  const handleAddBudget = () => {
    if (!newBudget.category || newBudget.amount! <= 0 || newBudget.spent! < 0) {
      alert("Vui lòng nhập đầy đủ thông tin và số tiền hợp lệ.");
      return;
    }

    axios.post(`${URL}/api/budgets/create/${userId}`, newBudget)
      .then(() => {
        fetchBudgets(); // Gọi lại API để cập nhật danh sách ngay lập tức
        setShowModal(false);
        setNewBudget({ category: "", amount: 0, spent: 0 });
      })
      .catch((error) => console.error("Lỗi khi thêm ngân sách:", error));
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Danh sách ngân sách</Card.Title>
              <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                Thêm ngân sách
              </Button>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Danh mục</th>
                    <th>Giới hạn</th>
                    <th>Đã chi tiêu</th>
                    <th>Trạng thái</th>
                    <th>Thanh tiến trình</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => (
                    <tr key={budget.id}>
                      <td>{budget.category}</td>
                      <td>{budget.amount.toLocaleString()} VND</td>
                      <td>{budget.spent.toLocaleString()} VND</td>
                      <td>
                        <span
                          className={`badge ${
                            budget.status === "within"
                              ? "bg-success"
                              : budget.status === "warning"
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                        >
                          {budget.status === "within"
                            ? "Trong hạn"
                            : budget.status === "warning"
                            ? "Cảnh báo"
                            : "Vượt ngân sách"}
                        </span>
                      </td>
                      <td>
                        <ProgressBar
                          now={(budget.spent / budget.amount) * 100}
                          label={`${((budget.spent / budget.amount) * 100).toFixed(1)}%`}
                          variant={
                            budget.status === "within"
                              ? "success"
                              : budget.status === "warning"
                              ? "warning"
                              : "danger"
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Thêm ngân sách */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm ngân sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="budgetCategory">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              >
                <option value="">Chọn danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="budgetAmount">
              <Form.Label>Giới hạn chi tiêu</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giới hạn chi tiêu"
                value={newBudget.amount}
                onChange={(e) => setNewBudget({ ...newBudget, amount: +e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="budgetSpent">
              <Form.Label>Đã chi tiêu</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số tiền đã chi tiêu"
                value={newBudget.spent}
                onChange={(e) => setNewBudget({ ...newBudget, spent: +e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddBudget}>
            Lưu ngân sách
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BudgetManager;
