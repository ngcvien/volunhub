// frontend/src/pages/dashboard/CreatorDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getMyCreatedEventsApi } from '../../api/event.api'; // Import API
// Import kiểu dữ liệu đã cập nhật
import { EventType } from '../../types/event.types'; // Hoặc dùng CreatedEvent nếu bạn tạo riêng

// Định nghĩa lại kiểu để dùng trong component này cho rõ
interface CreatedEvent extends Omit<EventType, 'participants' | 'posts' | 'isLiked' | 'isParticipating' | 'creator'> {
    participantCount: number;
}

const CreatorDashboardPage = () => {
    const [myEvents, setMyEvents] = useState<CreatedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMyEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getMyCreatedEventsApi();
            setMyEvents(response.events);
        } catch (err: any) {
            setError(err.message || 'Lỗi tải sự kiện của bạn.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []); // Fetch khi component mount

    // Hàm format ngày giờ (có thể dùng lại từ EventCard hoặc utils)
    const formatEventDateTime = (isoString: string): string => {
         try { return new Date(isoString).toLocaleString('vi-VN'); } catch(e) { return 'N/A'; }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container><Alert variant="danger" className="mt-4">{error} <Button size="sm" variant="outline-danger" onClick={fetchMyEvents}>Thử lại</Button></Alert></Container>;

    return (
        <Container className="mt-4 mb-5 dashboard-page">
            <div className="d-flex justify-content-between align-items-center mb-4">
                 <h2 className="mb-0">Quản lý Sự kiện của bạn</h2>
                 <Link to="/events/new">
                     <Button variant="primary">Tạo Sự kiện mới</Button>
                 </Link>
            </div>

            {myEvents.length === 0 ? (
                <Alert variant="info">Bạn chưa tạo sự kiện nào.</Alert>
            ) : (
                <Table striped bordered hover responsive className="align-middle">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tiêu đề</th>
                            <th>Trạng thái</th>
                            <th>Thời gian diễn ra</th>
                            <th>Địa điểm</th>
                            <th>Tham gia</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {myEvents.map((event, index) => (
                            <tr key={event.id}>
                                <td>{index + 1}</td>
                                <td>
                                     <Link to={`/events/${event.id}`}>{event.title}</Link>
                                </td>
                                <td><Badge bg={event.status === 'completed' ? 'success' : (event.status === 'cancelled' ? 'danger' : 'primary')}>{event.status}</Badge></td>
                                <td>{formatEventDateTime(event.eventTime)}</td>
                                <td>{event.location || '-'}</td>
                                <td className='text-center'>{event.participantCount}</td>
                                <td>
                                     {/* TODO: Thêm các nút Manage Participants, Edit, Cancel */}
                                     <Button variant="outline-info" size="sm" className="me-2" title="Xem chi tiết" as={Link} to={`/events/${event.id}`}>
                                         <i className="bi bi-eye-fill"></i>
                                     </Button>
                                     <Button variant="outline-warning" size="sm" className="me-2" title="Chỉnh sửa">
                                          <i className="bi bi-pencil-fill"></i>
                                     </Button>
                                      {/* Nút Quản lý TNV sẽ quan trọng cho bước sau */}
                                     <Button variant="outline-success" size="sm" title="Quản lý tình nguyện viên">
                                          <i className="bi bi-people-fill"></i>
                                     </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default CreatorDashboardPage;