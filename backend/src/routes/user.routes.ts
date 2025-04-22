// backend/src/routes/user.routes.ts
import { Router } from 'express';
import userController from '../controllers/user.controller';
import { registerValidator, loginValidator } from '../middlewares/validation.middleware'; // Import thêm loginValidator

const router = Router();

// Route đăng ký (giữ nguyên)
router.post(
  '/register',
  registerValidator, // Dùng validator đăng ký
  userController.register
);

// --- THÊM ROUTE ĐĂNG NHẬP ---
router.post(
  '/login',
  loginValidator, // Dùng validator đăng nhập
  userController.login // Gọi đến hàm login trong controller
);
// --- KẾT THÚC THÊM ROUTE ---

export default router;