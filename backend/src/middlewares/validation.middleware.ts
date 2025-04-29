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

export const updateProfileValidator = [
    // Các trường đều là optional vì user có thể chỉ muốn cập nhật 1 vài thông tin
    check('username', 'Tên đăng nhập phải là chuỗi').optional().isString().trim().notEmpty().withMessage('Tên đăng nhập không được trống'),
    check('fullName', 'Tên đầy đủ phải là chuỗi').optional({ checkFalsy: true }).isString().trim(), // checkFalsy cho phép gửi "" để xóa
    check('bio', 'Tiểu sử phải là chuỗi').optional({ checkFalsy: true }).isString().trim(),
    check('location', 'Địa điểm phải là chuỗi').optional({ checkFalsy: true }).isString().trim(),
    check('avatarUrl', 'Avatar URL không hợp lệ').optional({ checkFalsy: true }).isURL(),
    // Không validate email, password ở đây
    handleValidationErrors
];

export const eventPostValidator = [
    check('content', 'Nội dung bài viết không được để trống').notEmpty().trim().isLength({ min: 1 }).withMessage('Nội dung phải có ít nhất 1 ký tự'),
    handleValidationErrors
];

export const commentValidator = [
    check('content', 'Nội dung bình luận không được để trống').trim().isLength({ min: 1 }),
    // parentId là optional, kiểm tra xem nó có phải là số không nếu được cung cấp
    body('parentId')
    .optional({ nullable: true }) // Vẫn cho phép null hoặc không tồn tại
    .if((value) => value !== null && value !== undefined) // Chỉ chạy validation tiếp theo NẾU giá trị không phải null/undefined
    .isInt({ min: 1 }).withMessage('Parent Comment ID phải là một số nguyên dương.'),

    handleValidationErrors
];
// Thêm các validator khác ở đây sau (ví dụ: eventValidator)