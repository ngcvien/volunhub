// frontend/src/components/Event/EventCard.tsx
import React, { useState } from 'react'; // <<<--- Đảm bảo có { useState } ở đây
import { Card, Button, Spinner, Alert } from 'react-bootstrap'; // <<<--- KIỂM TRA DÒNG NÀY
import { Link } from 'react-router-dom'; // Để tạo link đến chi tiết sự kiện sau này
import { EventType } from '../../types/event.types'; // Import kiểu EventType
import { useAuth } from '../../contexts/AuthContext';
import { joinEventApi, leaveEventApi } from '../../api/event.api';


// Định nghĩa props cho component
interface EventCardProps {
    event: EventType;
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


const EventCard: React.FC<EventCardProps> = ({ event /*, onParticipationChange */ }) => {
    const { user } = useAuth(); // Chỉ cần lấy user để kiểm tra đăng nhập

    // State quản lý hành động (Join hoặc Leave)
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Sử dụng trực tiếp prop event.isParticipating để quyết định hiển thị nút nào
    // Không cần state hasJoinedLocally nữa

    // Hàm xử lý khi nhấn nút Tham gia
    const handleJoin = async () => {
        if (!user) return; // Double check login

        setIsLoadingAction(true);
        setActionError(null);
        try {
            await joinEventApi(event.id);
            // TODO: Gọi callback để báo HomePage refresh list
            // onParticipationChange?.();
            // Tạm thời chỉ log hoặc không làm gì ở đây, UI sẽ chưa cập nhật ngay
            console.log(`Successfully joined event ${event.id}`);
            // Có thể set một state tạm thời để đổi nút ngay lập tức (nếu muốn UX tốt hơn mà chưa cần refresh)
            // Ví dụ: setDidJustJoin(true); // Nhưng cách tốt nhất là refresh data gốc
        } catch (err: any) {
            setActionError(err.message || "Lỗi khi tham gia.");
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
            await leaveEventApi(event.id);
            // TODO: Gọi callback để báo HomePage refresh list
            // onParticipationChange?.();
            console.log(`Successfully left event ${event.id}`);
            // Tương tự, cần refresh data gốc để UI cập nhật đúng isParticipating
        } catch (err: any) {
            setActionError(err.message || "Lỗi khi rời sự kiện.");
        } finally {
            setIsLoadingAction(false);
        }
    };

    return (
        <Card className="h-100 shadow-sm">
            {/* ... Card.Img ... */}
            <Card.Body className="d-flex flex-column">
                 {/* ... Card.Title, Subtitle, Text ... */}
                 <Card.Title className="fw-bold">{event.title}</Card.Title>
                 {/* ... creator, description, time, location ... */}
                 {/* --- BẮT ĐẦU ĐOẠN CODE BỊ THIẾU --- */}
        <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: '0.9em' }}>
            Tạo bởi: {event.creator?.username || 'Không rõ'}
        </Card.Subtitle>
        <Card.Text as="div" className="flex-grow-1"> {/* flex-grow-1 để text chiếm không gian */}
             {/* Hiển thị mô tả ngắn gọn */}
            <p style={{ fontSize: '0.95em' }}>
                {event.description ? (event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description) : <i>Không có mô tả</i>}
            </p>
             {/* Thông tin thời gian, địa điểm */}
            <p className="mb-1" style={{ fontSize: '0.9em' }}>
                <strong>Thời gian:</strong> {formatDateTime(event.eventTime)}
            </p>
            <p style={{ fontSize: '0.9em' }}>
                <strong>Địa điểm:</strong> {event.location || 'Chưa cập nhật'}
            </p>
        </Card.Text>
        {/* --- KẾT THÚC ĐOẠN CODE BỊ THIẾU --- */}


                 {/* Hiển thị lỗi nếu có */}
                {actionError && <Alert variant="danger" size="sm" className="mt-2 py-1" onClose={() => setActionError(null)} dismissible>{actionError}</Alert>}

                {/* Nút hành động */}
                <div className="mt-auto d-flex justify-content-between align-items-center pt-2"> {/* Thêm pt-2 */}
                    <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="outline-secondary" size="sm">Xem chi tiết</Button> {/* Đổi màu nút chi tiết */}
                    </Link>

                    {/* Chỉ hiển thị nút Join/Leave nếu user đã đăng nhập */}
                    {user && (
                        <>
                            {event.isParticipating ? (
                                // Nếu ĐÃ tham gia -> Hiển thị nút Rời khỏi
                                <Button
                                    variant="outline-danger" // Nút rời khỏi màu đỏ outline
                                    size="sm"
                                    onClick={handleLeave}
                                    disabled={isLoadingAction}
                                >
                                    {isLoadingAction ? (
                                        <Spinner size="sm" animation="border" />
                                    ) : (
                                        <>
                                            <i className="bi bi-x-lg me-1"></i> {/* Icon (cần cài react-bootstrap-icons) */}
                                            Rời khỏi
                                        </>
                                    )}
                                </Button>
                            ) : (
                                // Nếu CHƯA tham gia -> Hiển thị nút Tham gia
                                <Button
                                    variant="success" // Nút tham gia màu xanh lá
                                    size="sm"
                                    onClick={handleJoin}
                                    disabled={isLoadingAction}
                                >
                                    {isLoadingAction ? (
                                         <Spinner size="sm" animation="border" className="me-1" />
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg me-1"></i> {/* Icon */}
                                            Tham gia
                                        </>
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;