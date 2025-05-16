// frontend/src/pages/admin/AdminEventApprovalPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Spinner, Alert, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminGetPendingEventsApi, adminApproveEventApi, adminRejectEventApi } from '../../api/admin.api';
import { EventType, EventStatus } from '../../types/event.types'; 
// import { formatDateTimeSimple } from '../../utils/formatters'; // Nếu có hàm format chung

// Hàm format ngày đơn giản (nếu chưa có utils)
const formatDateTimeSimple = (isoString: string): string => {
    try { return new Date(isoString).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'}); }
    catch(e) { return "N/A"; }
};


const AdminEventApprovalPage = () => {
    const [pendingEvents, setPendingEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State để theo dõi sự kiện nào đang được xử lý (approve/reject)
    const [processingEventId, setProcessingEventId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null); // Lỗi khi approve/reject

    const fetchPendingEvents = useCallback(async () => {
        setLoading(true);
        setError(null);
        setActionError(null);
        try {
            const response = await adminGetPendingEventsApi(); // Thêm phân trang nếu cần
            setPendingEvents(response.events);
        } catch (err: any) {
            setError(err.message || 'Lỗi tải danh sách sự kiện chờ duyệt.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingEvents();
    }, [fetchPendingEvents]);

    const handleApprove = async (eventId: number) => {
        setProcessingEventId(eventId);
        setActionError(null);
        try {
            await adminApproveEventApi(eventId);
            // Làm mới danh sách sau khi duyệt thành công
            await fetchPendingEvents();
            // TODO: Thêm thông báo thành công (toast)
        } catch (err: any) {
            setActionError(err.message || `Lỗi khi duyệt sự kiện ID ${eventId}.`);
        } finally {
            setProcessingEventId(null);
        }
    };

    const handleReject = async (eventId: number) => {
        setProcessingEventId(eventId);
        setActionError(null);
        // TODO: Có thể thêm modal hỏi lý do từ chối
        try {
            await adminRejectEventApi(eventId);
            // Làm mới danh sách
            await fetchPendingEvents();
        } catch (err: any) {
            setActionError(err.message || `Lỗi khi từ chối sự kiện ID ${eventId}.`);
        } finally {
            setProcessingEventId(null);
        }
    };

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container><Alert variant="danger" className="mt-4">{error} <Button size="sm" variant="outline-danger" onClick={fetchPendingEvents}>Thử lại</Button></Alert></Container>;

    return (
        <Container fluid className="mt-3 p-5 ">
            <h2 className='text-left mt-4'>Duyệt Sự kiện Mới ({pendingEvents.length})</h2>
            {actionError && <Alert variant="warning" onClose={() => setActionError(null)} dismissible>{actionError}</Alert>}

            {pendingEvents.length === 0 && !loading ? (
                <Alert variant="info" className="mt-3">Không có sự kiện nào đang chờ duyệt.</Alert>
            ) : (
                <Table striped bordered hover responsive className="mt-3 align-middle">
                    <thead className='table-light'>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Người tạo</th>
                            <th>Thời gian tạo</th>
                            <th>Thời gian sự kiện</th>
                            <th className='text-center'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingEvents.map((event) => (
                            <tr key={event.id}>
                                <td>{event.id}</td>
                                <td><Link to={`/events/${event.id}`}>{event.title}</Link></td>
                                <td>
                                    <Link to={`/profile/${event.creator.id}`}>
                                        {event.creator.username} (ID: {event.creator.id})
                                    </Link>
                                </td>
                                <td>{formatDateTimeSimple(event.createdAt)}</td>
                                <td>{formatDateTimeSimple(event.eventTime)}</td>
                                <td className='text-center'>
                                    {processingEventId === event.id ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleApprove(event.id)}
                                                title="Duyệt sự kiện này"
                                            >
                                                <i className="bi bi-check-lg"></i> Duyệt
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleReject(event.id)}
                                                title="Từ chối sự kiện này"
                                            >
                                                <i className="bi bi-x-lg"></i> Từ chối
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default AdminEventApprovalPage;