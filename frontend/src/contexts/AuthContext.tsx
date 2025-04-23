import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import {getMeApi , registerUserApi, loginUserApi } from '../api/auth.api'; // Đổi tên hàm gọi API
import { User, RegisterUserInput, LoginUserInput, AuthContextType as ContextType } from '../types/user.types';



// Interface cho LoginUserInput (nếu chưa có trong types)


export interface AuthContextType extends BaseAuthContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}


const AuthContext = createContext<ContextType | undefined>(undefined);


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
  // --- USEEFFECT KIỂM TRA TOKEN KHI TẢI ỨNG DỤNG ---
  useEffect(() => {
    const checkAuthStatus = async () => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
             // Đặt token state ngay lập tức nếu tìm thấy trong storage
            setToken(storedToken);
            try {
                console.log('AuthContext: Found token, verifying...');
                // Gọi API /users/me để xác thực token và lấy user data
                const response = await getMeApi();
                if (response.user) {
                    setUser(response.user); // Cập nhật user state thành công
                    console.log('AuthContext: User restored:', response.user);
                } else {
                     // Trường hợp lạ: API thành công nhưng không có user? -> Logout
                    throw new Error('Dữ liệu người dùng không hợp lệ.');
                }
            } catch (error: any) {
                // Lỗi xảy ra (token hết hạn, không hợp lệ, API /me lỗi) -> Logout
                console.error('AuthContext: Failed to verify token or fetch user:', error);
                localStorage.removeItem('authToken'); // Xóa token khỏi storage
                setToken(null);                     // Xóa token khỏi state
                setUser(null);                      // Xóa user khỏi state
            }
        }
         // Dù có token hay không, hoặc có lỗi, cũng phải kết thúc loading
        setIsLoading(false);
    };

    checkAuthStatus();
}, []);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
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
const updateUserContext = (newUserData: User) => {
  // Chỉ cập nhật state user, không động đến token hay localStorage ở đây
  setUser(newUserData);
  console.log('AuthContext: User state updated locally:', newUserData);
};
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
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

  const value: ContextType = { user, token, isLoading, login, logout, register, theme, toggleTheme, updateUserContext };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading Application...</div> : children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = (): ContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};