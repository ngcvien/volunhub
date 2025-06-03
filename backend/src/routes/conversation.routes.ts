// backend/src/routes/conversation.routes.ts
import { Router } from 'express';
import authenticateToken from '../middlewares/auth.middleware';
import { startConversationValidator, sendMessageValidator, conversationIdParamValidator } from '../middlewares/validation.middleware';
import conversationController from '../controllers/conversation.controller';
import messageController from '../controllers/message.controller';

const router = Router();

// --- Conversation Routes ---
// POST /api/conversations - Bắt đầu/Lấy cuộc trò chuyện riêng tư
router.post(
    '/',
    authenticateToken,
    startConversationValidator,
    conversationController.startOrGetPrivateConversation
);

// GET /api/conversations - Lấy danh sách cuộc trò chuyện của người dùng
router.get(
    '/',
    authenticateToken,
    conversationController.listUserConversations
);


// --- Message Routes (lồng trong conversation) ---
// POST /api/conversations/:conversationId/messages - Gửi tin nhắn
router.post(
    '/:conversationId/messages',
    authenticateToken,
    conversationIdParamValidator, // Validate conversationId từ param trước
    sendMessageValidator,         // Rồi validate body
    messageController.sendMessage
);

// GET /api/conversations/:conversationId/messages - Lấy tin nhắn của cuộc trò chuyện
router.get(
    '/:conversationId/messages',
    authenticateToken, // Thường thì cần xác thực để xem tin nhắn
    conversationIdParamValidator,
    messageController.getMessages
);

export default router;