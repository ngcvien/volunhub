// backend/src/routes/event.routes.ts
import { Router } from 'express';
import eventController from '../controllers/event.controller';
import authenticateToken from '../middlewares/auth.middleware'; // Middleware xác thực
import { eventValidator } from '../middlewares/validation.middleware'; // Middleware validate

const router = Router();

// --- Định nghĩa route TẠO SỰ KIỆN MỚI ---
// POST /api/events/
router.post(
    '/',
    authenticateToken, // 1. Yêu cầu xác thực token JWT
    eventValidator,    // 2. Validate dữ liệu input
    eventController.create // 3. Gọi controller xử lý
);

// Thêm các route khác cho event sau (GET / , GET /:id ...)

export default router;