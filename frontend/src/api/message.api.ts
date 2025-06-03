// frontend/src/api/message.api.ts
import api from './index';
// Import các kiểu dữ liệu từ types (sẽ tạo/cập nhật ở Bước 2)
import { MessageType as MessageData, GetMessagesResponse, CreateMessageResponse, MessageInputData,MessageTypeEnum } from '../types/chat.types';
// import { MessageType as MessageContentTypeEnum } from '../models/Message.model'; 


/**
 * Gửi một tin nhắn mới vào cuộc trò chuyện.
 * @param conversationId ID của cuộc trò chuyện
 * @param messageData Dữ liệu tin nhắn { content, messageType?, mediaUrl? }
 */
export const sendMessageApi = async (conversationId: number | string, messageData: MessageInputData): Promise<CreateMessageResponse> => {
    try {
        // POST /api/conversations/:conversationId/messages
        const response = await api.post<CreateMessageResponse>(`/conversations/${conversationId}/messages`, messageData);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Send Message (convId: ${conversationId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể gửi tin nhắn.');
    }
};

/**
 * Lấy danh sách tin nhắn của một cuộc trò chuyện (có phân trang).
 * @param conversationId ID cuộc trò chuyện
 * @param page Trang muốn lấy
 * @param limit Số lượng tin nhắn mỗi trang
 */
export const getMessagesForConversationApi = async (
    conversationId: number | string,
    page: number = 1,
    limit: number = 20
): Promise<GetMessagesResponse> => {
    try {
        // GET /api/conversations/:conversationId/messages?page=...&limit=...
        const response = await api.get<GetMessagesResponse>(`/conversations/${conversationId}/messages`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Get Messages (convId: ${conversationId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải tin nhắn.');
    }
};