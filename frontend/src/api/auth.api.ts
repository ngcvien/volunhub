import api from './index';
import { User, LoginUserInput, RegisterUserInput, AuthContextType } from '../types/user.types';


export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    VERIFIED_ORG = 'verified_org'
}
interface GetMeResponse {
    user: User; 
}

interface GetUserProfileResponse {
    user: User; 
}

export const getMeApi = async (): Promise<GetMeResponse> => {
    try {
        // Request GET đến /api/users/me
        // Token được tự động thêm bởi interceptor đã cấu hình trong api/index.ts
        const response = await api.get<GetMeResponse>('/users/me');
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Get Me:", error.response?.data || error.message);
        // Ném lỗi để AuthContext xử lý (ví dụ: logout nếu lỗi 401/403)
        throw error;
    }
};
// --- Giữ lại các interface và hàm registerUserApi từ trước ---
interface RegisterUserInput {
    username?: string;
    email?: string;
    password?: string;
}
interface UserResponse {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt: string;
    updatedAt: string;
}
interface RegisterResponse {
    message: string;
    user: UserResponse;
}

export const registerUserApi = async (userData: RegisterUserInput): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>('/users/register', userData);
    return response.data;
  } catch (error: any) {
    console.error("Lỗi API Đăng ký:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
  }
};

interface LoginUserInput {
    email?: string;
    password?: string;
}

// Giả sử API login trả về token và thông tin user
interface LoginResponse {
    message: string;
    token: string;
    user: UserResponse;
}

export const loginUserApi = async (userData: LoginUserInput): Promise<LoginResponse> => {
    try {
        const response = await api.post<LoginResponse>('/users/login', userData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Đăng nhập:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
    }
};

interface ProfileUpdateInput {
    username?: string | null; // Có thể cho phép đổi username
    fullName?: string | null;
    bio?: string | null;
    location?: string | null; // Sẽ là tên Tỉnh/TP
    avatarUrl?: string | null;
}

// Kiểu dữ liệu response trả về user đã cập nhật
interface UpdateProfileResponse {
    message: string;
    user: User; // Giả sử API trả về thông tin user mới nhất
}

export const updateProfileApi = async (updateData: ProfileUpdateInput): Promise<UpdateProfileResponse> => {
    try {
        // Request PUT đến /api/users/me
        // Token được tự động thêm bởi interceptor
        const response = await api.put<UpdateProfileResponse>('/users/me', updateData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Cập nhật Profile:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể cập nhật hồ sơ.');
    }
};
/**
 * Lấy thông tin profile công khai của người dùng theo ID
 * @param userId ID của người dùng cần lấy thông tin
 * @returns Promise chứa thông tin profile người dùng
 */
export const getUserProfileApi = async (userId: string | number): Promise<GetUserProfileResponse> => {
    try {
        // Request GET đến /api/users/:userId
        // API này là public, không cần token, nhưng interceptor sẽ tự thêm nếu có cũng không sao
        const response = await api.get<GetUserProfileResponse>(`/users/${userId}`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Get User Profile (ID: ${userId}):`, error.response?.data || error.message);
        // Ném lỗi để component xử lý (ví dụ: hiển thị trang 404 Not Found)
        if (error.response?.status === 404) {
             throw new Error('Không tìm thấy người dùng.');
        }
        throw new Error(error.response?.data?.message || 'Không thể tải hồ sơ người dùng.');
    }
};