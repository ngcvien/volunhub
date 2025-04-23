// frontend/src/components/Event/EventCard.tsx
import React, { useState, useEffect } from 'react'; // <<<--- Đảm bảo có { useState } ở đây
import { Card, Button, Spinner, Alert } from 'react-bootstrap'; // <<<--- KIỂM TRA DÒNG NÀY
import { Link } from 'react-router-dom'; // Để tạo link đến chi tiết sự kiện sau này
import { EventType } from '../../types/event.types'; // Import kiểu EventType
import { useAuth } from '../../contexts/AuthContext';
import { joinEventApi, leaveEventApi } from '../../api/event.api';


// Định nghĩa props cho component
interface EventCardProps {
    event: EventType;
    onActionComplete?: () => void; 
}

// Hàm để định dạng ngày giờ cho dễ đọc hơn (ví dụ)
const formatDateTime = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        // Bạn có thể dùng thư viện như date-fns hoặc moment.js để định dạng phức tạp hơn
        // Ví dụ định dạng đơn giản: HH:mm Ngày DD Tháng MM Năm YYYY
        return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} Ngày ${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
    } catch (e) {
        return "Thời gian không hợp lệ";
    }
};


const EventCard: React.FC<EventCardProps> = ({ event , onActionComplete  }) => {
    const { user } = useAuth(); 

    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

   
    const [displayParticipating, setDisplayParticipating] = useState(event.isParticipating ?? false);

    useEffect(() => {
        setDisplayParticipating(event.isParticipating ?? false);
    }, [event.isParticipating]);
   
    const handleJoin = async () => {
        if (!user) return;
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
        }
    };

    // Hàm xử lý khi nhấn nút Rời khỏi
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
    const placeholderImageUrl = "/placeholder-event.png"; 

    return (
        <Card className="h-100 shadow-sm" >
            <Card.Img
                variant="top" 
                src={event.imageUrl || placeholderImageUrl}
                alt={event.title} 
                style={{ height: '260px', objectFit: 'cover', borderRadius: '0.25rem' }} 
                onError={(e) => {
                   const target = e.target as HTMLImageElement;
                   if (target.src !== placeholderImageUrl) {
                      target.src = placeholderImageUrl;
                   }
                   target.onerror = null; 
                }}
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold">{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.9em' }}>
                    Tạo bởi: {event.creator?.username || 'Không rõ'}
                </Card.Subtitle>
                <Card.Text as="div" className="flex-grow-1">
                    <p style={{ fontSize: '0.95em' }}>
                        {event.description ? (event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description) : <i>Không có mô tả</i>}
                    </p>
                    <p className="mb-1" style={{ fontSize: '0.9em' }}>
                        <strong>Thời gian:</strong> {formatDateTime(event.eventTime)}
                    </p>
                    <p style={{ fontSize: '0.9em' }}>
                        <strong>Địa điểm:</strong> {event.location || 'Chưa cập nhật'}
                    </p>
                </Card.Text>


                {actionError && <Alert variant="danger" size="sm" className="mt-2 py-1" onClose={() => setActionError(null)} dismissible>{actionError}</Alert>}

                <div className="mt-auto d-flex justify-content-between align-items-center pt-2"> {/* Thêm pt-2 */}
                    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outline-secondary" size="sm">Xem chi tiết</Button> {/* Đổi màu nút chi tiết */}
                    </Link>

                    {/* Chỉ hiển thị nút Join/Leave nếu user đã đăng nhập */}
                    {user && (
                        <>
                            {displayParticipating ? (
                                // Nếu (state cục bộ) ĐÃ tham gia -> Hiển thị nút Rời khỏi
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={handleLeave}
                                    disabled={isLoadingAction}
                                >
                                    {/* ... Nội dung nút Rời khỏi (Spinner hoặc Icon+Text) ... */}
                                    {isLoadingAction ? <Spinner size="sm" animation="border" /> : <><i className="bi bi-x-lg me-1"></i> Rời khỏi</>}
                                </Button>
                            ) : (
                                // Nếu (state cục bộ) CHƯA tham gia -> Hiển thị nút Tham gia
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={handleJoin}
                                    disabled={isLoadingAction}
                                >
                                    {/* ... Nội dung nút Tham gia (Spinner hoặc Icon+Text) ... */}
                                    {isLoadingAction ? <Spinner size="sm" animation="border" className="me-1" /> : <><i className="bi bi-check-lg me-1"></i> Tham gia</>}
                                </Button>
                            )}
                            {/* --- KẾT THÚC SỬA ĐIỀU KIỆN --- */}
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;