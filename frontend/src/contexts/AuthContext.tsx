import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { registerUserApi } from '../api/auth.api'; // Đổi tên hàm gọi API
import { User, RegisterUserInput, AuthContextType } from '../types/user.types'; // Import types

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken')); // Lấy token từ localStorage khi load
  const [isLoading, setIsLoading] = useState<boolean>(true); // Mặc định là true để kiểm tra auth

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

  // Hàm login (sẽ hoàn thiện sau)
  const login = (newToken: string, userData: User) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
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

  const value = { user, token, isLoading, login, logout, register };

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