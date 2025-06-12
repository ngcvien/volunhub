import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';
import { getReports, updateReportStatus } from '../../api/report.api';
import { Report, ReportStatus, ReportType } from '../../types/report';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ReportManagement: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [adminNote, setAdminNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(ReportStatus.PENDING);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await getReports();
            setReports(response.reports);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách báo cáo.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reportId: number, status: ReportStatus) => {
        try {
            await updateReportStatus(reportId, status, adminNote);
            toast.success('Cập nhật trạng thái thành công.');
            fetchReports(); // Refresh danh sách
            setShowModal(false);
        } catch (err) {
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái.');
        }
    };

    const getStatusBadge = (status: ReportStatus) => {
        const variants = {
            [ReportStatus.PENDING]: 'warning',
            [ReportStatus.REVIEWING]: 'info',
            [ReportStatus.RESOLVED]: 'success',
            [ReportStatus.REJECTED]: 'danger'
        };
        return <Badge bg={variants[status]}>{status}</Badge>;
    };

    const getTypeLabel = (type: ReportType) => {
        const labels = {
            [ReportType.INAPPROPRIATE_CONTENT]: 'Nội dung không phù hợp',
            [ReportType.SPAM]: 'Spam',
            [ReportType.HARASSMENT]: 'Quấy rối',
            [ReportType.FAKE_EVENT]: 'Sự kiện giả mạo',
            [ReportType.OTHER]: 'Khác'
        };
        return labels[type];
    };

    const handleShowModal = (report: Report) => {
        setSelectedReport(report);
        setAdminNote(report.adminNote || '');
        setSelectedStatus(report.status);
        setShowModal(true);
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="report-management">
            <h2 className="mb-4">Quản lý báo cáo</h2>
            
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Người báo cáo</th>
                        <th>Sự kiện</th>
                        <th>Loại báo cáo</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                        <th>Thời gian</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td>{report.id}</td>
                            <td>{report.reporter?.username}</td>
                            <td>{report.reportedEvent?.title}</td>
                            <td>{getTypeLabel(report.type)}</td>
                            <td>{report.description}</td>
                            <td>{getStatusBadge(report.status)}</td>
                            <td>{format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleShowModal(report)}
                                >
                                    Xử lý
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xử lý báo cáo #{selectedReport?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as ReportStatus)}
                            >
                                <option value={ReportStatus.PENDING}>Chờ xử lý</option>
                                <option value={ReportStatus.REVIEWING}>Đang xem xét</option>
                                <option value={ReportStatus.RESOLVED}>Đã xử lý</option>
                                <option value={ReportStatus.REJECTED}>Từ chối</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                                placeholder="Nhập ghi chú xử lý..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => selectedReport && handleStatusChange(selectedReport.id, selectedStatus)}
                    >
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReportManagement; 