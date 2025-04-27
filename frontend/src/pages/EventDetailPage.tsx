// frontend/src/pages/EventDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image as RBImage, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { getEventByIdApi, joinEventApi, leaveEventApi } from '../api/event.api'; // Import các API cần thiết
import { EventType } from '../types/event.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { GeoAlt, Calendar2Event, Clock, PeopleFill } from 'react-bootstrap-icons';

// Ảnh mặc định
const defaultAvatar = '/default-avatar.png';
const placeholderImageUrl = '/placeholder-event.png';

// Hàm format (có thể đưa ra utils)
const formatEventDateTimeFull = (isoString: string): string => {
    try {
        return format(new Date(isoString), "HH:mm EEEE, dd/MM/yyyy", { locale: vi });
    } catch (e) { return "N/A"; }
};

const EventDetailPage = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const { user } = useAuth(); // Lấy user hiện tại để check trạng thái join/leave
    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State cho nút Join/Leave trên trang này
    const [isProcessingJoin, setIsProcessingJoin] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);

    // Fetch dữ liệu chi tiết sự kiện
    const fetchEventDetail = async () => {
        if (!eventId) {
             setError("ID sự kiện không hợp lệ.");
             setLoading(false);
             return;
         }
        setLoading(true);
        setError(null);
        try {
            const response = await getEventByIdApi(eventId);
            setEvent(response.event);
        } catch (err: any) {
            setError(err.message || 'Không thể tải chi tiết sự kiện.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetail();
    }, [eventId]); // Fetch lại nếu eventId thay đổi

    // Hàm xử lý Join/Leave ngay trên trang chi tiết
    const handleToggleParticipation = async () => {
        if (!user || !event) return; // Cần user và event data
        setIsProcessingJoin(true);
        setJoinError(null);
        try {
            if (event.isParticipating) {
                await leaveEventApi(event.id);
                // Cập nhật state cục bộ ngay lập tức
                setEvent(prev => prev ? { ...prev, isParticipating: false } : null);
            } else {
                await joinEventApi(event.id);
                 // Cập nhật state cục bộ ngay lập tức
                 setEvent(prev => prev ? { ...prev, isParticipating: true } : null);
            }
            // TODO: Có thể muốn cập nhật cả danh sách participants nếu nó hiển thị đầy đủ
        } catch (err: any) {
            setJoinError(err.message || 'Thao tác thất bại.');
        } finally {
            setIsProcessingJoin(false);
        }
    };


    // --- Render Loading/Error ---
    if (loading) {
        return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    }
    if (error || !event) {
        return <Container><Alert variant="danger" className="mt-4">{error || 'Không tìm thấy sự kiện.'}</Alert></Container>;
    }

    // --- Render Nội dung trang chi tiết ---
    return (
        <Container className="mt-4 mb-5 event-detail-page">
            <Row>
                {/* Cột chính hiển thị nội dung */}
                <Col lg={8} className="mb-4">
                    <Card className="shadow-sm">
                         {/* Ảnh sự kiện */}
                         {event.imageUrl && (
                            <Card.Img variant="top" src={event.imageUrl || placeholderImageUrl} alt={event.title} style={{ maxHeight: '400px', objectFit: 'cover' }}/>
                         )}
                         <Card.Body className="p-4">
                             {/* Tiêu đề */}
                            <h1 className="mb-3">{event.title}</h1>

                             {/* Thông tin Meta (Thời gian, Địa điểm) */}
                            <div className="event-meta d-flex flex-wrap text-muted mb-3 gap-3">
                                <div className="d-flex align-items-center">
                                    <Calendar2Event className="me-2" />
                                    <span>{formatEventDateTimeFull(event.eventTime)}</span>
                                </div>
                                {event.location && (
                                     <div className="d-flex align-items-center">
                                         <GeoAlt className="me-2" />
                                         <span>{event.location}</span>
                                     </div>
                                )}
                            </div>

                            {/* Nút Tham gia/Rời khỏi & Lỗi (Nếu có) */}
                             {user && (
                                <div className="mb-3">
                                     <Button
                                         variant={event.isParticipating ? 'outline-danger' : 'success'}
                                         onClick={handleToggleParticipation}
                                         disabled={isProcessingJoin}
                                         size="lg"
                                     >
                                         {isProcessingJoin ? <Spinner size="sm" animation="border" className="me-1"/> : null}
                                         {event.isParticipating ? 'Rời khỏi sự kiện' : 'Tham gia sự kiện này'}
                                     </Button>
                                     {joinError && <Alert variant="danger" size="sm" className="mt-2 py-1 mb-0">{joinError}</Alert>}
                                 </div>
                             )}
                             {!user && (
                                 <Alert variant='info' className='mt-3'>
                                     <Link to="/login">Đăng nhập</Link> để tham gia sự kiện này.
                                 </Alert>
                             )}


                            <hr />

                             {/* Mô tả đầy đủ */}
                             <div className="event-description mt-4">
                                 <h4 className="mb-3">Mô tả chi tiết</h4>
                                 <p style={{ whiteSpace: 'pre-wrap' }}>{event.description || <i>Không có mô tả chi tiết.</i>}</p>
                             </div>

                             {/* TODO: Phần Đăng bài viết / Hỏi đáp sẽ thêm vào đây sau */}
                             <hr className='my-4'/>
                             <div>
                                 <h4 className="mb-3">Thảo luận / Cập nhật</h4>
                                 <p className='text-muted'><i>(Tính năng đăng bài viết và bình luận cho sự kiện sẽ được phát triển sau.)</i></p>
                                 {/* Form tạo bài viết và danh sách bài viết sẽ ở đây */}
                             </div>


                        </Card.Body>
                    </Card>
                </Col>

                {/* Cột phụ (Người tạo, Người tham gia) */}
                <Col lg={4}>
                     {/* Thông tin người tạo */}
                    <Card className="shadow-sm mb-4">
                        <Card.Header>Người tổ chức</Card.Header>
                        <Card.Body className="text-center">
                            <Link to={`/profile/${event.creator.id}`}>
                                <RBImage  src={event.creator.avatarUrl || defaultAvatar} roundedCircle thumbnail width={80} height={80} alt={event.creator.username} className="mb-2 avt-creator"/>
                            </Link>
                            <h5>
                                <Link to={`/profile/${event.creator.id}`} className="text-decoration-none">
                                    {event.creator.fullName || event.creator.username}
                                </Link>
                            </h5>
                             {/* TODO: Thêm nút Follow/Nhắn tin cho người tạo */}
                        </Card.Body>
                    </Card>

                     {/* Danh sách người tham gia */}
                    <Card className="shadow-sm">
                        <Card.Header>
                            <PeopleFill className="me-2"/>
                            Tình nguyện viên tham gia ({event.participants?.length || 0})
                        </Card.Header>
                        <Card.Body>
                            {event.participants && event.participants.length > 0 ? (
                                <div className="participant-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {event.participants.map(participant => (
                                        <div key={participant.id} className="d-flex align-items-center mb-3">
                                            <Link to={`/profile/${participant.id}`}>
                                                <RBImage src={participant.avatarUrl || defaultAvatar} roundedCircle width={35} height={35} alt={participant.username} className="me-2"/>
                                            </Link>
                                            <Link to={`/profile/${participant.id}`} className="text-decoration-none text-body">
                                                {participant.username}
                                            </Link>
                                             {/* TODO: Thêm nút Follow/Kết bạn */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted text-center mb-0">Chưa có ai tham gia.</p>
                            )}
                            {/* Có thể thêm nút Xem tất cả nếu danh sách dài */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EventDetailPage;