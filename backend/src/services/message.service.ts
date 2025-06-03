// backend/src/services/message.service.ts
import Message, { MessageAttributes, MessageType } from '../models/Message.model';
import User from '../models/User.model';
import Conversation from '../models/Conversation.model';
import ConversationParticipant from '../models/ConversationParticipant.model';
import { sequelize } from '../config/database.config';
import { Transaction } from 'sequelize';
import { io } from '../index';

type CreateMessageInput = Pick<MessageAttributes, 'content' | 'messageType' | 'mediaUrl'>;

class MessageService {

    /**
     * Tạo một tin nhắn mới trong một cuộc trò chuyện.
     * @param senderId ID người gửi
     * @param conversationId ID cuộc trò chuyện
     * @param data Dữ liệu tin nhắn (content, messageType, mediaUrl?)
     * @returns Tin nhắn mới được tạo kèm thông tin người gửi
     */
    async createMessage(
        senderId: number,
        conversationId: number,
        data: CreateMessageInput
    ): Promise<Message> {
        const transaction = await sequelize.transaction();
        try {
            // 1. Kiểm tra cuộc trò chuyện có tồn tại không
            const conversation = await Conversation.findByPk(conversationId, { transaction });
            if (!conversation) {
                throw Object.assign(new Error('Cuộc trò chuyện không tồn tại.'), { statusCode: 404 });
            }

            // 2. Kiểm tra người gửi có phải là thành viên của cuộc trò chuyện không
            const participant = await ConversationParticipant.findOne({
                where: { userId: senderId, conversationId: conversationId },
                transaction
            });
            if (!participant) {
                throw Object.assign(new Error('Bạn không phải là thành viên của cuộc trò chuyện này.'), { statusCode: 403 });
            }

            // 3. Tạo tin nhắn
            const newMessageData: any = { // Any để dễ gán
                senderId,
                conversationId,
                content: data.content, // Sẽ là null nếu là tin nhắn media và content rỗng
                messageType: data.messageType || MessageType.TEXT, // Mặc định là text
                mediaUrl: data.mediaUrl || null
            };
            if (newMessageData.messageType !== MessageType.TEXT && !newMessageData.mediaUrl) {
                throw Object.assign(new Error('Tin nhắn media phải có mediaUrl.'), { statusCode: 400 });
            }
            if (newMessageData.messageType === MessageType.TEXT && !newMessageData.content?.trim() && !newMessageData.mediaUrl) {
                throw Object.assign(new Error('Nội dung tin nhắn không được rỗng.'), { statusCode: 400 });
            }


            const newMessage = await Message.create(newMessageData, { transaction });

            // 4. Cập nhật trường updatedAt của Conversation để đánh dấu có hoạt động mới
            // Điều này giúp sắp xếp cuộc trò chuyện theo thời gian gần nhất
            conversation.changed('updatedAt', true); // Đánh dấu trường này đã thay đổi
            await conversation.save({ transaction }); // Lưu lại, Sequelize sẽ tự cập nhật updatedAt

            await transaction.commit();

            // Lấy lại tin nhắn kèm thông tin sender để trả về
            const messageWithSender = await Message.findByPk(newMessage.id, {
                include: [{ model: User, as: 'sender', attributes: ['id', 'username', 'avatarUrl', 'fullName'] }]
            });

            if (messageWithSender) {
                // --- PHÁT TIN NHẮN QUA SOCKET.IO ---
                const roomName = `conversation_${conversationId}`;
                io.to(roomName).emit('new_message', messageWithSender.get({ plain: true })); 
                console.log(`SOCKET: Emitted 'new_message' to room ${roomName}`);
                // --- KẾT THÚC PHÁT TIN NHẮN ---
                return messageWithSender;
            }
            // Trường hợp hiếm: không tìm thấy message vừa tạo
            throw new Error('Không thể lấy lại tin nhắn vừa tạo.');

        } catch (error: any) {
            await transaction.rollback();
            console.error("Lỗi khi tạo tin nhắn:", error);
            if (error.name === 'SequelizeValidationError') {
                throw Object.assign(new Error(`Validation Error: ${error.message}`), { statusCode: 400 });
            }
            if (error.statusCode) throw error; // Giữ lại statusCode nếu đã gán
            throw new Error('Không thể gửi tin nhắn vào lúc này.');
        }
    }

    /**
     * Lấy danh sách tin nhắn của một cuộc trò chuyện (có phân trang).
     * @param conversationId ID cuộc trò chuyện
     * @param page Trang hiện tại
     * @param limit Số lượng tin nhắn mỗi trang
     * @returns Danh sách tin nhắn kèm thông tin người gửi
     */
    async getMessagesForConversation(
        conversationId: number,
        page: number = 1,
        limit: number = 20 // Ví dụ: 20 tin nhắn/trang
    ): Promise<{ messages: Message[], totalPages: number, currentPage: number, totalMessages: number }> {
        try {
            const offset = (page - 1) * limit;

            const { count, rows } = await Message.findAndCountAll({
                where: { conversationId },
                include: [{
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatarUrl']
                }],
                order: [['createdAt', 'DESC']], // Tin nhắn mới nhất lên đầu (tùy cách hiển thị)
                limit,
                offset,
                distinct: true
            });

            const totalMessages = count;
            const totalPages = Math.ceil(totalMessages / limit);

            // Đảo ngược lại để hiển thị đúng thứ tự (cũ nhất -> mới nhất) nếu cần
            // Hoặc frontend sẽ tự sắp xếp
            // const sortedMessages = rows.reverse();

            return {
                messages: rows, // Hoặc sortedMessages
                totalPages,
                currentPage: page,
                totalMessages
            };

        } catch (error) {
            console.error(`Lỗi khi lấy tin nhắn cho cuộc trò chuyện ${conversationId}:`, error);
            throw new Error('Không thể tải tin nhắn.');
        }
    }
}

export default new MessageService();