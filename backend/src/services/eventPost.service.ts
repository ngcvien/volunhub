// backend/src/services/eventPost.service.ts
import EventPost, { EventPostAttributes } from '../models/EventPost.model';
import Event from '../models/Event.model';
import User from '../models/User.model';
import EventPostComment from '../models/EventPostComment.model';
import { Op } from 'sequelize'; 


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
            // Lấy tất cả các post của event
            const posts = await EventPost.findAll({
                where: { eventId: eventId },
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatarUrl']
                }],
                order: [['createdAt', 'DESC']]
            });

            // Lấy danh sách postId
            const postIds = posts.map(post => post.id);

            // Đếm số comment gốc cho mỗi post (parentId = null)
            const commentCounts = await EventPostComment.findAll({
                attributes: [
                    'postId',
                    [EventPostComment.sequelize!.fn('COUNT', EventPostComment.sequelize!.col('id')), 'count']
                ],
                where: {
                    postId: { [Op.in]: postIds },
                    parentId: null // chỉ đếm comment gốc
                },
                group: ['postId'],
                raw: true
            });

            // Tạo map { postId: count }
            const commentCountMap = new Map<number, number>();
            commentCounts.forEach((item: any) => {
                commentCountMap.set(item.postId, parseInt(item.count, 10) || 0);
            });

            // Gắn commentCount vào từng post
            return posts.map(post => {
                const plain = post.get({ plain: true });
                return {
                    ...plain,
                    commentCount: commentCountMap.get(post.id) || 0
                };
            });
        } catch (error) {
            console.error(`Lỗi khi lấy bài viết cho sự kiện ${eventId}:`, error);
            throw new Error('Không thể lấy danh sách bài viết.');
        }
    }
}

export default new EventPostService();