// backend/src/@types/express/index.d.ts
import { UserAttributes } from '../../models/User.model'; // Import kiểu User nếu cần

// Khai báo để mở rộng module 'express-serve-static-core' (là nơi Request được định nghĩa)
declare module 'express-serve-static-core' {
  interface Request {
    // Thêm thuộc tính user vào Request, có thể là chỉ userId hoặc cả object user đã giải mã/lấy từ DB
    user?: {
      userId: number;
      // email?: string; // Tùy chọn thêm các thông tin khác từ payload token
      // Hoặc có thể là cả object User đầy đủ nếu bạn muốn lấy từ DB trong middleware
      // decoded?: UserAttributes;
    }
  }
}

// Dòng này cần thiết nếu file của bạn không import/export gì khác để nó được coi là module augmentation
export {};  