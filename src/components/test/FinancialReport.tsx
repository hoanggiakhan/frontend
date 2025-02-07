import React, { useState } from "react";
import { Container, Row, Col, Table, Form } from "react-bootstrap";
import { Bar, Line, Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const FinancialReport: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedMonth, setSelectedMonth] = useState("01");

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const data = [
    { month: "01", income: 1000, expense: 500, saving: 500 },
    { month: "02", income: 1200, expense: 700, saving: 500 },
    { month: "03", income: 1500, expense: 800, saving: 700 },
  ];

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

  const pieData = {
    labels: ["Thu nhập", "Chi tiêu", "Tiết kiệm"],
    datasets: [
      {
        data: [1000, 500, 500],
        backgroundColor: ["#28a745", "#dc3545", "#ffc107"],
      },
    ],
  };

  return (
    <Container>
      <h2 className="text-center my-4">Báo Cáo Tài Chính</h2>
      <Row className="mb-4">
        <Col md={6}>
          <Form.Select value={selectedYear} onChange={handleYearChange}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Select value={selectedMonth} onChange={handleMonthChange}>
            <option value="01">Tháng 1</option>
            <option value="02">Tháng 2</option>
            <option value="03">Tháng 3</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Bar data={chartData} />
        </Col>
        <Col md={6}>
          <Line data={chartData} />
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={6} className="mx-auto">
          <Pie data={pieData} />
        </Col>
      </Row>
      <Table striped bordered hover responsive>
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
              <td>{item.income}</td>
              <td>{item.expense}</td>
              <td>{item.saving}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default FinancialReport;
