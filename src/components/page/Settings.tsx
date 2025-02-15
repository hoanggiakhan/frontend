import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { getIdUserByToken } from "../../utils/JwtService";
import { URL } from "../../utils/UrlBackend";

const Settings: React.FC = () => {
  const userId = getIdUserByToken();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    savingsGoal: 0,
    expenseLimit: 0,
    theme: "light",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${URL}/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      setError("Không thể tải dữ liệu người dùng.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (user.password && user.password !== user.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.put(`${URL}/api/users/${userId}`, user);
      setMessage("Cập nhật thành công!");
    } catch (error) {
      setError("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác!")) {
      try {
        await axios.delete(`${URL}/api/users/${userId}`);
        alert("Tài khoản đã bị xóa!");
        window.location.href = "/logout";
      } catch (error) {
        setError("Xóa tài khoản thất bại.");
      }
    }
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Cài đặt tài khoản</Card.Title>
              
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu mới"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <hr />

                <Card.Title className="mb-3">Cài đặt tài chính</Card.Title>

                <Form.Group className="mb-3">
                  <Form.Label>Mục tiêu tiết kiệm (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    name="savingsGoal"
                    value={user.savingsGoal}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Giới hạn chi tiêu hàng tháng (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    name="expenseLimit"
                    value={user.expenseLimit}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <hr />

                <Card.Title className="mb-3">Giao diện</Card.Title>

                <Form.Group className="mb-3">
                  <Form.Label>Chế độ hiển thị</Form.Label>
                  <Form.Select
                    name="theme"
                    value={user.theme}
                    onChange={(e) => setUser({ ...user, theme: e.target.value })}
                  >
                    <option value="light">Sáng</option>
                    <option value="dark">Tối</option>
                  </Form.Select>
                </Form.Group>

                <Button variant="primary" onClick={handleSave} disabled={loading}>
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>

                <Button variant="danger" className="ms-3" onClick={handleDeleteAccount}>
                  Xóa tài khoản
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
