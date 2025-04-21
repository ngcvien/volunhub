import React, { JSX } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';     // Tạo file này sau
import RegisterPage from '../pages/RegisterPage'; // File sẽ tạo ở bước 8
import AppNavbar from '../components/Layout/Navbar'; // File sẽ tạo ở bước 9
import { useAuth } from '../contexts/AuthContext';
import { Container } from 'react-bootstrap'; // Import Container

// Component để bảo vệ route, yêu cầu đăng nhập
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <div>Kiểm tra quyền truy cập...</div>; // Hoặc một spinner đẹp hơn
    }

    return token ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    // --- BỎ Thẻ <Router> Ở ĐÂY, dùng Fragment <>...</> hoặc <div>...</div> ---
    <>
      <AppNavbar /> {/* Navbar vẫn ở đây */}
      <Container className="mt-4">
        <Routes>
           {/* Các Route vẫn giữ nguyên */}
           <Route path="/login" element={<LoginPage />} />
           <Route path="/register" element={<RegisterPage />} />
           <Route path="/" element={<HomePage />} />
           <Route path="*" element={<div className="text-center mt-5"><h2>404 Not Found</h2></div>} />
        </Routes>
      </Container>
    </>
     // --- KẾT THÚC THAY ĐỔI ---
  );
};

export default AppRoutes;