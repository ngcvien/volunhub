// frontend/src/types/chat.types.ts
import { BasicUserForChat } from './user.types'; // Hoặc import từ user.types
// import { MessageType as MessageContentTypeEnum } from '../models/Message.model'; 

// Kiểu dữ liệu cho một item trong danh sách cuộc trò chuyện
export interface ConversationListItem {
    id: number;
    type: 'private' | 'group';
    updatedAt: string; // Dùng để sắp xếp
    participants?: BasicUserForChat[]; // Danh sách người tham gia (rút gọn)
    otherParticipant?: BasicUserForChat; // Người còn lại trong chat 1-1
    lastMessage?: MessageType; // Tin nhắn cuối cùng (sẽ thêm sau)
    // Thêm unreadCount sau
}

// Kiểu dữ liệu cho response API lấy danh sách cuộc trò chuyện
export interface GetUserConversationsResponse {
    message: string;
    conversations: ConversationListItem[];
}

export enum MessageTypeEnum {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video'
}


// Kiểu dữ liệu cho một tin nhắn
export interface MessageType {
    id: number;
    conversationId: number;
    senderId: number;
    content: string;
    messageType: MessageTypeEnum; // 'text', 'image', 'video'
    mediaUrl: string | null;
    createdAt: string; // ISO String
    sender?: BasicUserForChat; // Thông tin người gửi
}

// Kiểu dữ liệu cho response API lấy danh sách tin nhắn
export interface GetMessagesResponse {
    message: string;
    messages: MessageType[];
    totalPages: number;
    currentPage: number;
    totalMessages: number;
}

// Kiểu dữ liệu đầu vào khi gửi tin nhắn
export interface MessageInputData {
    content: string;
    messageType?: MessageTypeEnum;
    mediaUrl?: string | null;
}

// Kiểu dữ liệu response khi tạo tin nhắn thành công
export interface CreateMessageResponse {
    message: string;
    messageSent: MessageType; // Tin nhắn vừa gửi
}