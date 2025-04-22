// backend/src/routes/event.routes.ts
import { Router } from 'express';
import eventController from '../controllers/event.controller';
import participationController from '../controllers/participation.controller'; // <<<--- IMPORT CONTROLLER MỚI
import authenticateToken from '../middlewares/auth.middleware'; // Import middleware xác thực
import { eventValidator } from '../middlewares/validation.middleware'; // Import validator event (nếu cần cho các route khác)

const router = Router();

// --- Event Routes ---
router.get('/', eventController.getAll); // Lấy danh sách sự kiện (public)
router.post('/', authenticateToken, eventValidator, eventController.create); // Tạo sự kiện (private)
// router.get('/:eventId', eventController.getById); // Route lấy chi tiết (sẽ làm sau)

// --- Participation Routes (Thêm vào đây) ---

// POST /api/events/:eventId/join - Tham gia sự kiện (Yêu cầu đăng nhập)
router.post(
    '/:eventId/join',       // Path có chứa ID của sự kiện cần tham gia
    authenticateToken,      // Bắt buộc phải xác thực token trước
    participationController.join // Gọi hàm xử lý 'join' trong participationController
);

// DELETE /api/events/:eventId/leave - Rời khỏi sự kiện (Yêu cầu đăng nhập)
router.delete(
    '/:eventId/leave',      // Path có chứa ID của sự kiện cần rời khỏi
    authenticateToken,      // Bắt buộc phải xác thực token trước
    participationController.leave // Gọi hàm xử lý 'leave' trong participationController
);
// --- Kết thúc thêm Participation Routes ---


export default router;