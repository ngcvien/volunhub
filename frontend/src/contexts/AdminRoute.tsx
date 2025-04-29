// frontend/src/routes/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'; 
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user.types'; // Import Enum Role

interface AdminRouteProps {
    children?: React.ReactNode; // Cho phép dùng <AdminRoute><Component /></AdminRoute>
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { user, isLoading, token } = useAuth();

    if (isLoading) {
        // Hiển thị loading trong khi chờ xác thực
        return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    }

    // Kiểm tra có token, có user và user có role là ADMIN không
    if (!token || !user || user.role !== UserRole.ADMIN) {
        // Nếu không phải Admin, điều hướng về trang chủ (hoặc trang báo lỗi Forbidden 403)
        console.warn('AdminRoute: Access denied. User role:', user?.role);
        return <Navigate to="/" replace />;
    }

    // Nếu là Admin, render children hoặc Outlet (nếu dùng trong cấu trúc route cha)
    return children ? <>{children}</> : <Outlet />;
};

export default AdminRoute;