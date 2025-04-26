import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

const optionalAuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = { userId: decoded.userId };
        }
    }
    // Không có token hoặc token lỗi thì bỏ qua, không trả lỗi
    next();
};

export default optionalAuthenticateToken;