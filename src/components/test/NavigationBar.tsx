import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { FaUserCircle, FaMoon, FaSun, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext"; // Import AuthContext

import "bootstrap/dist/css/bootstrap.min.css";

const NavigationBar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth(); // Lấy hàm đăng xuất từ AuthContext
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">Quản Lý Chi Tiêu</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/reports">Báo Cáo</Nav.Link>
            <Nav.Link as={Link} to="/transactions">Giao Dịch</Nav.Link>
            <Nav.Link as={Link} to="/categorys">Danh mục</Nav.Link>
            <Nav.Link as={Link} to="/budgets">Ngân sách</Nav.Link>
            <Nav.Link as={Link} to="/debts">Vay/nợ</Nav.Link>
            <Nav.Link as={Link} to="/settings">Cài Đặt</Nav.Link>
          </Nav>
          <Nav className="d-flex align-items-center">
            {/* Nút chuyển đổi chế độ tối/sáng */}
            <Button variant="outline-secondary" className="me-2" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </Button>

            {/* Dropdown cho hồ sơ & đăng xuất */}
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" id="user-dropdown">
                <FaUserCircle size={28} className="text-primary" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">
                  <FaUser className="me-2" /> Xem Hồ Sơ
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2" /> Đăng Xuất
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
