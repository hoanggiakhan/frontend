import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { URL } from "../../utils/UrlBackend";
import { getIdUserByToken } from "../../utils/JwtService";

interface UserProfile {
  fullName: string;
  username: string;
  email: string;
  password : string;
}

const Profile: React.FC = () => {
  const userId = getIdUserByToken();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`${URL}/api/users/${userId}`)
      .then(response => {
        setProfile(response.data);
      })
      .catch(error => console.error("Lỗi khi lấy thông tin cá nhân:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center">Thông Tin Cá Nhân</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Đang tải...</p>
        </div>
      ) : profile ? (
        <Card className="shadow p-4 mt-3">
          <Card.Body>
            <Card.Title className="text-primary">{profile.fullName}</Card.Title>
            <Card.Text><strong>Tên đăng nhập:</strong> {profile.username}</Card.Text>
            <Card.Text><strong>Email:</strong> {profile.email}</Card.Text>
            <Button variant="warning">Chỉnh sửa</Button>
          </Card.Body>
        </Card>
      ) : (
        <p className="text-center text-danger">Không thể tải dữ liệu.</p>
      )}
    </Container>
  );
};

export default Profile;
