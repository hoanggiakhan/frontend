import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { URL } from "../../utils/UrlBackend";
import { getIdUserByToken } from "../../utils/JwtService";
import { Category } from "./CategoryManager";
import moment from "moment";

interface Transaction {
  id: number;
  date: string;
  category: string;
  amount: number;
  notes: string;
  type: "income" | "expense";
}

const TransactionManager: React.FC = () => {
  const userId = getIdUserByToken();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: 0,
    date: "",
    category: "",
    amount: 0,
    notes: "",
    type: "expense",
  });

  const [filter, setFilter] = useState({
    date: "",
    category: "",
    minAmount: 0,
    maxAmount: 0,
    type: "all" as "income" | "expense" | "all",
  });

  useEffect(() => {
    axios.get(URL+`/api/categories/budget/${userId}`)
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const fetchTransactions = () => {
    axios.get(`${URL}/api/transactions/${userId}`)
      .then(response => setTransactions(response.data))
      .catch(error => console.error("Error fetching transactions:", error));
  };
  
  useEffect(() => {
    fetchTransactions(); // Gọi API khi component load
  }, []);
  
  const handleAddTransaction = () => {
    const formattedTransaction = {
      ...newTransaction,
      date: moment(newTransaction.date, "YYYY-MM-DD").toISOString(),
    };
  
    axios.post(`${URL}/api/transactions/${userId}`, formattedTransaction)
      .then(() => {
        fetchTransactions(); // ✅ Load lại danh sách
        setShowModal(false);
        setNewTransaction({ id: 0, date: "", category: "", amount: 0, notes: "", type: "expense" });
      })
      .catch(error => console.error("Error adding transaction:", error));
  };
  
  const handleDeleteTransaction = (id: number) => {
    axios.delete(`${URL}/api/transactions/${id}`)
      .then(() => fetchTransactions()) // ✅ Load lại danh sách
      .catch(error => console.error("Error deleting transaction:", error));
  };
  

  const filteredTransactions = transactions.filter(transaction => (
    (filter.type === "all" || transaction.type === filter.type) &&
    (filter.category === "" || transaction.category === filter.category) &&
    (filter.date === "" || transaction.date.includes(filter.date)) &&
    (filter.minAmount === 0 || transaction.amount >= filter.minAmount) &&
    (filter.maxAmount === 0 || transaction.amount <= filter.maxAmount)
  ));

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
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
                      <Form.Select value={filter.category} onChange={(e) => setFilter({ ...filter, category: e.target.value })}>
                        <option value="">Tất cả</option>
                        {categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
                      </Form.Select>
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
          <Card>
            <Card.Body>
              <Card.Title>Danh sách giao dịch</Card.Title>
              <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">Thêm giao dịch</Button>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Danh mục</th>
                    <th>Số tiền</th>
                    <th>Ghi chú</th>
                    <th>Loại</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{transaction.date}</td>
                      <td>{transaction.category}</td>
                      <td>{transaction.amount.toLocaleString()} VND</td>
                      <td>{transaction.notes}</td>
                      <td>{transaction.type === "income" ? "Thu nhập" : "Chi tiêu"}</td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteTransaction(transaction.id)}>Xóa</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* <Form.Group controlId="transactionDate">
              <Form.Label>Ngày</Form.Label>
              <Form.Control type="date" value={newTransaction.date} onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} />
            </Form.Group> */}
            <Form.Group controlId="transactionCategory">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select value={newTransaction.category} onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}>
                <option value="">Chọn danh mục</option>
                {categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="transactionAmount">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control type="number" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })} />
            </Form.Group>
            <Form.Group controlId="transactionNotes">
              <Form.Label>Ghi chú</Form.Label>
              <Form.Control type="text" value={newTransaction.notes} onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="transactionType">
              <Form.Label>Loại giao dịch</Form.Label>
              <Form.Select value={newTransaction.type} onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as "income" | "expense" })}>
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={handleAddTransaction}>Thêm giao dịch</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransactionManager;
