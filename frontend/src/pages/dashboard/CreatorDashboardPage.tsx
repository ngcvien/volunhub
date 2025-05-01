// frontend/src/pages/dashboard/CreatorDashboardPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Alert, Spinner, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, Filter, ThreeDots, Download, PeopleFill, Calendar2Check, ArrowUpCircleFill } from 'react-bootstrap-icons';
import { getMyCreatedEventsApi } from '../../api/event.api';
import { EventType } from '../../types/event.types';
import ParticipantManagementModal from '../../components/Dashboard/ParticipantManagementModal';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';
import './CreatorDashboardPage.css';

interface CreatedEvent extends EventType {
  participantCount?: number;
}

const CreatorDashboardPage = () => {
  // State Management
  const [myEvents, setMyEvents] = useState<CreatedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [managingEventId, setManagingEventId] = useState<number | null>(null);
  const [managingEventName, setManagingEventName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  // Calculate Statistics
  const statistics = useMemo(() => {
    return {
      total: myEvents.length,
      active: myEvents.filter(e => e.status === 'active').length,
      completed: myEvents.filter(e => e.status === 'completed').length,
      totalParticipants: myEvents.reduce((acc, event) => acc + (event.participantCount || 0), 0)
    };
  }, [myEvents]);

  // Fetch Events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyCreatedEventsApi();
      setMyEvents(response.events);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách sự kiện.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and Search Events
  const filteredEvents = useMemo(() => {
    return myEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myEvents, searchTerm, statusFilter]);

  // Pagination
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [filteredEvents, currentPage]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Event Handlers
  const handleManageParticipants = (eventId: number, eventName: string) => {
    setManagingEventId(eventId);
    setManagingEventName(eventName);
    setShowManageModal(true);
  };

  const handleExportEvents = () => {
    // Implementation for exporting events
    console.log('Exporting events...');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBulkAction = (action: string) => {
    // Implementation for bulk actions
    console.log(`Performing ${action} on selected events:`, selectedEvents);
  };

  // Utility Functions
  const formatEventDateTime = (dateTimeStr: string) => {
    return format(new Date(dateTimeStr), 'HH:mm - dd/MM/yyyy', { locale: vi });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Loading State
  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải danh sách sự kiện...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container py-4">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Tổng số sự kiện</h6>
                  <h3 className="mb-0">{statistics.total}</h3>
                </div>
                <Calendar2Check size={24} className="text-primary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Đang hoạt động</h6>
                  <h3 className="mb-0">{statistics.active}</h3>
                </div>
                <ArrowUpCircleFill size={24} className="text-success" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Đã hoàn thành</h6>
                  <h3 className="mb-0">{statistics.completed}</h3>
                </div>
                <Calendar2Check size={24} className="text-info" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Tổng số TNV</h6>
                  <h3 className="mb-0">{statistics.totalParticipants}</h3>
                </div>
                <PeopleFill size={24} className="text-warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Toolbar */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mb-3 mb-md-0"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button
            variant="outline-primary"
            onClick={handleExportEvents}
            className="me-2"
            title="Xuất danh sách sự kiện"
          >
            <Download className="me-1" /> Xuất
          </Button>
          <Link to="/events/new">
            <Button variant="primary">Tạo sự kiện mới</Button>
          </Link>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {/* Events Table */}
      <Card className="shadow-sm">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '40%' }}>Sự kiện</th>
                <th className="text-center">Trạng thái</th>
                <th>Thời gian</th>
                <th>Địa điểm</th>
                <th className="text-center">TNV</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvents.map(event => (
                <tr key={event.id}>
                  <td>
                    <Link
                      to={`/events/${event.id}`}
                      className="text-decoration-none text-primary"
                    >
                      {event.title}
                    </Link>
                  </td>
                  <td className="text-center">
                    <Badge bg={getStatusBadgeVariant(event.status)}>
                      {event.status === 'upcoming' ? 'Sắp diễn ra' :
                        event.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                    </Badge>
                  </td>
                  <td>{formatEventDateTime(event.eventTime)}</td>
                  <td>{event.location}</td>
                  <td className="text-center">
                    <Badge bg="light" text="dark">
                      {event.participantCount || 0}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleManageParticipants(event.id, event.title)}
                      className="me-2"
                    >
                      Quản lý TNV
                    </Button>
                    <OverlayTrigger placement="top" overlay={<Tooltip>Thêm tùy chọn</Tooltip>}>
                      <Button
                        variant="light"
                        size="sm"
                      >
                        <ThreeDots />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="me-2"
          >
            Trước
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="me-2"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Participant Management Modal */}
      <ParticipantManagementModal
        show={showManageModal}
        onHide={() => setShowManageModal(false)}
        eventId={managingEventId}
        eventName={managingEventName}
        onConfirmSuccess={fetchEvents}
      />
    </Container>
  );
};

export default CreatorDashboardPage;