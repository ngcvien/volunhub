// backend/src/utils/jwt.util.ts
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserAttributes } from '../models/User.model'; // Import UserAttributes nếu bạn muốn payload chứa thông tin user

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY!;
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

// --- THÊM HÀM VERIFY TOKEN ---
// Payload trả về sẽ chứa các thông tin bạn đã đưa vào khi sign (userId, email)
export interface DecodedToken extends JwtPayload {
    userId: number;
    email: string;
    // Thêm các trường khác nếu bạn đã đưa vào payload khi sign
}

export const verifyToken = (token: string): DecodedToken | null => {
    try {
        // Verify token và ép kiểu kết quả về DecodedToken
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        return decoded;
    } catch (error: any) {
        // console.error('Lỗi xác thực token:', error.message); // Log lỗi nếu cần
        // Trả về null nếu token không hợp lệ hoặc hết hạn
        return null;
    }
};
// --- KẾT THÚC THÊM HÀM ---
// Hàm xác thực token (sẽ dùng cho middleware xác thực sau này)
// export const verifyToken = (token: string): any | null => {
//     try {
//         return jwt.verify(token, JWT_SECRET!);
//     } catch (error) {
//         console.error('Lỗi xác thực token:', error);
//         return null;
//     }
// };