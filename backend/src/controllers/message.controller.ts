// backend/src/controllers/message.controller.ts
import { Request, Response, NextFunction } from 'express';
import messageService from '../services/message.service';
import { MessageType } from '../models/Message.model'; // Import Enum

class MessageController {
    /**
     * Gửi một tin nhắn mới vào cuộc trò chuyện
     */
    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const senderId = req.user?.userId;
            const conversationId = parseInt(req.params.conversationId, 10);
            const { content, messageType, mediaUrl } = req.body;

            if (!senderId) {
                return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            }
            // conversationId và content đã được validate bởi middleware

            const messageData = {
                content: content || '', // Đảm bảo content là string, service sẽ check nếu là text
                messageType: messageType || MessageType.TEXT,
                mediaUrl: mediaUrl || null
            };

            const newMessage = await messageService.createMessage(senderId, conversationId, messageData);
            // TODO: Sau khi gửi, có thể cần phát sự kiện qua WebSocket cho người nhận
            res.status(201).json({ message: 'Gửi tin nhắn thành công!', message: newMessage });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách tin nhắn của một cuộc trò chuyện (có phân trang)
     */
    async getMessages(req: Request, res: Response, next: NextFunction) {
        try {
            const conversationId = parseInt(req.params.conversationId, 10);
            // conversationId đã được validate bởi middleware
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20; // Mặc định 20 tin nhắn/trang

            const result = await messageService.getMessagesForConversation(conversationId, page, limit);
            res.status(200).json({ message: 'Lấy tin nhắn thành công.', ...result });
        } catch (error) {
            next(error);
        }
    }
}

export default new MessageController();