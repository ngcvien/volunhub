// backend/src/utils/jwt.util.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserAttributes } from '../models/User.model'; // Import UserAttributes nếu bạn muốn payload chứa thông tin user

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // Mặc định 7 ngày nếu không có trong .env

if (!JWT_SECRET) {
    console.error("Lỗi: JWT_SECRET_KEY chưa được định nghĩa trong file .env");
    process.exit(1);
}

// Hàm tạo token
// Payload thường chứa thông tin định danh user (ví dụ: id)
export const signToken = (payload: { userId: number; email: string }): string => {
    return jwt.sign(payload, JWT_SECRET!, {
        expiresIn: JWT_EXPIRES_IN
    });
};

// Hàm xác thực token (sẽ dùng cho middleware xác thực sau này)
// export const verifyToken = (token: string): any | null => {
//     try {
//         return jwt.verify(token, JWT_SECRET!);
//     } catch (error) {
//         console.error('Lỗi xác thực token:', error);
//         return null;
//     }
// };