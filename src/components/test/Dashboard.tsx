import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Table, Spinner, Alert } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getIdUserByToken } from "../../utils/JwtService";
import { Transaction } from "./TransactionManager";
import { URL } from "../../utils/UrlBackend";
import { FinancialReport } from "./FinancialReport";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  expenseTrend: FinancialReport[];
  recentTransactions: Transaction[];
}

const Dashboard: React.FC = () => {
  const userId = getIdUserByToken();
  const [financialData, setFinancialData] = useState<FinancialData>({
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    expenseTrend: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${URL}/api/users/dashboard/${userId}`);
      setFinancialData(response.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      setError("Không thể tải dữ liệu tài chính. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const expenseChartData = {
    labels: financialData.expenseTrend.map((entry) => entry.month),
    datasets: [
      {
        label: "Chi tiêu",
        data: financialData.expenseTrend.map((entry) => entry.expense),
        borderColor: "#ff6384",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  return (
    <Container fluid className="p-4">
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Row>
            <Col md={4} sm={12} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Tổng thu nhập</Card.Title>
                  <Card.Text className="fs-4 text-success">
                    {financialData.totalIncome.toLocaleString()} VND
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Tổng chi tiêu</Card.Title>
                  <Card.Text className="fs-4 text-danger">
                    {financialData.totalExpenses.toLocaleString()} VND
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12} className="mb-3">
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Tiết kiệm</Card.Title>
                  <Card.Text className="fs-4 text-primary">
                    {financialData.savings.toLocaleString()} VND
                  </Card.Text>
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
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
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
        </>
      )}
    </Container>
  );
};

export default Dashboard;
