// frontend/src/components/Chat/MessageItem.tsx
import React from 'react';
import { Image as RBImage } from 'react-bootstrap';
import { MessageType as MessageDataType, MessageTypeEnum } from '../../types/chat.types'; // Import types
import { useAuth } from '../../contexts/AuthContext'; // Để xác định tin nhắn gửi/nhận
import { Link } from 'react-router-dom'; // Để link đến profile người gửi

const defaultAvatar = '/default-avatar.png'; // Ảnh mặc định

interface MessageItemProps {
    message: MessageDataType;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const { user: currentUser } = useAuth(); // Lấy user hiện tại
    const isSentByCurrentUser = message.senderId === currentUser?.id;

    // Định dạng thời gian
    const formatMessageTime = (isoString: string): string => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } catch (e) { return ""; }
    };

    return (
        <div className={`d-flex mb-2 ${isSentByCurrentUser ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`message-bubble d-flex p-2 rounded ${isSentByCurrentUser ? 'bg-primary text-white' : 'bg-light text-dark'}`}
                 style={{ maxWidth: '75%', flexDirection: isSentByCurrentUser ? 'row-reverse' : 'row' }}> {/* Đổi chiều nếu là tin của mình */}

                {/* Avatar người gửi (nếu không phải là user hiện tại) */}
                {!isSentByCurrentUser && message.sender && (
                    <Link to={`/profile/${message.sender.id}`} className="me-2 flex-shrink-0">
                        <RBImage
                            src={message.sender.avatarUrl || defaultAvatar}
                            alt={message.sender.username}
                            roundedCircle
                            width={32} height={32}
                            style={{ objectFit: 'cover' }}
                        />
                    </Link>
                )}

                {/* Nội dung tin nhắn */}
                <div className="flex-grow-1" style={{ wordBreak: 'break-word' }}> {/* Để tin nhắn dài tự xuống dòng */}
                    {/* Hiển thị tên người gửi nếu là chat nhóm hoặc để debug */}
                    {/* {!isSentByCurrentUser && <small className="d-block text-muted" style={{fontSize:'0.7em'}}>{message.sender?.username}</small>} */}

                    {message.messageType === MessageTypeEnum.TEXT ? (
                        <p className="mb-0">{message.content}</p>
                    ) : message.messageType === MessageTypeEnum.IMAGE && message.mediaUrl ? (
                        <RBImage src={message.mediaUrl} alt="Ảnh tin nhắn" fluid className="rounded" style={{ maxHeight: '150px' }} />
                    ) : message.messageType === MessageTypeEnum.VIDEO && message.mediaUrl ? (
                        <video controls src={message.mediaUrl} style={{ maxWidth: '100%', maxHeight: '150px' }} className="rounded"></video>
                    ) : (
                        <p className="mb-0 text-muted fst-italic">[Nội dung không hỗ trợ]</p>
                    )}
                    <small className={`d-block text-end mt-1 ${isSentByCurrentUser ? 'text-light-emphasis' : 'text-muted'}`} style={{ fontSize: '0.65em' }}>
                        {formatMessageTime(message.createdAt)}
                    </small>
                </div>
            </div>
        </div>
    );
};

export default MessageItem;