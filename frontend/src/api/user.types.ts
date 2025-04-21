// Kiểu dữ liệu User cơ bản (trả về từ API)
export interface User {
    id: number;
    username: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}

// Kiểu dữ liệu cho đầu vào form đăng ký
export interface RegisterUserInput {
     username?: string;
     email?: string;
     password?: string;
}

// Kiểu dữ liệu cho Auth Context
export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean; // Trạng thái đang kiểm tra auth ban đầu
    login: (token: string, userData: User) => void; // Hàm đăng nhập (sẽ làm sau)
    logout: () => void; // Hàm đăng xuất (sẽ làm sau)
    register: (userData: RegisterUserInput) => Promise<void>; // Hàm xử lý đăng ký
}