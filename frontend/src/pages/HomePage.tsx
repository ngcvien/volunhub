// frontend/src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getAllEventsApi } from '../api/event.api'; // Import hàm gọi API
import { EventType } from '../types/event.types'; // Import kiểu EventType
import EventCard from '../components/Event/EventCard'; // Import component EventCard

const HomePage = () => {
    const [events, setEvents] = useState<EventType[]>([]); // State lưu danh sách sự kiện
    const [loading, setLoading] = useState<boolean>(true); // State trạng thái loading
    const [error, setError] = useState<string | null>(null); // State lưu lỗi

    // useEffect để gọi API khi component được mount lần đầu
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getAllEventsApi();
                setEvents(response.events); // Lưu danh sách sự kiện vào state
            } catch (err: any) {
                setError(err.message || 'Không thể tải dữ liệu sự kiện.');
            } finally {
                setLoading(false); // Kết thúc loading dù thành công hay thất bại
            }
        };

        fetchEvents();
    }, []); // Mảng dependency rỗng nghĩa là chỉ chạy 1 lần khi mount

    // --- Phần hiển thị ---
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p>Đang tải sự kiện...</p>
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger" className="mt-4">{error}</Alert>;
        }

        if (events.length === 0) {
            return <Alert variant="info" className="mt-4">Chưa có sự kiện nào được tạo.</Alert>;
        }

        // Hiển thị danh sách sự kiện dùng Grid và EventCard
        return (
            // Sử dụng Row và Col của React Bootstrap để tạo lưới responsive
            // lg={4}: 3 card trên dòng màn hình lớn
            // md={6}: 2 card trên dòng màn hình vừa
            // xs={12}: 1 card trên dòng màn hình nhỏ
            <Row xs={12} md={6} lg={2} className="g-4 mt-3"> {/* g-4 tạo khoảng cách giữa các card */}
                {events.map((event) => (
                    <Col key={event.id}>
                        <EventCard event={event} />
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Container>
            <h1 className="my-4">Sự kiện sắp diễn ra</h1>
            {/* TODO: Thêm bộ lọc, tìm kiếm, nút Tạo sự kiện mới ở đây */}
            {renderContent()}
        </Container>
    );
};

export default HomePage;