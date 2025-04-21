import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
// import { validationResult } from 'express-validator'; // Dùng sau khi thêm validation middleware

class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    // // Bước kiểm tra validation (sẽ thêm sau với express-validator)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào cơ bản (có thể bỏ nếu dùng express-validator)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đủ username, email, và password.' });
    }

    try {
      const newUser = await userService.registerUser({ username, email, password });

      // **QUAN TRỌNG**: Không bao giờ trả về password_hash cho client
      const userResponse = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      res.status(201).json({ message: 'Đăng ký thành công!', user: userResponse });
    } catch (error) {
      // Chuyển lỗi đến middleware xử lý lỗi tập trung
      next(error);
    }
  }

  // Hàm login controller sẽ thêm sau
}

export default new UserController();