import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import User from '../models/User.model';

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
  async login(req: Request, res: Response, next: NextFunction) {

    const { email, password } = req.body;

    try {
      const { token, user } = await userService.loginUser({ email, password });
      res.status(200).json({
        message: 'Đăng nhập thành công!',
        token,
        user
      });
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    // Dữ liệu cần cập nhật lấy từ body (đã qua optional validation)
    const updateData = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Yêu cầu xác thực không thành công.' });
    }

    // Loại bỏ các trường không mong muốn hoặc null/undefined nếu cần thiết
    // Ví dụ: không cho phép đổi email qua đây
    delete updateData.email;
    delete updateData.password;
    // Có thể lọc thêm các key không hợp lệ khác

    try {
        const updatedUser = await userService.updateUserProfile(userId, updateData);
        res.status(200).json({ message: 'Cập nhật hồ sơ thành công!', user: updatedUser });
    } catch (error) {
        next(error);
    }
  }
  async getMe(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng được xác thực.' });
    }
    try {
        // Tìm user trong DB bằng ID lấy từ token
        const user = await User.findByPk(userId, {
            // Lấy cả các trường profile mới, loại bỏ password_hash
            attributes: ['id', 'username', 'email', 'fullName', 'bio', 'location', 'avatarUrl', 'createdAt', 'updatedAt']
        });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại.' });
        }
        // Trả về thông tin user tìm được
        res.status(200).json({ user }); // Trả về object chứa key "user"
    } catch(error) {
        next(error);
    }
  }
}

export default new UserController();