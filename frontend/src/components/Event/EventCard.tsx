// frontend/src/components/Event/EventCard.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Image as RBImage, Row, Col } from 'react-bootstrap'; // Thêm Image, Row, Col
import { Link } from 'react-router-dom';
import { EventType } from '../../types/event.types';
import { useAuth } from '../../contexts/AuthContext';
import { joinEventApi, leaveEventApi } from '../../api/event.api';
import { formatDistanceToNow } from 'date-fns'; // Import hàm định dạng thời gian
import { vi } from 'date-fns/locale'; // Import locale tiếng Việt

// Ảnh mặc định (đặt trong public)
const defaultAvatar = '/default-avatar.png';
const placeholderImageUrl = "/placeholder-event.png";

interface EventCardProps {
    event: EventType;
    onActionComplete?: () => void;
}

// Hàm format thời gian kiểu "x phút trước", "y giờ trước"...
const formatTimeAgo = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        return formatDistanceToNow(date, { addSuffix: true, locale: vi }); // Thêm "trước", dùng tiếng Việt
    } catch (e) {
        return isoString; // Trả về chuỗi gốc nếu lỗi
    }
}
// Hàm format ngày giờ sự kiện (giữ nguyên hoặc sửa nếu muốn)
const formatEventDateTime = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        // Bạn có thể dùng thư viện như date-fns hoặc moment.js để định dạng phức tạp hơn
        // Ví dụ định dạng đơn giản: HH:mm Ngày DD Tháng MM Năm YYYY
        return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} Ngày ${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } catch (e) {
        return "Thời gian không hợp lệ";
    }

};


const EventCard: React.FC<EventCardProps> = ({ event, onActionComplete }) => {
    const { user } = useAuth();
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [displayParticipating, setDisplayParticipating] = useState(event.isParticipating ?? false);

    useEffect(() => {
        setDisplayParticipating(event.isParticipating ?? false);
    }, [event.isParticipating]);

    const handleJoin = async () => { if (!user) return;
        setIsLoadingAction(true);
        setActionError(null);
        try {
            await joinEventApi(event.id); // Gọi API
            console.log(`Successfully joined event ${event.id}`);
            setDisplayParticipating(true); // <<<--- THÊM DÒNG NÀY ĐỂ ĐỔI NÚT NGAY
            onActionComplete?.();          // <<<--- Gọi callback báo HomePage (nếu có)
        } catch (err: any) {
            setActionError(err.message || "Lỗi khi tham gia.");
            // Nếu lỗi thì KHÔNG đổi nút
        } finally {
            setIsLoadingAction(false);
        }};
    const handleLeave = async () => { 
        if (!user) return;
        setIsLoadingAction(true);
        setActionError(null);
        try {
            await leaveEventApi(event.id); // Gọi API
            console.log(`Successfully left event ${event.id}`);
            setDisplayParticipating(false); // <<<--- THÊM DÒNG NÀY ĐỂ ĐỔI NÚT NGAY
            onActionComplete?.();           // <<<--- Gọi callback báo HomePage (nếu có)
        } catch (err: any) {
            setActionError(err.message || "Lỗi khi rời sự kiện.");
             // Nếu lỗi thì KHÔNG đổi nút
        } finally {
            setIsLoadingAction(false);
        }
    };

    return (
        <Card className="shadow-sm mb-4 event-post-card "> {/* Thêm mb-4 tạo khoảng cách */}
            {/* === PHẦN HEADER === */}
            <Card.Header className=" border-bottom-0 pt-3 pb-2"> {/* Nền trắng, bỏ border dưới */}
                <Row className="align-items-center">
                    {/* Avatar */}
                    <Col xs="auto" className="pe-0"> {/* xs="auto" để cột vừa với avatar, pe-0 xóa padding phải */}
                        <Link to={`/profile/${event.creator?.id || ''}`}> {/* TODO: Cần route profile người khác */}
                            <RBImage
                                src={event.creator?.avatarUrl || defaultAvatar}
                                roundedCircle
                                width={40}
                                height={40}
                                style={{ objectFit: 'cover' }}
                                alt={event.creator?.username}
                            />
                        </Link>
                    </Col>
                    {/* Tên và Thời gian */}
                    <Col className='text-start'>
                        <Link to={`/profile/${event.creator?.id || ''}`} className="text-decoration-none  fw-bold">
                             @{event.creator?.username || 'Người dùng ẩn'}
                        </Link>
                        <div className="text-muted d-flex justify-content-between" style={{ fontSize: '0.85em' }}>
                            {/* TODO: Thêm link đến chi tiết sự kiện sau */}
                            {/* <Link to={`/events/${event.id}`} className="text-muted text-decoration-none"> */}
                                {formatTimeAgo(event.createdAt)} {/* Thời gian tạo sự kiện */}
                            {/* </Link> */}
                             {/* Hiển thị địa điểm ngắn gọn ở đây nếu muốn */}
                             {event.location && <>  <i className="bi bi-geo-alt-fill me-1"></i>{event.location}</>}
                        </div>
                    </Col>
                     {/* TODO: Thêm nút Options (...) ở đây */}
                     {/* <Col xs="auto">...</Col> */}
                </Row>
            </Card.Header>

             {/* === PHẦN BODY (Text Content & Event Info) === */}
            <Card.Body className="pt-2 pb-3">
                <Card.Title as="h6" className="mb-2">{event.title}</Card.Title> {/* Tiêu đề nhỏ hơn */}
                {/* Mô tả sự kiện */}
                {event.description && (
                     <p style={{ fontSize: '0.95em', whiteSpace: 'pre-wrap' }} className="mb-2">
                        {/* TODO: Thêm logic "Xem thêm" nếu mô tả quá dài */}
                        {event.description}
                     </p>
                )}
                 {/* Thông tin thời gian diễn ra sự kiện */}
                 <p className="mb-2 text-muted" style={{ fontSize: '0.9em' }}>
                     <i className="bi bi-calendar-event me-1"></i> {/* Icon */}
                     <strong>Diễn ra:</strong> {formatEventDateTime(event.eventTime)}
                 </p>
            </Card.Body>

             {/* === PHẦN ẢNH SỰ KIỆN (Nếu có) === */}
             {/* Ảnh giờ nằm sau phần text */}
            {event.imageUrl && (
                <Card.Img
                    variant="bottom" // Hoặc không cần variant nếu muốn ảnh tràn card
                    src={event.imageUrl}
                    alt={event.title}
                    style={{ maxHeight: '500px', objectFit: 'cover' }} // Giới hạn chiều cao ảnh
                     onError={(e) => { /* ... xử lý lỗi ảnh ... */ }}
                />
            )}
            {/* <hr /> */}

            {/* === PHẦN FOOTER (Nút Actions & Lỗi) === */}
            <Card.Footer className="pt-2 pb-2"> {/* Nền trắng */}
                 {/* Hiển thị lỗi */}
                 {actionError && <Alert variant="danger" size="sm" className="mb-2 py-1" onClose={() => setActionError(null)} dismissible>{actionError}</Alert>}

                 {/* Các nút */}
                 <div className="d-flex justify-content-between p-2 align-items-center event-button-container"> {/* Dàn đều các nút */}
                    {/* Nút Chi tiết - Có thể đổi thành icon hoặc bỏ đi */}
                     {/* <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                         <Button variant="light" size="sm" className="flex-grow-1 me-1"> 
                            <i className="bi bi-info-circle me-1"></i> Chi tiết
                         </Button>
                     </Link> */}

                     {/* Nút Tham gia/Rời khỏi */}
                    {user && (
                        <>
                            {displayParticipating ? (
                                <Button variant="outline-danger" size="sm" onClick={handleLeave} disabled={isLoadingAction} className="join-button">
                                    {isLoadingAction ? <Spinner size="sm" animation="border" /> : <><i className="bi bi-x-lg me-1"></i> Rời khỏi</>}
                                </Button>
                            ) : (
                                <Button variant="success" size="sm" onClick={handleJoin} disabled={isLoadingAction} className="join-button">
                                     {isLoadingAction ? <Spinner size="sm" animation="border" className="me-1" /> : <><i className="bi bi-check-lg me-1 "></i> Sẽ tham gia</>}
                                </Button>
                            )}
                        </>
                    )}
                    {/* TODO: Thêm nút Bình luận/Chia sẻ (nếu làm sau) */}
                    {/* <Button variant="light" size="sm" className="flex-grow-2 mx-2"><i className="bi bi-chat me-1"></i> Bình luận</Button> 
                     <Button variant="light" size="sm" className="flex-grow- ms-2"><i className="bi bi-share me-1"></i> Chia sẻ</Button>  */}
                 </div>
            </Card.Footer>
        </Card>
    );
};

export default EventCard;