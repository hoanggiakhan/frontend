import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, ProgressBar } from "react-bootstrap";

// Interface cho ngân sách
interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  status: "within" | "warning" | "exceeded";
}

const BudgetManager: React.FC = () => {
  // Dữ liệu ngân sách mẫu
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 1, category: "Lương", limit: 5000, spent: 1500, status: "within" },
    { id: 2, category: "Mua sắm", limit: 2000, spent: 1800, status: "warning" },
    { id: 3, category: "Ăn uống", limit: 1000, spent: 1100, status: "exceeded" },
  ]);

  // State cho modal và form thêm ngân sách
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newBudget, setNewBudget] = useState<Budget>({
    id: 0,
    category: "",
    limit: 0,
    spent: 0,
    status: "within",
  });

  // Hàm tạo ngân sách mới
  const handleAddBudget = () => {
    if (!newBudget.category || newBudget.limit <= 0 || newBudget.spent < 0) {
      alert("Vui lòng nhập đầy đủ thông tin và số tiền hợp lệ.");
      return;
    }
    const newStatus = newBudget.spent > newBudget.limit ? "exceeded" : newBudget.spent >= newBudget.limit * 0.8 ? "warning" : "within";
    setBudgets([...budgets, { ...newBudget, id: budgets.length + 1, status: newStatus }]);
    setShowModal(false);
    setNewBudget({ id: 0, category: "", limit: 0, spent: 0, status: "within" });
  };

  // Hàm cập nhật trạng thái ngân sách (cảnh báo hoặc vượt ngân sách)
  // const updateBudgetStatus = (budget: Budget) => {
  //   if (budget.spent > budget.limit) {
  //     return "exceeded";
  //   } else if (budget.spent >= budget.limit * 0.8) {
  //     return "warning";
  //   } else {
  //     return "within";
  //   }
  // };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          {/* Danh sách ngân sách */}
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
                      <td>{budget.limit}</td>
                      <td>{budget.spent}</td>
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
                          now={(budget.spent / budget.limit) * 100}
                          label={`${((budget.spent / budget.limit) * 100).toFixed(1)}%`}
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
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="budgetLimit">
              <Form.Label>Giới hạn chi tiêu</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giới hạn chi tiêu"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: +e.target.value })}
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
