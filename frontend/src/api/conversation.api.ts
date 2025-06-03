// frontend/src/api/conversation.api.ts
import api from './index';
// Import các kiểu dữ liệu từ types (sẽ tạo/cập nhật ở Bước 2)
import { ConversationListItem, GetUserConversationsResponse } from '../types/chat.types';

/**
 * Bắt đầu hoặc lấy một cuộc trò chuyện riêng tư đã có với người dùng khác.
 * @param recipientId ID của người dùng muốn bắt đầu chat
 */
export const findOrCreatePrivateConversationApi = async (recipientId: number): Promise<ConversationListItem> => {
    try {
        // POST /api/conversations
        // Body: { recipientId }
        const response = await api.post<{ conversation: ConversationListItem }>('/conversations', { recipientId });
        return response.data.conversation;
    } catch (error: any) {
        console.error(`Lỗi API Find/Create Private Conversation (recipient: ${recipientId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể bắt đầu cuộc trò chuyện.');
    }
};

/**
 * Lấy danh sách các cuộc trò chuyện của người dùng hiện tại.
 */
export const getUserConversationsApi = async (): Promise<GetUserConversationsResponse> => {
    try {
        // GET /api/conversations
        const response = await api.get<GetUserConversationsResponse>('/conversations');
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Get User Conversations:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách cuộc trò chuyện.');
    }
};