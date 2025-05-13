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
import EventDetailPage from '../pages/EventDetailPage';
import AdminRoute from "../contexts/AdminRoute"
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage"
import CreatorDashboardPage from "../pages/dashboard/CreatorDashboardPage"
import AuthPage from "../pages/AuthPage"
import AboutPage from "../pages/AboutPage"
import AdminEventApprovalPage from "../pages/admin/AdminEventApprovalPage"
import NotFoundPage from "../pages/NotFoundPage"
import { Modal, Button } from "react-bootstrap"
import { useState, useEffect } from "react"

// Component để bảo vệ route, yêu cầu đăng nhập
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Kiểm tra quyền truy cập...</div>;
  }

  // Nếu chưa đăng nhập hoặc user bị khóa, redirect về /auth
  if (!token || user?.isActive === false) {
    return <Navigate to="/auth" replace state={{ reason: "locked" }} />;
  }

  return children;
};
const LockProtect = ({ children }: { children: JSX.Element }) => {
  const { token, isLoading, user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.isActive === false) {
      setShowModal(true);
    }
  }, [user]);

  if (isLoading) {
    return <div>Kiểm tra quyền truy cập...</div>;
  }

  if (user?.isActive === false) {
    return (
      <>
        <Modal show={showModal} onHide={() => {
          setShowModal(false);
          window.location.href = '/auth';
        }} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{color: 'red'}}>Tài khoản bị khóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để được hỗ trợ.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => {
              logout();
              window.location.href = '/auth';
            }}>
              Đăng xuất
            </Button>
          </Modal.Footer>
        </Modal>
        {/* <Navigate to="/auth" replace state={{ reason: "locked" }} /> */}
      </>
    );
  }

  return children;
};

const AppRoutes = () => {
  return (
    // --- BỎ Thẻ <Router> Ở ĐÂY, dùng Fragment <>...</> hoặc <div>...</div> ---
    <>
      <AppNavbar /> {/* Navbar vẫn ở đây */}
      <Container fluid className="mt-4 px-0">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={
            <LockProtect>
              <HomePage />
            </LockProtect>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/events/new"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
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
          <Route
            path="/events/:eventId"
            element={
              <ProtectedRoute>
                <EventDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-events"
            element={
              <ProtectedRoute>
                <CreatorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/approval"
            element={
              <AdminRoute>
                <AdminEventApprovalPage />
              </AdminRoute>
            }
          />
          <Route
            path="*"
            element={
              <NotFoundPage />
            }
          />
        </Routes>


      </Container>
    </>
  )
}

export default AppRoutes
