// frontend/src/pages/CreateEventPage.tsx
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createEventApi } from '../api/event.api'; // Import hàm API

const CreateEventPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [eventTime, setEventTime] = useState(''); // State cho input datetime-local

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!title || !eventTime) {
            setError('Tiêu đề và Thời gian sự kiện là bắt buộc.');
            return;
        }

        // Chuyển đổi chuỗi datetime-local thành đối tượng Date hoặc chuỗi ISO 8601 chuẩn
        // Input datetime-local trả về dạng "YYYY-MM-DDTHH:mm"
        // Backend (Sequelize/MySQL) thường mong đợi Date object hoặc chuỗi ISO 8601 "YYYY-MM-DDTHH:mm:ss.sssZ"
        let formattedEventTime: Date | string;
        try {
            // Cố gắng tạo đối tượng Date, nó sẽ dùng timezone của trình duyệt
             formattedEventTime = new Date(eventTime);
             // Kiểm tra xem Date có hợp lệ không
             if (isNaN(formattedEventTime.getTime())) {
                 throw new Error('Invalid Date');
             }
             // Chuyển sang chuỗi ISO để gửi đi (Backend sẽ parse lại)
             // formattedEventTime = formattedEventTime.toISOString(); // Gửi giờ UTC
        } catch (dateError) {
             setError('Định dạng Thời gian sự kiện không hợp lệ.');
             return;
        }


        setLoading(true);
        try {
            // Gọi API tạo sự kiện, không cần gửi creatorId vì backend tự lấy từ token
            const response = await createEventApi({
                title,
                description: description || null, // Gửi null nếu trống
                location: location || null,     // Gửi null nếu trống
                eventTime: formattedEventTime,
                 // Các trường id, creatorId, createdAt, updatedAt không cần gửi
            });
            setSuccess(`Sự kiện "${response.event.title}" đã được tạo thành công!`);
            // Reset form
            setTitle('');
            setDescription('');
            setLocation('');
            setEventTime('');
            // Có thể điều hướng đến trang chi tiết sự kiện mới tạo sau này
            // navigate(`/events/${response.event.id}`);
            setTimeout(() => setSuccess(null), 3000); // Ẩn thông báo thành công sau 3s

        } catch (err: any) {
            setError(err.message || 'Tạo sự kiện thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-4 mb-5" > {/* Giảm mt do có padding body/container */}
             <Row className="" divider="row" style={{ minWidth: '60vh' }}>
                <Col xs={12} md={12} lg={12}> {/* Cho form rộng hơn một chút */}
                    <Card className="shadow-sm border-0">
                         <Card.Header as="h3" className="p-3">Tạo Sự Kiện Mới</Card.Header>
                        <Card.Body className="p-4 p-md-5">
                            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="eventTitle">
                                    <Form.Label>Tiêu đề sự kiện <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tiêu đề sự kiện"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="eventDescription">
                                    <Form.Label>Mô tả</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Nhập mô tả chi tiết về sự kiện"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="eventLocation">
                                    <Form.Label>Địa điểm</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập địa điểm diễn ra sự kiện"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="eventTime">
                                    <Form.Label>Thời gian diễn ra <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="datetime-local" // Input chuẩn cho ngày giờ
                                        value={eventTime}
                                        onChange={(e) => setEventTime(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                     <Form.Text muted>
                                        Chọn ngày và giờ sự kiện bắt đầu.
                                    </Form.Text>
                                </Form.Group>

                                {/* TODO: Thêm input upload ảnh ở đây sau */}

                                <div className=""> {/* Căn giữa nút */}
                                    <Button variant="primary" type="submit" disabled={loading} size="lg">
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" animation="border" className="me-2" /> Đang tạo...
                                            </>
                                        ) : 'Tạo Sự Kiện'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateEventPage;