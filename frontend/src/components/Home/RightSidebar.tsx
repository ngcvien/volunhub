import React, { useState } from 'react';
import { Card, Button, Image, Badge, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Calendar2Check, 
  PeopleFill,
  ArrowRight,
  InfoCircle
} from 'react-bootstrap-icons';
import { User } from '../../types/user.types';
import './RightSidebar.css';

interface RightSidebarProps {
  currentUser: User | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ currentUser }) => {
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  // Mock data for top volunteers and upcoming events
  const topVolunteers = [
    { id: 1, username: 'NguyenVanA', points: 150, avatar: '/default-avatar.png' },
    { id: 2, username: 'TranThiB', points: 120, avatar: '/default-avatar.png' },
    { id: 3, username: 'LeVanC', points: 100, avatar: '/default-avatar.png' },
  ];

  const upcomingEvents = [
    { id: 10, title: 'Dọn dẹp bãi biển', date: '2024-05-01', participants: 15 },
    { id: 17, title: 'Trồng cây xanh', date: '2024-05-05', participants: 25 },
    { id: 11, title: 'Thăm trẻ em mồ côi', date: '2024-05-10', participants: 10 },
  ];

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
                <div className="user-info">
                  <h6>{currentUser.username}</h6>
                  <span className="text-muted">Tình nguyện viên</span>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Sự kiện</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">48</div>
                  <div className="stat-label">Giờ TNV</div>
                </div>
                <div className="stat-item">
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
            {topVolunteers.map((volunteer, index) => (
              <Link
                to={`/profile/${volunteer.id}`}
                key={volunteer.id}
                className="volunteer-item"
              >
                <div className="volunteer-rank">{index + 1}</div>
                <Image
                  src={volunteer.avatar}
                  roundedCircle
                  className="volunteer-avatar"
                />
                <div className="volunteer-info">
                  <div className="volunteer-name">{volunteer.username}</div>
                  <div className="volunteer-points">{volunteer.points} điểm</div>
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