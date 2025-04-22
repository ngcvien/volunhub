// backend/src/middlewares/validation.middleware.ts
import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Hàm xử lý lỗi validation chung (có thể tạo file riêng nếu muốn)
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validator cho đăng ký (có thể đã có)
export const registerValidator = [
    check('username', 'Tên đăng nhập không được để trống').notEmpty(),
    check('email', 'Email không hợp lệ').isEmail(),
    check('password', 'Mật khẩu phải có ít nhất 6 ký tự').isLength({ min: 6 }),
    handleValidationErrors // Áp dụng hàm xử lý lỗi
];

// --- THÊM VALIDATOR CHO ĐĂNG NHẬP ---
export const loginValidator = [
    check('email', 'Email không hợp lệ').isEmail(),
    check('password', 'Mật khẩu không được để trống').notEmpty(),
    handleValidationErrors // Áp dụng hàm xử lý lỗi
];

// Thêm các validator khác ở đây sau (ví dụ: eventValidator)