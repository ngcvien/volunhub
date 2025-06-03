// backend/src/controllers/conversation.controller.ts
import { Request, Response, NextFunction } from 'express';
import conversationService from '../services/conversation.service';

class ConversationController {
    /**
     * Bắt đầu hoặc lấy một cuộc trò chuyện riêng tư đã có
     */
    async startOrGetPrivateConversation(req: Request, res: Response, next: NextFunction) {
        try {
            const userId1 = req.user?.userId; // Từ authenticateToken
            const { recipientId } = req.body;  // ID của người muốn chat cùng

            if (!userId1) {
                return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            }
            // recipientId đã được validate bởi middleware

            const conversation = await conversationService.findOrCreatePrivateConversation(userId1, Number(recipientId));
            res.status(200).json({ message: 'Lấy hoặc tạo cuộc trò chuyện thành công.', conversation });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Lấy danh sách các cuộc trò chuyện của người dùng hiện tại
     */
    async listUserConversations(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            }

            const conversations = await conversationService.getUserConversations(userId);
            res.status(200).json({ message: 'Lấy danh sách cuộc trò chuyện thành công.', conversations });
        } catch (error) {
            next(error);
        }
    }
}

export default new ConversationController(); 