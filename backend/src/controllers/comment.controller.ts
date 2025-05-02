// backend/src/controllers/comment.controller.ts
import { Request, Response, NextFunction } from 'express';
import commentService from '../services/comment.service';

class CommentController {

    // Tạo comment mới hoặc trả lời comment
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId, 10); // Lấy từ URL param của route cha (/posts/:postId)
            const userId = req.user?.userId;                // Lấy từ middleware xác thực
            const { content, parentId, image_url } = req.body;         // Lấy từ request body

            if (!userId) return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            if (isNaN(postId)) return res.status(400).json({ message: 'Post ID không hợp lệ.' });
             // Validation middleware đã kiểm tra content

            // parentId là optional
            const parentCommentId = parentId ? parseInt(parentId, 10) : null;
            if (parentId && isNaN(parentCommentId as number)) {
                return res.status(400).json({ message: 'Parent Comment ID không hợp lệ.' });
            }

            const newComment = await commentService.createComment(userId, postId, { content, parentId: parentCommentId || null, imageUrl: image_url || null });
            res.status(201).json({ message: 'Đăng bình luận thành công!', comment: newComment });

        } catch (error) {
            next(error);
        }
    }

    // Lấy danh sách comment gốc cho một bài viết
    async getForPost(req: Request, res: Response, next: NextFunction) {
        try {
            const postId = parseInt(req.params.postId, 10); // Lấy từ URL param
            if (isNaN(postId)) return res.status(400).json({ message: 'Post ID không hợp lệ.' });

            const comments = await commentService.getCommentsByPostId(postId);
            res.status(200).json({ message: 'Lấy danh sách bình luận thành công!', comments });

        } catch (error) {
            next(error);
        }
    }

    // TODO: Thêm các hàm khác: getReplies, update, delete...
}

export default new CommentController();