// frontend/src/api/admin.api.ts
import api from './index';
import { User } from '../types/user.types';

interface GetAllUsersResponse {
    message: string;
    users: User[]; // API trả về danh sách User đầy đủ (trừ password hash)
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