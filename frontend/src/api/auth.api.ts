import api from './index';

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