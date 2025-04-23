// backend/src/config/cloudinary.config.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Đảm bảo biến môi trường được nạp

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Sử dụng HTTPS
});

// Log để kiểm tra cấu hình (chỉ nên log cloud_name trong môi trường thực tế)
console.log(`☁️ Cloudinary configured for cloud: ${cloudinary.config().cloud_name}`);

export default cloudinary; // Export instance đã cấu hình