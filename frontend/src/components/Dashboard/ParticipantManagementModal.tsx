// frontend/src/components/Dashboard/ParticipantManagementModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, ListGroup, Image as RBImage, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getParticipantsForEventManagementApi, confirmParticipantApi } from '../../api/event.api'; // Import API functions
import { ParticipantDetail, CompletionStatus } from '../../types/participation.types'; // Import types

const defaultAvatar = '/default-avatar.png';

interface ParticipantManagementModalProps {
    show: boolean; // Trạng thái ẩn/hiện modal
    onHide: () => void; // Hàm để đóng modal
    eventId: number | null; // ID của sự kiện đang quản lý
    eventName?: string; // Tên sự kiện để hiển thị trên title modal
    // Optional: Callback để báo cho dashboard biết có thay đổi cần refresh list event (nếu cần)
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
    // State để biết đang xác nhận user nào (hiển thị spinner trên nút)
    const [confirmingUserId, setConfirmingUserId] = useState<number | null>(null);
    const [confirmError, setConfirmError] = useState<string | null>(null); // Lỗi khi xác nhận

    // Hàm fetch danh sách người tham gia
    const fetchParticipants = useCallback(async () => {
        if (!eventId) return; // Không fetch nếu không có eventId

        setLoading(true);
        setError(null);
        setConfirmError(null); // Reset lỗi confirm cũ
        try {
            console.log(`Fetching participants for event ${eventId}`);
            const response = await getParticipantsForEventManagementApi(eventId);
            setParticipants(response.participants);
        } catch (err: any) {
            setError(err.message || 'Lỗi tải danh sách người tham gia.');
        } finally {
            setLoading(false);
        }
    }, [eventId]); // Phụ thuộc vào eventId

    // Gọi fetchParticipants khi modal được mở hoặc eventId thay đổi
    useEffect(() => {
        if (show && eventId) {
            fetchParticipants();
        } else {
            // Reset state khi modal đóng hoặc không có eventId
            setParticipants([]);
            setError(null);
            setConfirmError(null);
            setLoading(false);
        }
    }, [show, eventId, fetchParticipants]);

    // Hàm xử lý khi nhấn nút "Xác nhận"
    const handleConfirm = async (participantUserId: number) => {
        if (!eventId) return;

        setConfirmingUserId(participantUserId); // Bắt đầu loading cho nút này
        setConfirmError(null);
        try {
            await confirmParticipantApi(eventId, participantUserId);
            // Tải lại danh sách participants trong modal để cập nhật trạng thái
            await fetchParticipants();
            // Thông báo cho component cha (dashboard) nếu cần cập nhật gì đó (vd: participant count)
            onConfirmSuccess?.();
        } catch (err: any) {
            setConfirmError(err.message || `Lỗi xác nhận cho user ${participantUserId}.`);
        } finally {
            setConfirmingUserId(null); // Kết thúc loading cho nút này
        }
    };

    // Render nội dung danh sách người tham gia
    const renderParticipantList = () => {
        if (loading) return <div className="text-center"><Spinner animation="border" size="sm" /> Đang tải...</div>;
        if (error) return <Alert variant="danger">{error}</Alert>;
        if (participants.length === 0) return <p className="text-muted text-center">Chưa có ai đăng ký tham gia sự kiện này.</p>;

        return (
            <ListGroup variant="flush">
                {participants.map((p) => (
                    <ListGroup.Item key={p.userId} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <Link to={`/profile/${p.user.id}`}>
                                <RBImage
                                    src={p.user.avatarUrl || defaultAvatar}
                                    alt={p.user.username}
                                    roundedCircle
                                    width={35} height={35}
                                    className="me-3"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Link>
                            <Link to={`/profile/${p.user.id}`} className="text-decoration-none text-body fw-medium">
                                {p.user.username}
                            </Link>
                        </div>
                        <div>
                            {/* Hiển thị trạng thái hoặc nút xác nhận */}
                            {p.completionStatus === CompletionStatus.CONFIRMED ? (
                                <Badge bg="success"><i className="bi bi-check-circle-fill me-1"></i> Đã xác nhận</Badge>
                            ) : p.completionStatus === CompletionStatus.ABSENT ? (
                                <Badge bg="secondary">Vắng mặt</Badge>
                            ) : ( // Trạng thái PENDING
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => handleConfirm(p.userId)}
                                    disabled={confirmingUserId === p.userId} // Disable khi đang xử lý user này
                                >
                                    {confirmingUserId === p.userId ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        'Xác nhận'
                                    )}
                                </Button>
                            )}
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };


    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Quản lý Tình nguyện viên: {eventName || `Sự kiện #${eventId}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ minHeight: '200px' }}> {/* Đặt chiều cao tối thiểu */}
                {confirmError && <Alert variant="warning" size="sm" className="mb-3">{confirmError}</Alert>}
                {renderParticipantList()}
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