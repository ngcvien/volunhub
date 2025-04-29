// backend/src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from 'express';
import User, { UserRole } from '../models/User.model'; // Import User model và Enum Role

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Middleware này giả định authenticateToken đã chạy trước và gắn req.user
        const userId = req.user?.userId;

        if (!userId) {
            // Nếu không có thông tin user, coi như chưa xác thực đúng
            return res.status(401).json({ message: 'Yêu cầu xác thực không hợp lệ.' });
        }

        // Tìm user trong DB để lấy vai trò chính xác
        const user = await User.findByPk(userId);

        // Nếu không tìm thấy user trong DB (dù có token?) hoặc role không phải ADMIN
        if (!user || user.role !== UserRole.ADMIN) {
             // Dùng 403 Forbidden vì user đã xác thực nhưng không có quyền admin
            return res.status(403).json({ message: 'Forbidden: Yêu cầu quyền Admin.' });
        }

        // Nếu là Admin, cho phép đi tiếp
        next();

    } catch (error) {
        next(error); // Chuyển lỗi bất ngờ cho error middleware
    }
};

export default isAdmin;