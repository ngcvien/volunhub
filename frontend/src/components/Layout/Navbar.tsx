"use client"
import React, { useState, useEffect } from 'react';
import { Navbar as BsNavbar, Nav, Container, Button, Image, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Person, BoxArrowRight, Gear, PlusCircle, Collection } from 'react-bootstrap-icons';
import UserPopup from '../User/UserPopup';
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <BsNavbar 
      expand="lg" 
      fixed="top"
      className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
    >
      <Container fluid className="px-4">
        {/* Logo and Brand */}
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {/* <Image
            src="/logo.png"
            width="40"
            height="40"
            className="d-inline-block align-top me-2"
            alt="VolunHub Logo"
          /> */}
          <span className="brand-text">VolunHub</span>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          {/* Main Navigation */}
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
            >
              Trang chủ
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/events" 
              className={`nav-link-custom ${isActive('/events') ? 'active' : ''}`}
            >
              Sự kiện
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/about" 
              className={`nav-link-custom ${isActive('/about') ? 'active' : ''}`}
            >
              Giới thiệu
            </Nav.Link>
          </Nav>

          {/* Right-side items */}
          <Nav className="align-items-center">
            {user ? (
              <div className="d-flex right gap-2">
                {/* Create Event Button */}
                <Nav.Link 
                  as={Link} 
                  to="/events/new"
                  className="me-3"
                >
                  <Button variant="primary" className="create-event-btn">
                    <PlusCircle className="me-1" />
                    Tạo sự kiện
                </Button>
                </Nav.Link>
                {/* Dashboard Link */}
                <Nav.Link 
                  as={Link} 
                  to="/dashboard/my-events"
                  className="nav-icon-link me-3"
                  title="Bảng điều khiển"
                >
                  <Collection size={20} />
                </Nav.Link>
                {/* Notifications */}
                <div className="nav-icon-link me-3 position-relative">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
              </div>

                {/* Theme Toggle */}
                {/* Xóa đoạn này
                <div className="me-3">
                  <ThemeToggle />
                </div>
                */}

                {/* User Menu */}
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    as="div" 
                    className="user-dropdown-toggle"
                    // onClick={() => setShowUserPopup(!showUserPopup)}
                  >
                    <Image
                      src={user.avatarUrl || '/default-avatar.png'}
                      width="35"
                      height="35"
                      roundedCircle
                      className="user-avatar"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-custom">
                    <div className="px-3 py-2 mb-2">
                      <div className="fw-bold">{user.username}</div>
                      <div className="text-muted small">{user.email}</div>
                    </div>
                    <Dropdown.Divider />
                    
                    <Dropdown.Item as={Link} to="/profile/me">
                      <Person className="me-2" /> Hồ sơ
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      <Gear className="me-2" /> Cài đặt
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <BoxArrowRight className="me-2" /> Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : (
              // Login/Register buttons for non-authenticated users
              <div className="d-flex gap-2">
                
                <Button 
                  variant="primary" 
                  as={Link} 
                  to="/auth"
                  className="auth-btn"
                >
                  Đăng nhập / Đăng ký
                </Button>
              </div>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};
export default Navbar;
