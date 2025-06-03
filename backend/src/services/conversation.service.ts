// backend/src/services/conversation.service.ts
import { Op, Transaction } from 'sequelize';
import { sequelize } from '../config/database.config';
import Conversation, { ConversationType, ConversationListItem } from '../models/Conversation.model';
import ConversationParticipant from '../models/ConversationParticipant.model';
import User from '../models/User.model';
import Message from '../models/Message.model'; // Sẽ dùng để lấy lastMessage sau

class ConversationService {

    /**
     * Tìm hoặc tạo một cuộc trò chuyện riêng tư (1-1) giữa hai người dùng.
     * @param userId1 ID của người dùng thứ nhất (thường là người đang đăng nhập)
     * @param userId2 ID của người dùng thứ hai
     * @returns Conversation object
     */
    async findOrCreatePrivateConversation(userId1: number, userId2: number): Promise<Conversation> {
        if (userId1 === userId2) {
            throw Object.assign(new Error('Không thể tạo cuộc trò chuyện với chính mình.'), { statusCode: 400 });
        }

        // Sắp xếp ID để đảm bảo tính duy nhất của cặp (user1, user2) bất kể thứ tự
        const u1 = Math.min(userId1, userId2);
        const u2 = Math.max(userId1, userId2);

        const transaction = await sequelize.transaction();
        try {
            // Tìm các cuộc trò chuyện 'private' mà cả hai user này đều tham gia
            const existingConversations = await Conversation.findAll({
                where: { type: ConversationType.PRIVATE },
                include: [{
                    model: User,
                    as: 'participants',
                    attributes: ['id'], // Chỉ cần ID để kiểm tra
                    through: { attributes: [] }, // Không cần dữ liệu từ bảng nối
                    where: { id: { [Op.in]: [u1, u2] } }
                }],
                transaction
            });

            // Lọc ra cuộc trò chuyện CHỈ có 2 người này
            let conversation = existingConversations.find(conv =>
                conv.participants && conv.participants.length === 2 &&
                conv.participants.every(p => p.id === u1 || p.id === u2)
            );

            if (!conversation) {
                // Nếu không tìm thấy, tạo cuộc trò chuyện mới
                conversation = await Conversation.create({
                    type: ConversationType.PRIVATE
                }, { transaction });

                // Thêm cả hai người dùng vào cuộc trò chuyện
                await ConversationParticipant.bulkCreate([
                    { conversationId: conversation.id, userId: u1 },
                    { conversationId: conversation.id, userId: u2 }
                ], { transaction });
            }

            await transaction.commit();

            // Lấy lại conversation với thông tin participants đầy đủ hơn để trả về
            return Conversation.findByPk(conversation.id, {
                include: [{
                    model: User,
                    as: 'participants',
                    attributes: ['id', 'username', 'avatarUrl', 'fullName'] // Các trường công khai
                }]
            }) as Promise<Conversation>;

        } catch (error) {
            await transaction.rollback();
            console.error("Lỗi khi tìm hoặc tạo private conversation:", error);
            throw new Error('Không thể bắt đầu cuộc trò chuyện.');
        }
    }

    /**
     * Lấy danh sách các cuộc trò chuyện của một người dùng.
     * @param userId ID của người dùng
     * @returns Danh sách các cuộc trò chuyện, kèm theo thông tin người tham gia khác và tin nhắn cuối cùng (TODO)
     */
    async getUserConversations(userId: number): Promise<Conversation[]> {
        try {
            const conversations = await Conversation.findAll({
                include: [
                    {
                        model: ConversationParticipant, // Include bảng nối
                        as: 'conversationParticipants', // Cần định nghĩa alias này trong associations
                        where: { userId: userId },    // Lọc theo userId
                        attributes: []                // Không cần lấy trường nào từ bảng nối ở đây
                    },
                    {
                        model: User,                  // Lấy thông tin của TẤT CẢ participants
                        as: 'participants',
                        attributes: ['id', 'username', 'avatarUrl', 'fullName'], // Các trường công khai
                        through: { attributes: [] }
                    },
                    // TODO: Thêm logic để lấy tin nhắn cuối cùng (lastMessage)
                    // và sắp xếp cuộc trò chuyện theo thời gian tin nhắn cuối cùng
                    // Điều này thường phức tạp và có thể cần subquery hoặc query riêng
                    // Ví dụ:
                    // {
                    //     model: Message,
                    //     as: 'messages',
                    //     limit: 1,
                    //     order: [['createdAt', 'DESC']],
                    //     attributes: ['id', 'content', 'senderId', 'createdAt', 'messageType']
                    // }
                ],
                order: [['updatedAt', 'DESC']] // Sắp xếp theo lần cập nhật cuối (khi có tin nhắn mới)
            });

            // Xử lý thêm để mỗi conversation có thông tin 'otherParticipant' cho chat private
            // và có thể là lastMessage nếu đã query ở trên
            const results: ConversationListItem[] = conversations.map(convInstance => {
                // Lấy plain object, cast sang kiểu ConversationListItem
                const conv = convInstance.get({ plain: true }) as ConversationListItem;

                // Gán lại participants với kiểu BasicUserForChat (nếu cần thiết, hoặc đảm bảo include trả về đúng kiểu)
                // conv.participants = convInstance.participants?.map(p => p.get({ plain: true })) as BasicUserForChat[];

                if (conv.type === ConversationType.PRIVATE && conv.participants) {
                    conv.otherParticipant = conv.participants.find(p => p.id !== userId);
                }
                // TODO: Xử lý lastMessage nếu có
                return conv;
            });

            return results;

        } catch (error) {
            console.error(`Lỗi khi lấy danh sách cuộc trò chuyện cho user ${userId}:`, error);
            throw new Error('Không thể tải danh sách cuộc trò chuyện.');
        }
    }
}

export default new ConversationService();