import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import { URL } from "../../utils/UrlBackend";
import { getIdUserByToken} from "../../utils/JwtService";

interface Debt {
  id: string;
  amount: number;
  debtType: "loan" | "debt";
  borrower: string;
  dueDate: string;
  debtStatus: "pending" | "paid" | "overdue";
}

const DebtManager = () => {
  const userId = getIdUserByToken();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [newDebt, setNewDebt] = useState<Debt>({
    id: "",
    amount: 0,
    debtType: "loan",
    borrower: "",
    dueDate: "",
    debtStatus: "pending",
  });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${URL}/api/debts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDebts(response.data);
    } catch (error) {
      console.error("Error fetching debts:", error);
    }
  };

  const handleAddDebt = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Chuyển đổi dueDate từ "YYYY-MM-DD" → "YYYY-MM-DDTHH:mm:ss"
      const formattedDebt = {
        ...newDebt,
        dueDate: moment(newDebt.dueDate, "YYYY-MM-DD").toISOString(), 
      };
  
      await axios.post(`${URL}/api/debts/create/${userId}`, formattedDebt, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setShowAddModal(false);
      setNewDebt({ id: "", amount: 0, debtType: "loan", borrower: "", dueDate: "", debtStatus: "pending" });
      fetchDebts();
    } catch (error) {
      console.error("Lỗi khi thêm khoản vay nợ:", error);
      alert("Không thể thêm. Vui lòng thử lại.");
    }
  };
  
  const handleEditDebt = async () => {
    if (!editingDebt) return;
    try {
      const token = localStorage.getItem("token");
  
      const formattedDebt = {
        ...editingDebt,
        dueDate: moment(editingDebt.dueDate, "YYYY-MM-DD").toISOString(),
      };
  
      await axios.put(`${URL}/api/debts/${editingDebt.id}`, formattedDebt, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setShowEditModal(false);
      setEditingDebt(null);
      fetchDebts();
    } catch (error) {
      console.error("Error editing debt:", error);
    }
  };
  
  const handleDeleteDebt = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khoản vay/nợ này?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${URL}/api/debts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchDebts();
      } catch (error) {
        console.error("Error deleting debt:", error);
      }
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Danh sách khoản vay/nợ</Card.Title>
              <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
                Thêm khoản vay/nợ
              </Button>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Người vay/nợ</th>
                    <th>Số tiền</th>
                    <th>Loại</th>
                    <th>Ngày đáo hạn</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt) => (
                    <tr key={debt.id}>
                      <td>{debt.borrower}</td>
                      <td>{debt.amount.toLocaleString()} VND</td>
                      <td>{debt.debtType === "loan" ? "Cho vay" : "Đi vay"}</td>
                      <td>{moment(debt.dueDate).format("DD/MM/YYYY")}</td>
                      <td>
                        <Badge bg={debt.debtStatus === "pending" ? "warning" : debt.debtStatus === "overdue" ? "danger" : "success"}>
                          {debt.debtStatus === "pending" ? "Đến hạn" : debt.debtStatus === "overdue" ? "Quá hạn" : "Đã trả"}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => { setEditingDebt(debt); setShowEditModal(true); }}>Sửa</Button>{" "}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteDebt(debt.id)}>Xóa</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Thêm */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm khoản vay/nợ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Người vay/nợ</Form.Label>
              <Form.Control type="text" value={newDebt.borrower} onChange={(e) => setNewDebt({ ...newDebt, borrower: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Số tiền</Form.Label>
              <Form.Control type="number" value={newDebt.amount} onChange={(e) => setNewDebt({ ...newDebt, amount: +e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Loại khoản nợ</Form.Label>
              <Form.Select value={newDebt.debtType} onChange={(e) => setNewDebt({ ...newDebt, debtType: e.target.value as "loan" | "debt" })}>
                <option value="loan">Cho vay</option>
                <option value="debt">Đi vay</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Ngày đáo hạn</Form.Label>
              <Form.Control type="date" value={newDebt.dueDate} onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={handleAddDebt}>Lưu</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Sửa */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa khoản nợ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Số tiền</Form.Label>
              <Form.Control type="number" value={editingDebt?.amount || 0} onChange={(e) => setEditingDebt({ ...editingDebt!, amount: +e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Đóng</Button>
          <Button variant="primary" onClick={handleEditDebt}>Cập nhật</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DebtManager;
