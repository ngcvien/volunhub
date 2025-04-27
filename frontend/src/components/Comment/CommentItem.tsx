// frontend/src/components/Comment/CommentItem.tsx
import React from 'react';
import { Image as RBImage, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EventPostCommentType } from '../../types/comment.types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const defaultAvatar = '/default-avatar.png';

interface CommentItemProps {
    comment: EventPostCommentType;
    onReply?: (commentId: number) => void; // Callback để mở form trả lời
}

const formatTimeAgo = (isoString: string): string => {
    try { return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi }); }
    catch(e) { return isoString; }
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
    return (
        <div className="d-flex mb-3 comment-item">
            {/* Avatar */}
            <Link to={`/profile/${comment.author.id}`} className="flex-shrink-0 me-2">
                <RBImage
                    src={comment.author.avatarUrl || defaultAvatar}
                    alt={comment.author.username}
                    roundedCircle
                    width={32}
                    height={32}
                    style={{ objectFit: 'cover' }}
                />
            </Link>
            {/* Nội dung comment */}
            <div className="flex-grow-1 comment-content p-2 rounded" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
                <div>
                    <Link to={`/profile/${comment.author.id}`} className="fw-bold text-body text-decoration-none me-2" style={{ fontSize: '0.9em' }}>
                        {comment.author.username}
                    </Link>
                    <span className="text-muted" style={{ fontSize: '0.8em' }}>
                        {formatTimeAgo(comment.createdAt)}
                    </span>
                </div>
                <div style={{ fontSize: '0.95em', whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                </div>
                {/* TODO: Thêm nút Like và nút Reply */}
                <div className="comment-actions mt-1">
                    <Button variant="link" size="sm" className="text-muted p-0 me-2" style={{fontSize: '0.8em'}}>Thích</Button>
                    <Button variant="link" size="sm" className="text-muted p-0" style={{fontSize: '0.8em'}} onClick={() => onReply?.(comment.id)}>Trả lời</Button>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;