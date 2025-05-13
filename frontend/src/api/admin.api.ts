// frontend/src/api/admin.api.ts
import api from './index';
import { User, UserRole } from '../types/user.types';
import { EventType } from '../types/event.types';

interface GetAllUsersResponse {
    message: string;
    users: User[]; 
}

interface UpdateUserStatusInput {
    role?: string; // 'user', 'admin', 'verified_org'
    isVerified?: boolean;
    isActive?: boolean;
}

interface UpdateUserStatusResponse {
    message: string;
    user: User; // Trả về user đã cập nhật
}

/**
 * Admin: Lấy danh sách tất cả người dùng
 */
export const adminGetAllUsersApi = async (): Promise<GetAllUsersResponse> => {
    try {
        // GET /api/admin/users (Token được interceptor thêm vào)
        const response = await api.get<GetAllUsersResponse>('/admin/users');
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Admin Get Users:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy danh sách người dùng.');
    }
};

/**
 * Admin: Cập nhật trạng thái (role, verified, active) của người dùng
 * @param targetUserId ID của user cần cập nhật
 * @param statusData Dữ liệu trạng thái mới
 */
export const adminUpdateUserStatusApi = async (targetUserId: number | string, statusData: UpdateUserStatusInput): Promise<UpdateUserStatusResponse> => {
    try {
        // PUT /api/admin/users/:userId/status (Token được interceptor thêm vào)
        const response = await api.put<UpdateUserStatusResponse>(`/admin/users/${targetUserId}/status`, statusData);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Admin Update User Status (ID: ${targetUserId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể cập nhật trạng thái người dùng.');
    }
};

// Kiểu dữ liệu cho response lấy danh sách sự kiện chờ duyệt
interface GetPendingEventsResponse {
    message: string;
    events: EventType[]; // API trả về mảng các EventType
    totalPages?: number; // Thêm nếu API có phân trang
    currentPage?: number;
    totalEvents?: number;
}

// Kiểu dữ liệu cho response khi duyệt/từ chối sự kiện
interface UpdateEventStatusResponse {
    message: string;
    event: EventType; // API trả về sự kiện đã cập nhật
}

/**
 * Admin: Lấy danh sách các sự kiện đang chờ duyệt
 */
export const adminGetPendingEventsApi = async (page: number = 1, limit: number = 10): Promise<GetPendingEventsResponse> => {
    try {
        // GET /api/admin/events/pending-approval?page=...&limit=...
        // Token được interceptor thêm vào
        const response = await api.get<GetPendingEventsResponse>(`/admin/events/pending-approval`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Admin Get Pending Events:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách sự kiện chờ duyệt.');
    }
};

/**
 * Admin: Duyệt (Approve) một sự kiện
 * @param eventId ID của sự kiện cần duyệt
 */
export const adminApproveEventApi = async (eventId: number | string): Promise<UpdateEventStatusResponse> => {
    try {
        // PUT /api/admin/events/:eventId/approve
        const response = await api.put<UpdateEventStatusResponse>(`/admin/events/${eventId}/approve`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Admin Approve Event (ID: ${eventId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể duyệt sự kiện.');
    }
};

/**
 * Admin: Từ chối (Reject) một sự kiện
 * @param eventId ID của sự kiện cần từ chối
 */
export const adminRejectEventApi = async (eventId: number | string): Promise<UpdateEventStatusResponse> => {
    try {
        // PUT /api/admin/events/:eventId/reject
        const response = await api.put<UpdateEventStatusResponse>(`/admin/events/${eventId}/reject`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Admin Reject Event (ID: ${eventId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể từ chối sự kiện.');
    }
};