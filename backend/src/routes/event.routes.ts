// backend/src/routes/event.routes.ts
import { Router } from 'express';
import eventController from '../controllers/event.controller';
import participationController from '../controllers/participation.controller';
import authenticateToken from '../middlewares/auth.middleware'; // Đảm bảo đã import
import { eventValidator } from '../middlewares/validation.middleware';

const router = Router();

// --- Event Routes ---

// GET /api/events/ (Lấy danh sách - TẠM THỜI yêu cầu đăng nhập để test)
router.get(
    '/',
    authenticateToken, // <<<--- THÊM MIDDLEWARE VÀO ĐÂY
    eventController.getAll
);

// POST /api/events/ (Tạo sự kiện - giữ nguyên private)
router.post('/', authenticateToken, eventValidator, eventController.create);

// --- Participation Routes (giữ nguyên) ---
router.post('/:eventId/join', authenticateToken, participationController.join);
router.delete('/:eventId/leave', authenticateToken, participationController.leave);

export default router;