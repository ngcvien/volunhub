// backend/src/services/upload.service.ts
import cloudinary from '../config/cloudinary.config'; // Import instance cloudinary đã cấu hình
import streamifier from 'streamifier'; // Thư viện giúp tạo stream từ buffer

// Kiểu dữ liệu trả về từ Cloudinary (có thể chỉ lấy url)
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    resource_type: 'image' | 'video';
    // Thêm các trường khác nếu cần: format, width, height, duration...
}

class UploadService {

    /**
     * Upload file buffer lên Cloudinary
     * @param fileBuffer Buffer dữ liệu của file (từ req.file.buffer)
     * @param options Các tùy chọn cho Cloudinary (vd: folder, public_id)
     */
    async uploadToCloudinary(fileBuffer: Buffer, options: object = {}): Promise<CloudinaryUploadResult> {
        return new Promise((resolve, reject) => {
            // Dùng upload_stream để upload từ buffer
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto', // Tự động nhận diện loại file (image/video)
                    // folder: 'volunhub_uploads', // Tùy chọn: Lưu vào folder cụ thể trên Cloudinary
                    ...options // Các tùy chọn khác nếu có
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        return reject(new Error('Lỗi khi tải file lên dịch vụ lưu trữ.'));
                    }
                    if (result) {
                         console.log('Cloudinary Upload Result:', result.resource_type, result.secure_url);
                        resolve({
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                            resource_type: result.resource_type as 'image' | 'video'
                        });
                    } else {
                         reject(new Error('Không nhận được kết quả từ dịch vụ lưu trữ.'));
                    }
                }
            );

            // Đưa buffer vào stream để upload
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    }
}

export default new UploadService();