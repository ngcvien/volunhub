import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Badge, Container } from "react-bootstrap";
import { getLeaderboardApi } from "../api/user.api";
import type { User } from "../types/user.types";
import "../styles/LeaderboardPage.css";

interface LeaderboardUser extends Pick<User, 'id' | 'username' | 'avatarUrl' | 'volunpoints' | 'fullName'> {}

const LeaderboardPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLeaderboardApi(20);
        setVolunteers(data.leaderboard || []);
      } catch (err: any) {
        setError("Không thể tải bảng xếp hạng tình nguyện viên.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <Container className="leaderboard-container py-5">
      <h1 className="leaderboard-title mb-4 text-center">Bảng Vinh Danh Tình Nguyện Viên</h1>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Đang tải bảng xếp hạng...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <Card className="leaderboard-card mx-auto">
          <Table responsive hover className="align-middle leaderboard-table">
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Avatar</th>
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Điểm VolunPoint</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((user, idx) => (
                <tr key={user.id} className={idx === 0 ? "top-1-row" : idx === 1 ? "top-2-row" : idx === 2 ? "top-3-row" : ""}>
                  <td>
                    <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>
                  </td>
                  <td>
                    <img
                      src={user.avatarUrl || "/default-avatar.png"}
                      alt={user.fullName || user.username}
                      className={`leaderboard-avatar ${idx < 3 ? "top-avatar" : ""}`}
                    />
                  </td>
                  <td>
                    <span className="leaderboard-fullname">{user.fullName || "(Chưa cập nhật)"}</span>
                  </td>
                  <td>
                    <span className="leaderboard-username">{user.username}</span>
                  </td>
                  <td>
                    <Badge bg={idx === 0 ? "warning" : idx === 1 ? "secondary" : idx === 2 ? "info" : "light"} className="volunpoint-badge">
                      {user.volunpoints}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
};

export default LeaderboardPage;
