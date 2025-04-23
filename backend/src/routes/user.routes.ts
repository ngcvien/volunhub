// backend/src/routes/user.routes.ts
import { Router, Request, Response, NextFunction } from 'express'; // Thêm Request, Response, NextFunction nếu chưa có
import userController from '../controllers/user.controller';
import { registerValidator, loginValidator } from '../middlewares/validation.middleware';
import authenticateToken from '../middlewares/auth.middleware'; // <<<--- Import middleware xác thực
import User from '../models/User.model'; // Import User model

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
// --- THÊM HOẶC ĐẢM BẢO CÓ ROUTE NÀY ---
// GET /api/users/me - Lấy thông tin user đang đăng nhập
router.get(
  '/me',
  authenticateToken, // Bắt buộc phải xác thực
  // Controller Handler (có thể đặt trong userController.ts)
  async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.userId; // Lấy userId từ middleware
      if (!userId) {
          // Middleware đã xử lý lỗi 401/403 nhưng phòng trường hợp lạ
          return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng được xác thực.' });
      }
      try {
          // Tìm user trong DB bằng ID lấy từ token
          const user = await User.findByPk(userId, {
              // Chỉ lấy các thuộc tính cần thiết, loại bỏ password_hash
              attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
          });
          if (!user) {
              // User có trong token nhưng không có trong DB? -> Lỗi hoặc user đã bị xóa
               return res.status(404).json({ message: 'Người dùng không tồn tại.' });
          }
          // Trả về thông tin user tìm được
          res.status(200).json({ user }); // Trả về object chứa key "user"
      } catch(error) {
          next(error); // Chuyển lỗi cho middleware chung
      }
  }
);
// --- KẾT THÚC THÊM ROUTE ---

// --- THÊM ROUTE TEST /me ---
// Route này sẽ được bảo vệ bởi authenticateToken
// {router.get(
//   '/me', // Endpoint: GET /api/users/me
//   authenticateToken, // <<<--- Áp dụng middleware ở đây
//   (req: Request, res: Response, next: NextFunction) => {
//       // Controller handler đơn giản để test
//       // Nếu middleware authenticateToken chạy thành công, req.user sẽ tồn tại
//       if (!req.user) {
//           // Trường hợp này không nên xảy ra nếu authenticateToken hoạt động đúng
//           return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng sau khi xác thực.' });
//       }
//       // Trả về thông tin user đã được middleware gắn vào
//       res.status(200).json({
//           message: 'Lấy thông tin user thành công!',
//           user: req.user // req.user chứa { userId: ... }
//       });
//   }
// );}
export default router;