"use client"

import type { JSX } from "react"
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Route, Routes, Navigate } from "react-router-dom"
import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage" // Tạo file này sau
import RegisterPage from "../pages/RegisterPage" // File sẽ tạo ở bước 8
import CreateEventPage from "../pages/CreateEventPage"
import AppNavbar from "../components/Layout/Navbar" // File sẽ tạo ở bước 9
import { useAuth } from "../contexts/AuthContext"
import { Container } from "react-bootstrap" // Import Container
import ProfilePage from "../pages/ProfilePage"
import UserProfilePage from "../pages/UserProfilePage"

// Component để bảo vệ route, yêu cầu đăng nhập
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading } = useAuth()

  if (isLoading) {
    return <div>Kiểm tra quyền truy cập...</div> // Hoặc một spinner đẹp hơn
  }

  return token ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    // --- BỎ Thẻ <Router> Ở ĐÂY, dùng Fragment <>...</> hoặc <div>...</div> ---
    <>
      <AppNavbar /> {/* Navbar vẫn ở đây */}
      <Container fluid className="mt-4 px-0">
        <Routes>
          {/* Các Route vẫn giữ nguyên */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          {/* --- THÊM ROUTE TẠO SỰ KIỆN (ĐƯỢC BẢO VỆ) --- */}
          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div className="text-center mt-5">
                <h2>404 Not Found</h2>
              </div>
            }
          />
          <Route
            path="/profile/me"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </Container>
    </>
  )
}

export default AppRoutes
