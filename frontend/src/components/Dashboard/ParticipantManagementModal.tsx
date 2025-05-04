import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Button, ListGroup, Image, Spinner, Alert, Badge, Form, InputGroup, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, Download, CheckCircleFill, XCircleFill, Clock } from 'react-bootstrap-icons';
import { getParticipantsForEventManagementApi, confirmParticipantApi } from '../../api/event.api';
import { ParticipantDetail, CompletionStatus } from '../../types/participation.types';
import './ParticipantManagementModal.css'

const defaultAvatar = '/default-avatar.png';

interface ParticipantManagementModalProps {
  show: boolean;
  onHide: () => void;
  eventId: number | null;
  eventName?: string;
    onConfirmSuccess?: () => void;
}



const ParticipantManagementModal: React.FC<ParticipantManagementModalProps> = ({
    show,
    onHide,
    eventId,
    eventName,
    onConfirmSuccess
}) => {
    const [participants, setParticipants] = useState<ParticipantDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmingUserId, setConfirmingUserId] = useState<number | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  // Statistics
  const statistics = useMemo(() => {
    return {
      total: participants.length,
      confirmed: participants.filter(p => p.completionStatus === CompletionStatus.CONFIRMED).length,
      pending: participants.filter(p => p.completionStatus === CompletionStatus.PENDING).length,
      absent: participants.filter(p => p.completionStatus === CompletionStatus.ABSENT).length
    };
  }, [participants]);

  const fetchParticipants = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    setConfirmError(null);
    try {
      const response = await getParticipantsForEventManagementApi(eventId);
      setParticipants(response.participants);
    } catch (err: any) {
      setError(err.message || 'Lỗi tải danh sách người tham gia.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (show && eventId) {
      fetchParticipants();
    } else {
      setParticipants([]);
      setError(null);
      setConfirmError(null);
      setLoading(false);
      setSearchTerm('');
      setStatusFilter('all');
      setSelectedParticipants([]);
    }
  }, [show, eventId, fetchParticipants]);

  const handleConfirm = async (participantUserId: number) => {
    if (!eventId) return;

    setConfirmingUserId(participantUserId);
    setConfirmError(null);
    try {
      await confirmParticipantApi(eventId, participantUserId);
      await fetchParticipants();
      onConfirmSuccess?.();
    } catch (err: any) {
      setConfirmError(err.message || `Lỗi xác nhận cho user ${participantUserId}.`);
    } finally {
      setConfirmingUserId(null);
    }
    };

  const handleExport = () => {
    // Implementation for exporting participant list
    console.log('Exporting participants...');
};

  const filteredParticipants = useMemo(() => {
    return participants.filter(participant => {
      const matchesSearch = 
        participant.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (participant.user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesStatus = statusFilter === 'all' || participant.completionStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [participants, searchTerm, statusFilter]);

  const getStatusBadge = (status: CompletionStatus) => {
    switch (status) {
      case CompletionStatus.CONFIRMED:
        return <Badge bg="success">Đã xác nhận</Badge>;
      case CompletionStatus.ABSENT:
        return <Badge bg="danger">Vắng mặt</Badge>;
      default:
        return <Badge bg="warning">Chờ xác nhận</Badge>;
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Quản lý TNV - {eventName || `Sự kiện #${eventId}`}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h3 className="mb-1">{statistics.total}</h3>
                <div className="text-muted">Tổng số TNV</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h3 className="mb-1 text-success">{statistics.confirmed}</h3>
                <div className="text-muted">Đã xác nhận</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h3 className="mb-1 text-warning">{statistics.pending}</h3>
                <div className="text-muted">Chờ xác nhận</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center h-100">
              <Card.Body>
                <h3 className="mb-1 text-danger">{statistics.absent}</h3>
                <div className="text-muted">Vắng mặt</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Search and Filter */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <Search />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm tình nguyện viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={CompletionStatus.CONFIRMED}>Đã xác nhận</option>
              <option value={CompletionStatus.PENDING}>Chờ xác nhận</option>
              <option value={CompletionStatus.ABSENT}>Vắng mặt</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button
              variant="outline-primary"
              className="w-100"
              onClick={handleExport}
            >
              <Download className="me-1" /> Xuất
            </Button>
          </Col>
        </Row>

        {confirmError && (
          <Alert variant="danger" onClose={() => setConfirmError(null)} dismissible>
            {confirmError}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Đang tải danh sách...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredParticipants.length === 0 ? (
          <Alert variant="info">
            {searchTerm || statusFilter !== 'all'
              ? 'Không tìm thấy tình nguyện viên phù hợp.'
              : 'Chưa có tình nguyện viên nào tham gia.'}
          </Alert>
        ) : (
          <ListGroup variant="flush">
            {filteredParticipants.map((participant) => (
              <ListGroup.Item
                key={participant.userId}
                className="d-flex align-items-center py-3"
              >
                <Link to={`/profile/${participant.userId}`} className="me-3">
                  <Image
                    src={participant.user.avatarUrl || defaultAvatar}
                    roundedCircle
                    width={40}
                    height={40}
                    className="object-fit-cover"
                  />
                </Link>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/profile/${participant.userId}`}
                      className="text-decoration-none"
                    >
                      <strong>{participant.user.username}</strong>
                    </Link>
                    <span className="ms-2">
                      {getStatusBadge(participant.completionStatus)}
                    </span>
                  </div>
                  {participant.user.fullName && (
                    <div className="text-muted small">{participant.user.fullName}</div>
                  )}
                </div>
                {participant.completionStatus === CompletionStatus.PENDING && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleConfirm(participant.userId)}
                    disabled={confirmingUserId === participant.userId}
                  >
                    {confirmingUserId === participant.userId ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      'Xác nhận'
                    )}
                  </Button>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ParticipantManagementModal;