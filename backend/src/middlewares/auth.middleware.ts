// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, DecodedToken } from '../utils/jwt.util'; // Import hàm verify và kiểu DecodedToken

// Middleware để xác thực người dùng bằng JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Lấy token từ header 'Authorization'
    // Định dạng thường là: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy phần token sau chữ "Bearer "

    // Nếu không có token
    if (token == null) {
        // return res.status(401).json({ message: 'Unauthorized: Token không được cung cấp.' });
        // Hoặc dùng next(error) để middleware lỗi xử lý
        const error: any = new Error('Token không được cung cấp.');
        error.statusCode = 401;
        return next(error);
    }

    // Xác thực token
    const decoded = verifyToken(token);

    // Nếu token không hợp lệ hoặc hết hạn (verifyToken trả về null)
    if (!decoded) {
        // return res.status(403).json({ message: 'Forbidden: Token không hợp lệ hoặc đã hết hạn.' });
        const error: any = new Error('Token không hợp lệ hoặc đã hết hạn.');
        error.statusCode = 403; // Forbidden hoặc 401 Unauthorized đều có thể chấp nhận
        return next(error);
    }

    // Token hợp lệ, gắn thông tin user đã giải mã vào request để các xử lý sau sử dụng
    // TypeScript bây giờ sẽ hiểu req.user nhờ vào file .d.ts đã tạo
    req.user = {
        userId: decoded.userId
        // email: decoded.email // Gắn thêm email nếu cần
    };

    // Chuyển sang middleware hoặc route handler tiếp theo
    next();
};

export default authenticateToken;