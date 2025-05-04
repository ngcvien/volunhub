import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import LeftSidebar from '../components/Home/LeftSidebar';
import RightSidebar from '../components/Home/RightSidebar';
import EventCard from '../components/Event/EventCard';
import EventFilterBar from '../components/Home/EventFilterBar';
import EventCardOverlay from '../components/Event/EventCardOverlay';
import { getAllEventsApi } from '../api/event.api';
import { EventType } from '../types/event.types';
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";
import { PlusCircleFill, Calendar2CheckFill } from "react-bootstrap-icons"

import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'active',
    sortBy: 'latest'
  });
  // Infinite scroll setup
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileInfo, setShowMobileInfo] = useState(false);

  const refreshEvents = () => {
    setRefreshKey((oldKey) => oldKey + 1)
  }

  const fetchEvents = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await getAllEventsApi(pageNum, filters);
      if (pageNum === 1) {
        setEvents(response.events);
      } else {
        setEvents(prev => [...prev, ...response.events]);
      }
      setHasMore(response.events.length > 0);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách sự kiện.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Đang tải bảng tin...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="danger" className="my-4 shadow-sm">
          <Alert.Heading>Không thể tải bảng tin</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={refreshEvents}>
              Thử lại
            </Button>
          </div>
        </Alert>
      )
    }

    if (events.length === 0) {
      return (
        <Card className="text-center my-4 shadow-sm border-0">
          <Card.Body className="py-5">
            <Calendar2CheckFill size={48} className="text-muted mb-3" />
            <Card.Title>Chưa có sự kiện nào</Card.Title>
            <Card.Text className="text-muted">Hãy là người đầu tiên tạo sự kiện và chia sẻ với cộng đồng!</Card.Text>
            {user && (
              <Link to="/events/new">
                <Button variant="primary" className="mt-3">
                  <PlusCircleFill className="me-2" /> Tạo sự kiện mới
                </Button>
              </Link>
            )}
          </Card.Body>
        </Card>
      )
    }

    return (
      <div className="events-feed">
        {events.map((event) => (
          <div key={event.id} className="event-card-wrapper mb-4 animate__animated animate__fadeIn">
            <EventCard event={event} onActionComplete={refreshEvents} />
            {/* <EventCardOverlay
              event={event}
              // onParticipationChange={handleParticipationChange}
            
            /> */}
          </div>
        ))}
      </div>
    )
  }

  // Initial load
  useEffect(() => {
    setPage(1);
    fetchEvents(1);
  }, [fetchEvents]);

  // Load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1);
      fetchEvents(page + 1);
    }
  }, [inView, hasMore, loading, fetchEvents, page]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="homepage">
      <Container fluid>
        <Row>
          {/* Left Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <LeftSidebar
              currentUser={user}
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              showMobile={showMobileMenu}
              onMobileClose={() => setShowMobileMenu(false)}
            />
          </Col>

          {/* Main Content */}
          <Col lg={6} md={8} sm={12}>
            <div className="main-content">
              {user && (
                <EventFilterBar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              )}

              {/* Tiêu đề bảng tin */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="m-0">Bảng tin sự kiện</h4>
                <Button variant="outline-primary" size="sm" onClick={refreshEvents} disabled={loading}>
                  <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
                </Button>
              </div>

              {/* Nội dung chính */}
              {renderContent()}
            </div>
          </Col>

          {/* Right Sidebar */}
          <Col lg={3} md={4} className="d-none d-md-block">
            <RightSidebar
              currentUser={user}
              showMobile={showMobileInfo}
              onMobileClose={() => setShowMobileInfo(false)}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;