import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";


Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ExpenseTrend {
  month: string;
  amount: number;
}

interface Transaction {
  date: string;
  amount: number;
  category: string;
}

interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  expenseTrend: ExpenseTrend[];
  recentTransactions: Transaction[];
}

const Dashboard: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    expenseTrend: [],
    recentTransactions: [],
  });
   
  useEffect(() => {
    axios.get("https://api.example.com/finance")
      .then(response => {
        setFinancialData(response.data);
      })
      .catch(error => {
        console.error("Lỗi khi lấy dữ liệu:", error);
      });
  }, []);
  const expenseChartData = {
    labels: financialData.expenseTrend.map(entry => entry.month),
    datasets: [
      {
        label: "Chi tiêu",
        data: financialData.expenseTrend.map(entry => entry.amount),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };
financialData.totalExpenses = 12000000;
financialData.totalIncome = 30000000;
financialData.savings = financialData.totalIncome-financialData.totalExpenses;

const trend: ExpenseTrend[] = [
  {
    month: "Tháng 1",  
    amount: financialData.totalExpenses
  },
  {
    month: "Tháng 2",
    amount : 20000000
  },
  {
    month: "Tháng 3",
    amount : 1000000
  },
  {
    month: "Tháng 4",  
    amount: 15000000
  },
  {
    month: "Tháng 5",
    amount : 20000000
  },
  {
    month: "Tháng 6",
    amount : 1000000
  },
];
const transactions = [
  {
    date : '10/02/2025',
    amount : 100000,
    category : 'Ăn uống'
  }
]
financialData.expenseTrend = trend;
financialData.recentTransactions = transactions
  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={4} sm={12} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng thu nhập</Card.Title>
              <Card.Text className="fs-4 text-success">{financialData.totalIncome.toLocaleString()} VND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tổng chi tiêu</Card.Title>
              <Card.Text className="fs-4 text-danger">{financialData.totalExpenses.toLocaleString()} VND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Tiết kiệm</Card.Title>
              <Card.Text className="fs-4 text-primary">{financialData.savings.toLocaleString()} VND</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={8} sm={12} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Xu hướng chi tiêu</Card.Title>
              <Line data={expenseChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} sm={12} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Giao dịch gần đây</Card.Title>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Số tiền</th>
                    <th>Danh mục</th>
                  </tr>
                </thead>
                <tbody>
                  {financialData.recentTransactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.date}</td>
                      <td>{transaction.amount.toLocaleString()} VND</td>
                      <td>{transaction.category}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
