import React, { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaFlag } from 'react-icons/fa';
import ReportEventModal from './ReportEventModal';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

interface ReportButtonProps {
    eventId: number;
    className?: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ eventId, className }) => {
    const [showReportModal, setShowReportModal] = useState(false);
    const { user } = useAuth();

    const handleReportClick = () => {
        if (!user) {
            toast.warning('Vui lòng đăng nhập để báo cáo sự kiện.');
            return;
        }
        setShowReportModal(true);
    };

    return (
        <>
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Báo cáo sự kiện</Tooltip>}
            >
                <Button
                    variant="link"
                    className={`p-0 text-muted ${className}`}
                    onClick={handleReportClick}
                    style={{ fontSize: '1.2rem' }}
                >
                    <FaFlag />
                </Button>
            </OverlayTrigger>

            <ReportEventModal
                show={showReportModal}
                onHide={() => setShowReportModal(false)}
                eventId={eventId}
            />
        </>
    );
};

export default ReportButton; 