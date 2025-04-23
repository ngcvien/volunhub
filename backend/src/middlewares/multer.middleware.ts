// backend/src/middlewares/multer.middleware.ts
import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Cấu hình lưu trữ trong bộ nhớ
const storage = multer.memoryStorage();

// Hàm kiểm tra loại file (chỉ cho phép ảnh và video)
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true); // Chấp nhận file
    } else {
        // cb(null, false); // Từ chối file một cách lặng lẽ
        // Hoặc trả về lỗi rõ ràng
        cb(new Error('Định dạng file không được hỗ trợ! Chỉ chấp nhận ảnh hoặc video.') as any, false);
    }
};

// Giới hạn kích thước file (ví dụ: 10MB cho ảnh, 100MB cho video - điều chỉnh nếu cần)
const limits = {
    fileSize: 100 * 1024 * 1024 // 100 MB (tính bằng bytes)
};

// Tạo middleware multer với các cấu hình trên
// .single('file') nghĩa là nhận 1 file duy nhất từ field có tên là 'file' trong form-data
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Export middleware để sử dụng trong routes
// Bạn có thể tạo các middleware khác nếu cần upload nhiều file hoặc các loại file khác nhau
export const uploadSingleFile = upload.single('file'); // 'file' là tên field trong FormData gửi từ frontend