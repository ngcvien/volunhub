// backend/src/routes/post.routes.ts
import { Router } from 'express';
import commentController from '../controllers/comment.controller'; // Import comment controller
import authenticateToken from '../middlewares/auth.middleware'; // Import auth middleware
import { commentValidator } from '../middlewares/validation.middleware'; // Import comment validator

const router = Router();

// Lưu ý: Các route này sẽ được mount với tiền tố /api/posts (xem bước 4.5)

// --- Comment Routes for a specific Post ---

// GET /api/posts/:postId/comments - Lấy danh sách comment gốc của bài viết
router.get(
    '/:postId/comments',
    commentController.getForPost
);

// POST /api/posts/:postId/comments - Tạo comment mới cho bài viết
router.post(
    '/:postId/comments',
    authenticateToken,  // Yêu cầu đăng nhập
    commentValidator,   // Validate nội dung comment
    commentController.create
);

// TODO: Thêm các route khác liên quan đến post sau này (GET /:postId, DELETE /:postId, ...)

export default router;