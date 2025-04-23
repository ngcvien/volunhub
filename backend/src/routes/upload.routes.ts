// backend/src/routes/upload.routes.ts
import { Router } from 'express';
import uploadController from '../controllers/upload.controller';
import authenticateToken from '../middlewares/auth.middleware'; // Middleware xác thực
import { uploadSingleFile } from '../middlewares/multer.middleware'; // Middleware multer đã cấu hình

const router = Router();

// Định nghĩa route POST /api/uploads/
// Middleware chạy theo thứ tự: authenticate -> multer -> controller
router.post(
    '/', // Hoặc có thể là /image, /video nếu muốn tách bạch
    authenticateToken,     // 1. Yêu cầu đăng nhập
    uploadSingleFile,      // 2. Xử lý nhận file từ request (field tên là 'file')
    uploadController.uploadFile // 3. Controller xử lý upload lên Cloudinary
);

export default router;