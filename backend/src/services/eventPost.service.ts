// backend/src/services/eventPost.service.ts
import EventPost, { EventPostAttributes } from '../models/EventPost.model';
import Event from '../models/Event.model';
import User from '../models/User.model';

type CreatePostInput = Omit<EventPostAttributes, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'event'>;

class EventPostService {
    async createPost(postData: CreatePostInput): Promise<EventPost> {
        // Kiểm tra sự kiện có tồn tại không
        const event = await Event.findByPk(postData.eventId);
        if (!event) {
            throw Object.assign(new Error('Sự kiện không tồn tại để đăng bài.'), { statusCode: 404 });
        }
        // TODO: Thêm logic kiểm tra quyền đăng bài (vd: chỉ người tham gia hoặc người tạo?)
        // Hiện tại cho phép mọi user đã đăng nhập đăng vào mọi event (cần sửa!)

        try {
            const newPost = await EventPost.create(postData);
            // Lấy lại post với thông tin author để trả về
            return await EventPost.findByPk(newPost.id, {
                include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl'] }]
            }) as EventPost; // Cast vì findByPk có thể trả về null nếu có lỗi cực hiếm
        } catch (error: any) {
            console.error("Lỗi khi tạo Event Post:", error);
            if (error.name === 'SequelizeValidationError') {
                throw Object.assign(new Error(`Validation Error: ${error.message}`), { statusCode: 400 });
            }
            throw new Error('Không thể tạo bài viết vào lúc này.');
        }
    }

    async getPostsForEvent(eventId: number): Promise<EventPost[]> {
        // Kiểm tra sự kiện tồn tại
         const event = await Event.findByPk(eventId);
         if (!event) {
             throw Object.assign(new Error('Sự kiện không tồn tại.'), { statusCode: 404 });
         }

        try {
            return await EventPost.findAll({
                where: { eventId: eventId },
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatarUrl'] // Lấy thông tin người đăng
                }],
                order: [['createdAt', 'DESC']] // Sắp xếp bài mới nhất lên đầu
            });
        } catch (error) {
            console.error(`Lỗi khi lấy bài viết cho sự kiện ${eventId}:`, error);
            throw new Error('Không thể lấy danh sách bài viết.');
        }
    }
}

export default new EventPostService();