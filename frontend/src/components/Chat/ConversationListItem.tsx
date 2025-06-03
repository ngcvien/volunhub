// frontend/src/components/Chat/ConversationListItem.tsx
import React from 'react';
import { ListGroup, Image as RBImage, Badge } from 'react-bootstrap';
import { ConversationListItem as ConversationListItemType } from '../../types/chat.types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const defaultAvatar = '/default-avatar.png';

interface ConversationListItemProps {
    conversation: ConversationListItemType;
    isActive: boolean; // Cuộc trò chuyện này có đang được chọn không
    onClick: () => void; // Hàm xử lý khi nhấp vào
}

const formatLastActivity = (isoString: string): string => {
    try { return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi }); }
    catch (e) { return "không rõ"; }
};

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isActive, onClick }) => {
    const { user: currentUser } = useAuth();

    // Xác định thông tin người tham gia còn lại (trong chat private)
    let displayName = "Cuộc trò chuyện nhóm"; // Mặc định cho chat nhóm (sẽ làm sau)
    let displayAvatar = defaultAvatar; // Ảnh mặc định cho nhóm

    if (conversation.type === 'private' && conversation.participants) {
        const otherParticipant = conversation.participants.find(p => p.id !== currentUser?.id);
        if (otherParticipant) {
            displayName = otherParticipant.fullName || otherParticipant.username;
            displayAvatar = otherParticipant.avatarUrl || defaultAvatar;
        } else {
            // Trường hợp lạ: chat private nhưng không tìm thấy người còn lại (có thể là chat với chính mình?)
            displayName = currentUser?.username || "Không rõ";
            displayAvatar = currentUser?.avatarUrl || defaultAvatar;
        }
    }
    // TODO: Xử lý hiển thị tên/ảnh cho group chat sau

    // TODO: Hiển thị tin nhắn cuối cùng (nếu có) và unread count
    const lastMessageSnippet = conversation.lastMessage ?
        (conversation.lastMessage.messageType === 'text' ?
            conversation.lastMessage.content.substring(0, 30) + (conversation.lastMessage.content.length > 30 ? '...' : '')
            : `[${conversation.lastMessage.messageType}]`)
        : 'Chưa có tin nhắn nào';
    // const unreadCount = conversation.unreadCount || 0;

    return (
        <ListGroup.Item
            action // Làm cho item có thể click được
            active={isActive}
            onClick={onClick}
            className="conversation-list-item d-flex justify-content-between align-items-start py-3 px-2"
        >
            <div className="d-flex align-items-center">
                <RBImage
                    src={displayAvatar}
                    alt={displayName}
                    roundedCircle
                    width={48}
                    height={48}
                    className="me-3"
                    style={{ objectFit: 'cover' }}
                />
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{displayName}</div>
                    {/* <small className="text-muted text-truncate" style={{maxWidth: '150px'}}>
                        {lastMessageSnippet}
                    </small> */}
                </div>
            </div>
            <div className="text-end">
                <small className="text-muted" style={{ fontSize: '0.75em' }}>
                    {formatLastActivity(conversation.updatedAt)}
                </small>
                {/* {unreadCount > 0 && (
                    <Badge bg="danger" pill className="ms-2">
                        {unreadCount}
                    </Badge>
                )} */}
            </div>
        </ListGroup.Item>
    );
};

export default ConversationListItem;