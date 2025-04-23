// frontend/src/pages/ProfilePage.tsx

import React, { useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'; // Import hook useAuth
import EditProfileForm from '../components/Profile/EditProfileForm'; // <<<--- Import Form Component (Đảm bảo đường dẫn đúng)

// Đường dẫn đến ảnh avatar mặc định trong thư mục public
const defaultAvatar = '/default-avatar.png';

const ProfilePage = () => {
    const { user, isLoading: authIsLoading } = useAuth(); // Lấy thông tin user và trạng thái loading từ context

    // State để quản lý chế độ: 'view' hoặc 'edit'
    const [isEditing, setIsEditing] = useState(false);

    // --- Xử lý trạng thái Loading ban đầu từ AuthContext ---
    // Khi context đang xác thực token lúc tải trang
    if (authIsLoading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải dữ liệu người dùng...</span>
                </Spinner>
            </Container>
        );
    }

    // --- Xử lý trường hợp không có user (dù route đã bảo vệ) ---
    if (!user) {
        return (
            <Container>
                <Alert variant="warning" className="text-center mt-5">
                    Vui lòng <Alert.Link href="/login">đăng nhập</Alert.Link> để xem hồ sơ.
                </Alert>
            </Container>
        );
    }

    // --- Hàm được gọi khi EditProfileForm lưu thành công hoặc bị hủy ---
    const handleFinishEditing = () => {
        setIsEditing(false); // Quay lại chế độ xem
    };

    // --- Phần Render ---
    return (
        // Thêm padding dưới cùng mb-5
        <Container className="mt-4 mb-5" >
            <Row className="justify-content-center">
                 {/* Có thể thu hẹp cột hơn nếu muốn */}
                <Col md={12} lg={12} xl={12}>
                    <Card className="shadow-sm">
                        {/* Tiêu đề Card thay đổi tùy theo chế độ */}
                        <Card.Header as="h3" className="p-3 text-center "> {/* Thêm nền sáng cho header */}
                            {isEditing ? 'Chỉnh Sửa Hồ Sơ' : 'Hồ Sơ Của Bạn'}
                        </Card.Header>

                        <Card.Body className="p-4 p-md-5">
                            {/* --- HIỂN THỊ CÓ ĐIỀU KIỆN DỰA TRÊN isEditing --- */}
                            {isEditing ? (
                                // ---- Chế độ Sửa: Render EditProfileForm ----
                                <EditProfileForm
                                    onSaveSuccess={handleFinishEditing} // Truyền callback để đóng form khi lưu
                                    onCancel={handleFinishEditing}      // Truyền callback để đóng form khi hủy
                                />
                            ) : (
                                // ---- Chế độ Xem: Hiển thị thông tin user ----
                                <Row>
                                    {/* Cột Avatar */}
                                    <Col xs={12} sm={4} className="text-center mb-4 mb-sm-0">
                                        <Image
                                            src={user.avatarUrl || defaultAvatar}
                                            roundedCircle // Bo tròn
                                            fluid       // Responsive
                                            thumbnail   // Thêm viền nhẹ
                                            style={{ width: '200px', height: 'auto', objectFit: 'cover' }} // Kích thước cố định
                                            alt={user.username}
                                        />
                                    </Col>
                                    {/* Cột Thông tin */}
                                    <Col xs={12} sm={8}>
                                         {/* Tên: Ưu tiên fullName, nếu không có thì dùng username */}
                                        <h4>{user.fullName || user.username}</h4>
                                         {/* Hiển thị username nếu khác fullName */}
                                        {user.fullName && <p className="text-muted">@{user.username}</p>}
                                        <hr />
                                        <p className="mb-1">
                                            <strong>Email:</strong> {user.email}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Địa điểm:</strong> {user.location || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                                        </p>
                                        <div> {/* Dùng div để xử lý xuống dòng cho bio */}
                                             <strong>Tiểu sử:</strong>
                                             <p className="mt-1" style={{ whiteSpace: 'pre-wrap' }}> {/* Giữ định dạng xuống dòng */}
                                                 {user.bio || <span className="text-muted fst-italic">Chưa cập nhật tiểu sử...</span>}
                                             </p>
                                        </div>
                                        <p className="text-muted mt-3" style={{ fontSize: '0.9em' }}>
                                            Tham gia vào: {user.createdAt ? formatDateTimeSimple(user.createdAt) : 'N/A'}
                                        </p>

                                        {/* Nút mở chế độ sửa */}
                                        <Button
                                            variant="outline-primary" // Đổi thành outline
                                            size="sm"
                                            onClick={() => setIsEditing(true)} // Chuyển sang chế độ sửa
                                            className="mt-2"
                                        >
                                             <i className="bi bi-pencil-square me-1"></i> {/* Icon (cần BS Icons) */}
                                             Chỉnh sửa hồ sơ
                                        </Button>
                                    </Col>
                                </Row>
                            )}
                            {/* --- KẾT THÚC HIỂN THỊ CÓ ĐIỀU KIỆN --- */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

// Hàm format ngày đơn giản (có thể đặt ở utils)
const formatDateTimeSimple = (isoString: string): string => {
     try {
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
        return "N/A";
    }
};


export default ProfilePage;