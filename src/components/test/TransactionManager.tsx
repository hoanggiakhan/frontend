import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup } from "react-bootstrap";

// Interface cho giao dịch
interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  notes: string;
  type: "income" | "expense";
}

const TransactionManager: React.FC = () => {
  // Dữ liệu giao dịch mẫu
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2025-02-05", category: "Mua sắm", amount: -150, notes: "Mua quần áo", type: "expense" },
    { id: 2, date: "2025-02-01", category: "Lương", amount: 2500, notes: "Lương tháng 2", type: "income" },
    { id: 3, date: "2025-02-03", category: "Ăn uống", amount: -100, notes: "Ăn trưa", type: "expense" },
  ]);

  // State để mở modal và lưu thông tin giao dịch mới
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: 0,
    date: "",
    category: "",
    amount: 0,
    notes: "",
    type: "expense",
  });

  // State cho bộ lọc
  const [filter, setFilter] = useState({
    date: "",
    category: "",
    minAmount: 0,
    maxAmount: 0,
    type: "all" as "income" | "expense" | "all",
  });

  // Hàm để thêm giao dịch mới
  const handleAddTransaction = () => {
    setTransactions([...transactions, { ...newTransaction, id: transactions.length + 1 }]);
    setShowModal(false);
    setNewTransaction({ id: 0, date: "", category: "", amount: 0, notes: "", type: "expense" });
  };

  // Hàm để xóa giao dịch
  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Hàm để lọc giao dịch
  const filteredTransactions = transactions.filter(transaction => {
    return (
      (filter.type === "all" || transaction.type === filter.type) &&
      (filter.category === "" || transaction.category === filter.category) &&
      (filter.date === "" || transaction.date.includes(filter.date)) &&
      (filter.minAmount === 0 || transaction.amount >= filter.minAmount) &&
      (filter.maxAmount === 0 || transaction.amount <= filter.maxAmount)
    );
  });

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          {/* Bộ lọc giao dịch */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Bộ lọc</Card.Title>
              <Form>
                <Row>
                  <Col sm={6} md={3}>
                    <Form.Group controlId="filterDate">
                      <Form.Label>Ngày</Form.Label>
                      <Form.Control
                        type="date"
                        value={filter.date}
                        onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={3}>
                    <Form.Group controlId="filterCategory">
                      <Form.Label>Danh mục</Form.Label>
                      <Form.Control
                        type="text"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={3}>
                    <Form.Group controlId="filterMinAmount">
                      <Form.Label>Khoảng tiền</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          placeholder="Từ"
                          value={filter.minAmount}
                          onChange={(e) => setFilter({ ...filter, minAmount: +e.target.value })}
                        />
                        <Form.Control
                          type="number"
                          placeholder="Đến"
                          value={filter.maxAmount}
                          onChange={(e) => setFilter({ ...filter, maxAmount: +e.target.value })}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={3}>
                    <Form.Group controlId="filterType">
                      <Form.Label>Loại</Form.Label>
                      <Form.Select
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value as "income" | "expense" | "all" })}
                      >
                        <option value="all">Tất cả</option>
                        <option value="income">Thu nhập</option>
                        <option value="expense">Chi tiêu</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Bảng danh sách giao dịch */}
          <Card>
            <Card.Body>
              <Card.Title>Danh sách giao dịch</Card.Title>
              <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                Thêm giao dịch
              </Button>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Danh mục</th>
                    <th>Số tiền</th>
                    <th>Ghi chú</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.notes}</td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteTransaction(transaction.id)}>
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

      {/* Modal Thêm giao dịch */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="transactionDate">
              <Form.Label>Ngày</Form.Label>
              <Form.Control
                type="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="transactionCategory">
              <Form.Label>Danh mục</Form.Label>
              <Form.Control
                type="text"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="transactionAmount">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: +e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="transactionNotes">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control
                type="text"
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="transactionType">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as "income" | "expense" })}
              >
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddTransaction}>
            Thêm giao dịch
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransactionManager;
