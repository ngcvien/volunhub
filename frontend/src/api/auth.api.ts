import api from './index';
import { User } from '../types/user.types';

// Kiểu dữ liệu cho response từ GET /api/users/me
interface GetMeResponse {
    user: User; // Backend trả về object có key là user
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

// --- THÊM HÀM LOGIN ---
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
        // Gọi đến POST /api/users/login của backend (cần tạo API này)
        const response = await api.post<LoginResponse>('/users/login', userData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Đăng nhập:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.');
    }
};