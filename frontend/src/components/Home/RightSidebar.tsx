import React, { useState, useEffect } from 'react';
import { Card, Button, Image, Badge, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Calendar2Check,
  PeopleFill,
  ArrowRight,
  InfoCircle
} from 'react-bootstrap-icons';
import { User, UserRole } from '../../types/user.types';
import './RightSidebar.css';
import { getLeaderboardApi } from '../../api/user.api';

interface LeaderboardUserDisplay extends Pick<User, 'id' | 'username' | 'avatarUrl' | 'volunpoints' | 'fullName'> { }

interface RightSidebarProps {
  currentUser: User | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ currentUser }) => {
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  // Mock data for top volunteers and upcoming events
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUserDisplay[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);


  const upcomingEvents = [
    { id: 10, title: 'Dọn dẹp bãi biển', date: '2024-05-01', participants: 15 },
    { id: 17, title: 'Trồng cây xanh', date: '2024-05-05', participants: 25 },
    { id: 11, title: 'Thăm trẻ em mồ côi', date: '2024-05-10', participants: 10 },
  ];
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true);
      setLeaderboardError(null);
      try {
        const response = await getLeaderboardApi(3); // Lấy top 3
        setLeaderboardUsers(response.leaderboard);
      } catch (err: any) {
        setLeaderboardError(err.message || "Lỗi tải bảng xếp hạng.");
      } finally {
        setLoadingLeaderboard(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const SidebarContent = () => (
    <>
      {currentUser && (
        <Card className="sidebar-card mb-4">
          <Card.Body>
            <div className="user-stats">
              <div className="user-stats-header">
                <Image
                  src={currentUser.avatarUrl || '/default-avatar.png'}
                  roundedCircle
                  className="user-avatar"
                />
                <div className="user-info gap-2">
                  <h6>@{currentUser.username}</h6>
                  <span className="text-muted ">
                    {currentUser.role === UserRole.ADMIN ? 'Quản trị viên' :
                     currentUser.role === UserRole.VERIFIED_ORG ? 'Tổ chức đã xác minh' : 
                     'Tình nguyện viên'}
                  </span>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-item-right">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Sự kiện</div>
                </div>
                <div className="stat-item-right">
                  <div className="stat-value">48</div>
                  <div className="stat-label">Giờ TNV</div>
                </div>
                <div className="stat-item-right">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Huy hiệu</div>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card className="sidebar-card mb-4">
        <Card.Body>
          <h6 className="sidebar-title">
            <Trophy className="me-2" />
            Top tình nguyện viên
          </h6>
          <div className="volunteer-list">
            {leaderboardUsers.map((volunteer, index) => (
              <Link
                to={`/profile/${volunteer.id}`}
                key={volunteer.id}
                className="volunteer-item"
              >
                <div className="volunteer-rank">{index + 1}</div>
                <Image
                  src={volunteer.avatarUrl}
                  roundedCircle
                  className="volunteer-avatar"
                />
                <div className="volunteer-info">
                  <div className="volunteer-name">{volunteer.username}</div>
                  <div className="volunteer-points">{volunteer.volunpoints} điểm</div>
                </div>
              </Link>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="sidebar-card">
        <Card.Body>
          <h6 className="sidebar-title">
            <Calendar2Check className="me-2" />
            Sự kiện sắp diễn ra
          </h6>
          <div className="upcoming-events">
            {upcomingEvents.map(event => (
              <Link
                to={`/events/${event.id}`}
                key={event.id}
                className="upcoming-event"
              >
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-meta">
                    <span className="event-date">
                      <Calendar2Check className="me-1" />
                      {new Date(event.date).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="event-participants">
                      <PeopleFill className="me-1" />
                      {event.participants}
                    </span>
                  </div>
                </div>
                <ArrowRight className="event-arrow" />
              </Link>
            ))}
          </div>
          <Button
            variant="link"
            as={Link}
            to="/events"
            className="w-100 mt-3"
          >
            Xem tất cả sự kiện
          </Button>
        </Card.Body>
      </Card>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="right-sidebar d-none d-md-block">
        <SidebarContent />
      </div>

      {/* Mobile Info Button */}
      <Button
        variant="primary"
        className="d-md-none mobile-info-toggle"
        onClick={() => setShowMobileInfo(true)}
      >
        <InfoCircle size={20} className="me-2" />
        Thông tin
      </Button>

      {/* Mobile Info Sidebar */}
      <Offcanvas
        show={showMobileInfo}
        onHide={() => setShowMobileInfo(false)}
        placement="end"
        className="mobile-info-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Thông tin</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default RightSidebar;