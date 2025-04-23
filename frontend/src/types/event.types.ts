// frontend/src/types/event.types.ts

// Import hoặc định nghĩa lại kiểu User cơ bản nếu cần
import { User } from './user.types'; // Giả sử bạn có file user.types.ts

// Kiểu dữ liệu cho thông tin người tạo rút gọn trả về từ API
interface EventCreator {
    id: number;
    username: string;
}

// Kiểu dữ liệu chính cho một sự kiện trả về từ API list events
export interface EventType {
    id: number;
    creatorId: number;
    title: string;
    description: string | null;
    location: string | null;
    eventTime: string; // API trả về dạng chuỗi ISO 8601
    createdAt: string;
    updatedAt: string;
    creator: EventCreator; // Thông tin người tạo lồng vào
    isParticipating?: boolean;
    imageUrl?: string; // URL của ảnh sự kiện (nếu có)
}

// Kiểu dữ liệu cho response từ API get all events
export interface GetAllEventsResponse {
    message: string;
    events: EventType[];
}