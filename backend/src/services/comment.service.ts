// backend/src/services/comment.service.ts
import EventPostComment, { EventPostCommentAttributes } from '../models/EventPostComment.model';
import EventPost from '../models/EventPost.model';
import User from '../models/User.model';

// Kiểu dữ liệu đầu vào khi tạo comment
type CreateCommentInput = Pick<EventPostCommentAttributes, 'content' | 'parentId'>; // parentId là optional

class CommentService {

    /**
     * Tạo một bình luận mới cho bài viết
     * @param userId ID người bình luận
     * @param postId ID bài viết được bình luận
     * @param data Dữ liệu bình luận (content, parentId?)
     * @returns Bình luận mới được tạo (kèm thông tin author)
     */
    async createComment(userId: number, postId: number, data: CreateCommentInput): Promise<EventPostComment> {
        // 1. Kiểm tra bài viết (EventPost) có tồn tại không
        const post = await EventPost.findByPk(postId);
        if (!post) {
            throw Object.assign(new Error('Bài viết không tồn tại.'), { statusCode: 404 });
        }

        // 2. (Tùy chọn) Kiểm tra comment cha (parentId) có tồn tại và thuộc cùng postId không (nếu đang trả lời)
        if (data.parentId) {
            const parent = await EventPostComment.findOne({
                where: { id: data.parentId, postId: postId } // Đảm bảo comment cha thuộc đúng bài viết
            });
            if (!parent) {
                throw Object.assign(new Error('Bình luận cha không hợp lệ.'), { statusCode: 400 });
            }
        } else {
             // Đảm bảo parentId là null nếu không được cung cấp hoặc là chuỗi rỗng
             data.parentId = null;
        }

        // 3. Tạo bình luận mới
        try {
            const newComment = await EventPostComment.create({
                userId: userId,
                postId: postId,
                content: data.content,
                parentId: data.parentId // Có thể là null
            });

            // Lấy lại bình luận vừa tạo kèm thông tin author để trả về
            return await EventPostComment.findByPk(newComment.id, {
                include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatarUrl'] }]
            }) as EventPostComment;

        } catch (error: any) {
            console.error("Lỗi khi tạo bình luận:", error);
             if (error.name === 'SequelizeValidationError') {
                 throw Object.assign(new Error(`Validation Error: ${error.message}`), { statusCode: 400 });
             }
            throw new Error('Không thể tạo bình luận vào lúc này.');
        }
    }

    /**
     * Lấy danh sách các bình luận gốc (không phải trả lời) cho một bài viết
     * @param postId ID của bài viết
     * @returns Danh sách bình luận gốc kèm thông tin author
     */
    async getCommentsByPostId(postId: number): Promise<EventPostComment[]> {
         // Kiểm tra bài viết tồn tại trước khi lấy comment (tùy chọn)
        const post = await EventPost.findByPk(postId);
        if (!post) {
            throw Object.assign(new Error('Bài viết không tồn tại.'), { statusCode: 404 });
        }

        try {
            // Chỉ lấy các comment gốc (parentId = null)
            // Sắp xếp theo thời gian cũ nhất trước (để hiển thị đúng thứ tự)
            // Có thể thêm include để lấy replies nếu muốn làm nested phức tạp hơn
            return await EventPostComment.findAll({
                where: {
                    postId: postId,
                    parentId: null // Chỉ lấy comment gốc
                },
                include: [{
                    model: User,
                    as: 'author',
                    attributes: ['id', 'username', 'avatarUrl']
                }],
                order: [['createdAt', 'ASC']] // Comment cũ hơn hiển thị trước
                // TODO: Thêm logic phân trang (limit, offset) sau này
                // TODO: Thêm logic include replies nếu muốn hiển thị nested comments
            });
        } catch (error) {
            console.error(`Lỗi khi lấy bình luận cho bài viết ${postId}:`, error);
            throw new Error('Không thể lấy danh sách bình luận.');
        }
    }

     // TODO: Thêm các hàm khác: getReplies(commentId), updateComment, deleteComment...
}

export default new CommentService();