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


router.get(
    '/',
    optionalAuthenticateToken, 
    eventController.getAll
);

router.post('/', authenticateToken, eventValidator, eventController.create);

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

router.get(
    '/:eventId/participants/manage',
    authenticateToken, // Yêu cầu đăng nhập
    participationController.getParticipantsForManagement 
);

export default router;