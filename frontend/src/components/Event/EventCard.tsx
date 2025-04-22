// frontend/src/components/Event/EventCard.tsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Để tạo link đến chi tiết sự kiện sau này
import { EventType } from '../../types/event.types'; // Import kiểu EventType

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


const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <Card className="h-100 shadow-sm"> {/* h-100 để các card cao bằng nhau trong Row */}
             {/* TODO: Thêm ảnh sự kiện ở đây khi có */}
             {/* <Card.Img variant="top" src={event.image_url || "/placeholder-image.jpg"} /> */}
            <Card.Body className="d-flex flex-column"> {/* flex-column để nút bấm đẩy xuống dưới */}
                <Card.Title className="fw-bold">{event.title}</Card.Title>
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
                 {/* Các nút hành động */}
                <div className="mt-auto"> {/* Đẩy nút xuống dưới cùng card */}
                    {/* TODO: Thay đổi link và thêm chức năng cho nút */}
                    <Link to={`/events/${event.id}`}> {/* Link đến trang chi tiết (cần tạo route sau) */}
                        <Button variant="primary" size="sm" className="me-2">Xem chi tiết</Button>
                    </Link>
                     {/* <Button variant="outline-success" size="sm">Tham gia</Button> */}
                </div>
            </Card.Body>
        </Card>
    );
};

export default EventCard;