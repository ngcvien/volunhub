// frontend/src/types/user.types.ts

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    VERIFIED_ORG = 'verified_org'
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: string; 
    updatedAt?: string;
    avatarUrl?: string | null; 
    bio?: string | null;
    fullName?: string | null; 
    location?: string | null;
    volunpoints?: number;
}

export interface RegisterUserInput {
    username?: string;
    email?: string;
    password?: string;
}

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