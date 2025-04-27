// frontend/src/components/Event/EventPostItem.tsx
import React from 'react';
import { Card, Image as RBImage, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EventPostType } from '../../types/event.types'; // Import type post
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// Ảnh avatar mặc định
const defaultAvatar = '/default-avatar.png';

interface EventPostItemProps {
    post: EventPostType;
    eventCreatorId: number; // ID của người tạo sự kiện để so sánh
}

// Hàm format thời gian (có thể đưa ra utils)
const formatTimeAgo = (isoString: string): string => {
    try {
        return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi });
    } catch (e) { return isoString; }
};

const EventPostItem: React.FC<EventPostItemProps> = ({ post, eventCreatorId }) => {
    // Kiểm tra xem người đăng bài có phải là người tổ chức sự kiện không
    const isCreator = post.author.id === eventCreatorId;

    return (
        // Dùng Card hoặc chỉ div tùy theo thiết kế bạn muốn
        <Card className="mb-3 shadow-sm border-0 event-post-item">
            <Card.Body className="p-3">
                <div className="d-flex align-items-start mb-2">
                    {/* Avatar người đăng */}
                    <Link to={`/profile/${post.author.id}`} className="me-2 flex-shrink-0">
                        <RBImage
                            src={post.author.avatarUrl || defaultAvatar}
                            alt={post.author.username}
                            roundedCircle
                            width={38}
                            height={38}
                            style={{ objectFit: 'cover' }}
                        />
                    </Link>
                    {/* Tên, Tag, Thời gian */}
                    <div className="flex-grow-1">
                        <div>
                            <Link to={`/profile/${post.author.id}`} className="fw-bold text-dark text-decoration-none me-2">
                                {post.author.username}
                            </Link>
                            {/* Tag Người tổ chức */}
                            {isCreator && (
                                <Badge pill bg="info" text="dark" className="me-2" style={{ fontSize: '0.7em' }}>
                                    Người tổ chức
                                </Badge>
                            )}
                        </div>
                        <small className="text-muted">{formatTimeAgo(post.createdAt)}</small>
                    </div>
                    {/* TODO: Thêm nút options (...) cho bài viết (xóa, sửa...) */}
                </div>
                {/* Nội dung bài viết */}
                <div className="post-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>
                {/* TODO: Thêm phần tương tác (Like, Reply) cho bài viết */}
                {/* <div className="post-actions mt-2 d-flex gap-2"> ... </div> */}
            </Card.Body>
        </Card>
    );
};

export default EventPostItem;