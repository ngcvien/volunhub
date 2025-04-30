import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';
import LeftSidebar from '../components/Home/LeftSidebar';
import RightSidebar from '../components/Home/RightSidebar';
import EventCard from '../components/Event/EventCard';
import EventFilterBar from '../components/Home/EventFilterBar';
import { getAllEventsApi } from '../api/event.api';
import { EventType } from '../types/event.types';
import { useAuth } from '../contexts/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'active',
    sortBy: 'latest'
  });
  // Infinite scroll setup
  const { ref, inView } = useInView({
    threshold: 0,
  });

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
              />
          </Col>

          {/* Main Content */}
          <Col lg={6} md={8} sm={12}>
            <div className="feed-container">
              <EventFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              {/* Error State */}
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {/* Loading State (Initial) */}
              {loading && events.length === 0 && (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Đang tải danh sách sự kiện...</p>
                </div>
              )}

              {/* Events List */}
              <div className="events-container">
                {events.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onParticipationChange={() => fetchEvents(1)}
                  />
                ))}
        </div>

              {/* Infinite Scroll Trigger */}
              <div ref={ref} className="load-more-trigger">
                {loading && hasMore && (
                  <Spinner animation="border" variant="primary" size="sm" />
                )}
      </div>
            </div>
          </Col>

          {/* Right Sidebar */}
          <Col lg={3} md={4} className="d-none d-md-block">
            <RightSidebar currentUser={user} />
          </Col>
        </Row>
      </Container>
                      </div>
  );
};

export default HomePage;
