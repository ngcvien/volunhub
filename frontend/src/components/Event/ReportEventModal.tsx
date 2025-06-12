import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { ReportType } from "../../types/report";
import { reportEvent } from '../../api/report.api';
import { toast } from 'react-toastify';

interface ReportEventModalProps {
    show: boolean;
    onHide: () => void;
    eventId: number;
}

const ReportEventModal: React.FC<ReportEventModalProps> = ({ show, onHide, eventId }) => {
    const [type, setType] = useState<ReportType>(ReportType.INAPPROPRIATE_CONTENT);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await reportEvent(eventId, {
                type,
                description
            });
            toast.success('Báo cáo đã được gửi thành công.');
            onHide();
        } catch (err) {
            setError('Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Báo cáo sự kiện</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Loại báo cáo</Form.Label>
                        <Form.Select
                            value={type}
                            onChange={(e) => setType(e.target.value as ReportType)}
                            required
                        >
                            <option value={ReportType.INAPPROPRIATE_CONTENT}>
                                Nội dung không phù hợp
                            </option>
                            <option value={ReportType.SPAM}>Spam</option>
                            <option value={ReportType.HARASSMENT}>Quấy rối</option>
                            <option value={ReportType.FAKE_EVENT}>Sự kiện giả mạo</option>
                            <option value={ReportType.OTHER}>Khác</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả chi tiết</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Vui lòng mô tả chi tiết lý do báo cáo..."
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Hủy
                    </Button>
                    <Button variant="danger" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ReportEventModal; 