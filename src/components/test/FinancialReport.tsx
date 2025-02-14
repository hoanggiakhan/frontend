import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { URL } from "../../utils/UrlBackend";
import { getIdUserByToken } from "../../utils/JwtService";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface FinancialReport {
  month: string;
  year: number;
  income: number;
  expense: number;
  saving: number;
}

const FinancialReport: React.FC = () => {
  const userId = getIdUserByToken();
  const [data, setData] = useState<FinancialReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingReport, setSavingReport] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${URL}/api/reports/${userId}`);
        const sortedData = response.data.sort((a: FinancialReport, b: FinancialReport) =>
          parseInt(a.month) - parseInt(b.month)
        );
        setData(sortedData);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSaveReport = async () => {
    setSavingReport(true);
    try {
      await axios.post(`${URL}/api/reports/${userId}`, { data });
      alert("Báo cáo đã được lưu thành công!");
    } catch (err) {
      alert("Lỗi khi lưu báo cáo");
    }
    setSavingReport(false);
  };

  const chartData = {
    labels: data.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Thu nhập",
        data: data.map((item) => item.income),
        backgroundColor: "#28a745",
      },
      {
        label: "Chi tiêu",
        data: data.map((item) => item.expense),
        backgroundColor: "#dc3545",
      },
    ],
  };

  return (
    <Container>
      <h2 className="text-center my-4">Báo Cáo Tài Chính</h2>
      {loading ? (
        <p className="text-center">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <>
          <Table striped bordered hover responsive className="mt-4">
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Thu nhập</th>
                <th>Chi tiêu</th>
                <th>Tiết kiệm</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>{item.income.toLocaleString()} VND</td>
                  <td>{item.expense.toLocaleString()} VND</td>
                  <td>{item.saving.toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row>
            <Col md={12} className="text-center">
              <Bar data={chartData} />
              <Button 
                className="mt-3" 
                variant="success" 
                onClick={handleSaveReport} 
                disabled={savingReport}
              >
                {savingReport ? "Đang lưu..." : "Lưu Báo Cáo"}
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default FinancialReport;
