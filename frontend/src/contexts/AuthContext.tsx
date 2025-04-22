import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { registerUserApi, loginUserApi } from '../api/auth.api'; // Đổi tên hàm gọi API
import { User, RegisterUserInput, AuthContextType } from '../api/user.types'; // Import types


// Interface cho LoginUserInput (nếu chưa có trong types)
interface LoginUserInput {
  email?: string;
  password?: string;
}

export interface AuthContextType extends BaseAuthContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Hàm lấy theme ban đầu: ưu tiên localStorage, sau đó đến system preference, mặc định là light
const getInitialTheme = (): 'light' | 'dark' => {
  const storedTheme = localStorage.getItem('appTheme') as 'light' | 'dark' | null;
  if (storedTheme) {
      return storedTheme;
  }
  
  return 'dark';
};


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken')); // Lấy token từ localStorage khi load
  const [isLoading, setIsLoading] = useState<boolean>(true); // Mặc định là true để kiểm tra auth
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);


  useEffect(() => {
    // Áp dụng theme lên thẻ <html>
    document.documentElement.setAttribute('data-bs-theme', theme);
    // Lưu theme vào localStorage
    localStorage.setItem('appTheme', theme);
  }, [theme]);
  // Effect kiểm tra trạng thái đăng nhập khi ứng dụng tải lần đầu
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          // TODO: Gọi API backend để xác thực token và lấy thông tin user
          // Ví dụ: const userData = await verifyTokenApi(token);
          // setUser(userData);
          // Tạm thời chỉ giả lập là có user nếu có token
          // setUser({ id: 1, username: 'tempUser', email: 'temp@example.com' }); // Xóa dòng này sau khi có API verify
        } catch (error) {
          // Token không hợp lệ -> logout
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false); // Hoàn tất kiểm tra
    };
    verifyToken();
  }, [token]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  // Hàm login (sẽ hoàn thiện sau)
  const login = async (loginData: LoginUserInput) => {
    try {
        console.log('Attempting login with:', loginData); // Log để debug
        const response = await loginUserApi(loginData); // Gọi API đăng nhập
        console.log('Login API Response:', response); // Log để debug

        if (response.token && response.user) {
            localStorage.setItem('authToken', response.token); // Lưu token vào localStorage
            setToken(response.token); // Cập nhật token state

            // Cập nhật user state (đảm bảo đúng kiểu User)
            const userData: User = {
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                createdAt: response.user.createdAt,
                updatedAt: response.user.updatedAt
            };
            setUser(userData);
            console.log('User state updated:', userData); // Log để debug
        } else {
            // Trường hợp API thành công nhưng không trả về đủ dữ liệu
            throw new Error('Phản hồi đăng nhập không hợp lệ từ server.');
        }
    } catch (error) {
        console.error("Lỗi trong AuthContext login:", error);
        logout(); // Đảm bảo đã logout (xóa token cũ nếu có) khi login thất bại
        throw error; // Ném lỗi ra để LoginPage có thể bắt và hiển thị
    }
};

  // Hàm logout (sẽ hoàn thiện sau)
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    // Có thể thêm điều hướng về trang login ở đây
  };

  // Hàm xử lý đăng ký
  const register = async (userData: RegisterUserInput) => {
    try {
      // Không cần setIsLoading ở đây vì component sẽ tự quản lý loading của form
      const response = await registerUserApi(userData); // Gọi hàm API đã đổi tên
      console.log('Đăng ký thành công:', response.message);
      // Lưu ý: API đăng ký hiện tại chưa trả về token để tự động đăng nhập
      // Có thể chuyển hướng người dùng đến trang đăng nhập sau khi thành công
    } catch (error) {
      console.error("Lỗi trong AuthContext register:", error);
      throw error; // Ném lỗi ra để component xử lý hiển thị UI
    }
  };

  const value = { user, token, isLoading, login, logout, register, theme, toggleTheme };

  // Chỉ render children khi đã kiểm tra xong trạng thái auth ban đầu
  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading Application...</div> : children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};