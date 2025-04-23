// frontend/src/types/user.types.ts

// Kiểu dữ liệu cho thông tin User cơ bản trả về từ API (không chứa thông tin nhạy cảm)
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt?: string; // Backend trả về dạng chuỗi ISO date qua JSON
    updatedAt?: string;
    avatarUrl?: string | null; // URL của ảnh đại diện (nếu có)
    bio?: string | null; // Tiểu sử (nếu có)
    fullName?: string | null; // Tên đầy đủ (nếu có)
    location?: string | null; // Địa điểm (nếu có)
}

// Kiểu dữ liệu cho đầu vào của form/API đăng ký
export interface RegisterUserInput {
    username?: string; // Dùng optional (?) để dễ xử lý validation từng field
    email?: string;
    password?: string;
}

// Kiểu dữ liệu cho đầu vào của form/API đăng nhập
export interface LoginUserInput {
    email?: string;
    password?: string;
}

// Kiểu dữ liệu cho giá trị của AuthContext (bao gồm cả theme và hàm toggle)
// Interface này định nghĩa mọi thứ mà AuthProvider cung cấp
export interface AuthContextType {
    user: User | null;                         
    token: string | null;                       
    isLoading: boolean;                         // Trạng thái đang kiểm tra auth ban đầu
    theme: 'light' | 'dark';                  // Theme hiện tại
    login: (loginData: LoginUserInput) => Promise<void>; // Hàm đăng nhập
    logout: () => void;                         // Hàm đăng xuất
    register: (registerData: RegisterUserInput) => Promise<void>; // Hàm đăng ký
    toggleTheme: () => void;                    // Hàm chuyển đổi theme
    updateUserContext: (newUserData: User) => void;
}