import React, { useState } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import moment from "moment";

// Interface cho khoản nợ/vay
interface Debt {
  id: number;
  lender: string;
  amount: number;
  dueDate: string;
  status: "due" | "paid" | "overdue"; // Trạng thái: Đến hạn, Đã trả, Quá hạn
}

const DebtManager: React.FC = () => {
  // Dữ liệu khoản vay/nợ mẫu
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, lender: "Nguyễn Văn A", amount: 5000, dueDate: "2025-02-10", status: "due" },
    { id: 2, lender: "Lê Thị B", amount: 2000, dueDate: "2025-01-30", status: "overdue" },
    { id: 3, lender: "Trần C", amount: 10000, dueDate: "2025-03-05", status: "due" },
  ]);

  // State cho modal và form thêm khoản nợ
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newDebt, setNewDebt] = useState<Debt>({
    id: 0,
    lender: "",
    amount: 0,
    dueDate: "",
    status: "due",
  });

  // Hàm tạo khoản nợ/vay mới
  const handleAddDebt = () => {
    if (!newDebt.lender || newDebt.amount <= 0 || !newDebt.dueDate) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ.");
      return;
    }
    const newStatus = moment(newDebt.dueDate).isBefore(moment()) ? "overdue" : "due";
    setDebts([...debts, { ...newDebt, id: debts.length + 1, status: newStatus }]);
    setShowModal(false);
    setNewDebt({ id: 0, lender: "", amount: 0, dueDate: "", status: "due" });
  };

  // Hàm cập nhật trạng thái khoản nợ khi đến hạn
  // const updateDebtStatus = (debt: Debt) => {
  //   if (moment(debt.dueDate).isBefore(moment())) {
  //     return "overdue";
  //   } else if (moment(debt.dueDate).isSameOrBefore(moment().add(3, "days"))) {
  //     return "due"; // Nhắc nhở nếu sắp đến hạn
  //   } else {
  //     return "paid";
  //   }
  // };

  return (
    <Container fluid>
      <Row>
        <Col md={12}>
          {/* Danh sách các khoản vay/nợ */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Danh sách khoản vay/nợ</Card.Title>
              <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                Thêm khoản nợ
              </Button>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Người cho vay/Nợ</th>
                    <th>Số tiền</th>
                    <th>Ngày đáo hạn</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt) => (
                    <tr key={debt.id}>
                      <td>{debt.lender}</td>
                      <td>{debt.amount.toLocaleString()} VND</td>
                      <td>{moment(debt.dueDate).format("DD/MM/YYYY")}</td>
                      <td>
                        <Badge
                          bg={
                            debt.status === "due"
                              ? "success"
                              : debt.status === "overdue"
                              ? "danger"
                              : "secondary"
                          }
                        >
                          {debt.status === "due"
                            ? "Đến hạn"
                            : debt.status === "overdue"
                            ? "Quá hạn"
                            : "Đã trả"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal Thêm khoản vay/nợ */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm khoản vay/nợ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="debtLender">
              <Form.Label>Người cho vay/Nợ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người cho vay hoặc người nợ"
                value={newDebt.lender}
                onChange={(e) => setNewDebt({ ...newDebt, lender: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="debtAmount">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số tiền vay/nợ"
                value={newDebt.amount}
                onChange={(e) => setNewDebt({ ...newDebt, amount: +e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="debtDueDate">
              <Form.Label>Ngày đáo hạn</Form.Label>
              <Form.Control
                type="date"
                value={newDebt.dueDate}
                onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddDebt}>
            Lưu khoản nợ
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DebtManager;
