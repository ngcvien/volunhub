// backend/src/middlewares/validation.middleware.ts
import { check, validationResult, body } from 'express-validator';
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

export const eventValidator = [
    check('title', 'Tiêu đề không được để trống').notEmpty().trim(),
    check('description', 'Mô tả nên là một chuỗi').optional().isString(), // optional() cho phép null/undefined
    check('location', 'Địa điểm nên là một chuỗi').optional().isString(),
    check('eventTime', 'Thời gian sự kiện không hợp lệ').notEmpty().isISO8601().toDate(), 
    check('imageUrl', 'Image URL không hợp lệ').optional({ checkFalsy: true }).isURL(), // optional({ checkFalsy: true }) cho phép null, undefined, ""

    handleValidationErrors
]; 
// Thêm các validator khác ở đây sau (ví dụ: eventValidator)