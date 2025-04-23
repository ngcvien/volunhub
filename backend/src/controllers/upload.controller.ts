// backend/src/controllers/upload.controller.ts
import { Request, Response, NextFunction } from 'express';
import uploadService from '../services/upload.service';

class UploadController {

    // Hàm xử lý upload chung (có thể tách riêng cho ảnh/video nếu cần validation khác)
    async uploadFile(req: Request, res: Response, next: NextFunction) {
        try {
            // Kiểm tra xem middleware multer đã xử lý file thành công chưa
            if (!req.file) {
                return res.status(400).json({ message: 'Không có file nào được tải lên hoặc định dạng file không hợp lệ.' });
            }

            // Lấy file buffer từ req.file (do dùng memoryStorage)
            const fileBuffer = req.file.buffer;

            // Gọi service để upload lên Cloudinary
            // Bạn có thể truyền thêm options nếu muốn (ví dụ: folder dựa trên loại file hoặc user ID)
            const result = await uploadService.uploadToCloudinary(fileBuffer);

            // Trả về URL của file đã upload thành công
            res.status(201).json({
                message: 'Tải file lên thành công!',
                url: result.secure_url, // URL an toàn (https) từ Cloudinary
                fileType: result.resource_type,
                publicId: result.public_id // ID để quản lý trên Cloudinary (nếu cần)
            });

        } catch (error) {
            next(error); // Chuyển lỗi cho error middleware
        }
    }

     // Có thể thêm các hàm upload khác với xử lý riêng (vd: uploadAvatar, uploadEventImage...)
}

export default new UploadController();