// backend/src/routes/event.routes.ts
import { Router } from 'express';
import eventController from '../controllers/event.controller';
import participationController from '../controllers/participation.controller';
import authenticateToken from '../middlewares/auth.middleware'; // Đảm bảo đã import
import optionalAuthenticateToken from '../middlewares/optionalAuth.middleware'; // Đảm bảo đã import
import likeController from '../controllers/like.controller'; // Import controller cho like
import eventPostController from '../controllers/eventPost.controller';
import { eventValidator, eventPostValidator } from '../middlewares/validation.middleware';
import userController from '../controllers/user.controller';


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

router.get(
    '/:eventId',
    optionalAuthenticateToken,
    eventController.getById
);

router.get(
    '/:eventId/posts',
    // Có thể public hoặc private tùy yêu cầu
    eventPostController.getPostsForEvent
);

router.post(
    '/:eventId/posts',
    authenticateToken,   // Yêu cầu đăng nhập
    eventPostValidator,  // Validate nội dung
    eventPostController.createPost
);

router.post(
    '/:eventId/participants/:participantUserId/confirm',
    authenticateToken,          
    participationController.confirmParticipant
);


export default router;