import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { URL } from "../../utils/UrlBackend";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${URL}/api/users/auth`, { username, password });

      // Lưu token vào localStorage
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      // Cập nhật trạng thái đăng nhập
      login(token);

      // Chuyển hướng đến Dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <div className="shadow p-4 bg-white rounded">
            <h2 className="text-center mb-4">Đăng Nhập</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername" className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-2">
                Đăng Nhập
              </Button>
              
              <div className="text-center">
                <a href="/forgot-password" className="text-decoration-none">Quên mật khẩu?</a>
              </div>
              <div className="text-center mt-2">
                Chưa có tài khoản?  <Link to={"/register"}> <a className="text-decoration-none">Đăng ký</a></Link>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
