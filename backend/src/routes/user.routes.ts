import { Router } from 'express';
import userController from '../controllers/user.controller';
// import { registerValidator } from '../middlewares/validation.middleware'; // Thêm sau

const router = Router();

// Định nghĩa route POST /api/users/register
router.post(
  '/register',
  // registerValidator, // Thêm middleware validate dữ liệu ở đây sau
  userController.register // Gọi đến hàm register trong controller
);

// Thêm route cho login sau: router.post('/login', ...);

export default router;