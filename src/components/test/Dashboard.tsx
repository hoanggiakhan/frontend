import React from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import {Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';

// Đăng ký các phần của Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
}

const Dashboard: React.FC = () => {
  // Dữ liệu ví dụ cho tổng quan tài chính và giao dịch gần đây
  const totalIncome = 5000;
  const totalExpense = 3000;
  const remainingBalance = totalIncome - totalExpense;

  const transactions: Transaction[] = [
    { id: 1, description: "Mua sắm", amount: -150, date: "2025-02-05" },
    { id: 2, description: "Lương", amount: 2500, date: "2025-02-01" },
    { id: 3, description: "Ăn uống", amount: -100, date: "2025-02-03" },
    { id: 4, description: "Dịch vụ", amount: -50, date: "2025-02-02" },
    { id: 5, description: "Tiền thưởng", amount: 500, date: "2025-01-30" },
  ];

  // Biểu đồ thu nhập/chi tiêu theo tháng
  // const incomeExpenseData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  //   datasets: [
  //     {
  //       label: "Thu nhập",
  //       data: [2000, 2500, 2800, 3200, 3000],
  //       backgroundColor: "rgba(75, 192, 192, 0.2)",
  //       borderColor: "rgba(75, 192, 192, 1)",
  //       borderWidth: 1,
  //     },
  //     {
  //       label: "Chi tiêu",
  //       data: [1500, 2000, 1800, 2100, 2500],
  //       backgroundColor: "rgba(255, 99, 132, 0.2)",
  //       borderColor: "rgba(255, 99, 132, 1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // Biểu đồ phân bổ chi tiêu
  const expensePieData = {
    labels: ["Ăn uống", "Mua sắm", "Dịch vụ", "Khác"],
    datasets: [
      {
        label: "Phân bổ chi tiêu",
        data: [400, 800, 300, 500],
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"],
      },
    ],
  };

  return (
    <Container fluid>
      <Row>

        <Col md={9}>
          <Row>
            <Col sm={12} md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Tóm tắt tài chính</Card.Title>
                  <Card.Text>Tổng thu nhập: ${totalIncome}</Card.Text>
                  <Card.Text>Tổng chi tiêu: ${totalExpense}</Card.Text>
                  <Card.Text>Tiền còn lại: ${remainingBalance}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

          </Row>

          <Row>
            <Col sm={12} md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Biểu đồ phân bổ chi tiêu</Card.Title>
                  <Pie data={expensePieData} />
                </Card.Body>
              </Card>
            </Col>

            <Col sm={12} md={6}>
              <Card>
                <Card.Body>
                  <Card.Title>Giao dịch gần đây</Card.Title>
                  <ListGroup variant="flush">
                    {transactions.map((transaction) => (
                      <ListGroup.Item key={transaction.id}>
                        {transaction.description} - ${transaction.amount} (Ngày: {transaction.date})
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
