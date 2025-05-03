// backend/src/routes/admin.routes.ts
import { Router } from 'express';
import userController from '../controllers/user.controller'; // Dùng UserController
import authenticateToken from '../middlewares/auth.middleware'; // Middleware xác thực user
import isAdmin from '../middlewares/admin.middleware'; // Middleware kiểm tra quyền Admin
import { updateUserStatusValidator } from '../middlewares/validation.middleware'; // Middleware validate

const router = Router();

// Tất cả các route trong file này đều yêu cầu đăng nhập VÀ phải là Admin
router.use(authenticateToken, isAdmin);

// --- User Management Routes by Admin ---

// GET /api/admin/users - Lấy danh sách tất cả user
router.get('/users', userController.listUsers);

// PUT /api/admin/users/:userId/status - Cập nhật trạng thái (role, verified, active) của user
router.put(
    '/users/:userId/status',
    updateUserStatusValidator, // Validate dữ liệu gửi lên
    userController.updateUserStatus
);

// TODO: Thêm các route Admin khác sau này (quản lý event, post...)

export default router;