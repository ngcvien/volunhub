// frontend/src/types/participation.types.ts
import { BasicUser } from './event.types'; // Sử dụng lại BasicUser từ event.types

// Enum cho trạng thái hoàn thành (phải khớp với backend)
export enum CompletionStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    ABSENT = 'absent'
}

// Kiểu dữ liệu chi tiết của người tham gia cho trang quản lý
export interface ParticipantDetail {
    userId: number; // ID của người tham gia
    eventId: number; // ID của sự kiện
    completionStatus: CompletionStatus; // Trạng thái hoàn thành
    createdAt: string; // Thời gian đăng ký tham gia (ISO String)
    // Thông tin user được include vào
    user: BasicUser; // Lấy từ BasicUser hoặc định nghĩa lại các trường cần (id, username, avatarUrl)
}

// Kiểu dữ liệu cho response API lấy danh sách người tham gia
export interface GetParticipantsResponse {
    message: string;
    participants: ParticipantDetail[]; // Mảng các người tham gia
}

// Kiểu dữ liệu cho response API xác nhận hoàn thành
export interface ConfirmParticipantResponse {
    message: string;
    // Có thể trả về bản ghi participation đã cập nhật nếu cần
    // participation: ParticipationAttributes;
}