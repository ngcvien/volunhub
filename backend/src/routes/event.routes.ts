// backend/src/routes/event.routes.ts
import { Router } from 'express';
import eventController from '../controllers/event.controller';
import participationController from '../controllers/participation.controller';
import authenticateToken from '../middlewares/auth.middleware'; // Đảm bảo đã import
import { eventValidator } from '../middlewares/validation.middleware';
import optionalAuthenticateToken from '../middlewares/optionalAuth.middleware'; // Đảm bảo đã import
import likeController from '../controllers/like.controller'; // Import controller cho like

const router = Router();

// --- Event Routes ---

router.get(
    '/',
    optionalAuthenticateToken, // Sử dụng middleware này để cho phép người dùng không đăng nhập cũng có thể xem sự kiện
    eventController.getAll
);

// POST /api/events/ (Tạo sự kiện - giữ nguyên private)
router.post('/', authenticateToken, eventValidator, eventController.create);

// --- Participation Routes (giữ nguyên) ---
router.post('/:eventId/join', authenticateToken, participationController.join);
router.delete('/:eventId/leave', authenticateToken, participationController.leave);

// --- THÊM LIKE ROUTES ---
// POST /api/events/:eventId/like - Thích sự kiện (Yêu cầu đăng nhập)
router.post(
    '/:eventId/like',
    authenticateToken, // Bảo vệ route
    likeController.like   // Gọi hàm like
);

// DELETE /api/events/:eventId/like - Bỏ thích sự kiện (Yêu cầu đăng nhập)
router.delete(
    '/:eventId/like',
    authenticateToken, // Bảo vệ route
    likeController.unlike // Gọi hàm unlike
);

export default router;