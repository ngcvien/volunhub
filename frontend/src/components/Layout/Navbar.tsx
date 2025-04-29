"use client"
import { Navbar, Nav, Container, NavDropdown, Image as RBImage, Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { useAuth } from "../../contexts/AuthContext"
import { Bell, Search, PlusCircle } from "react-bootstrap-icons"
import "./Navbar.css"

const defaultAvatar = "/default-avatar.png"

const AppNavbar = () => {
  const { user, logout, theme } = useAuth()

  return (
    <Navbar
      expand="lg"
      collapseOnSelect
      fixed="top"
      className="app-navbar shadow-sm py-2"
      variant={theme === "dark" ? "dark" : "light"}
    >
      <Container>
        {/* Logo và Brand */}
        <LinkContainer to="/">
          <Navbar.Brand className="d-flex align-items-center">
            {/* <HandHeart size={24} className="text-primary me-2" /> */}
            <span className="fw-bold brand-text">VolunHub</span>
          </Navbar.Brand>
        </LinkContainer>

        {/* Search Bar - Hiển thị trên màn hình lớn */}
        <div className="d-none d-md-flex search-container mx-auto">
          <div className="position-relative search-wrapper">
            <input type="text" className="form-control search-input" placeholder="Tìm kiếm sự kiện..." />
            <Search className="search-icon" />
          </div>
        </div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Search Bar - Hiển thị trên màn hình nhỏ */}
          <div className="d-md-none my-2 w-100">
            <div className="position-relative search-wrapper">
              <input type="text" className="form-control search-input" placeholder="Tìm kiếm sự kiện..." />
              <Search className="search-icon" />
            </div>
          </div>

          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                {/* Nút tạo sự kiện */}
                <LinkContainer to="/events/new">
                  <Nav.Link className="nav-icon-link me-2">
                    <div className="d-flex align-items-center">
                      <PlusCircle size={20} className="me-1" />
                      <span className="d-none d-lg-inline">Tạo sự kiện</span>
                    </div>
                  </Nav.Link>
                </LinkContainer>

                {/* Thông báo */}
                <Nav.Link className="nav-icon-link position-relative me-2">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </Nav.Link>

                {/* User Dropdown */}
                <NavDropdown
                  title={
                    <div className="d-flex align-items-center">
                      <RBImage
                        src={user.avatarUrl || defaultAvatar}
                        alt={user.username}
                        roundedCircle
                        width={32}
                        height={32}
                        className="nav-avatar"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="d-none d-lg-inline ms-2">@{user.username}</span>
                    </div>
                  }
                  id="user-nav-dropdown"
                  align="end"
                  className="user-dropdown"
                >
                  <LinkContainer to="/profile/me">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="bi bi-person-circle me-2"></i> Hồ sơ
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/dashboard/my-events">
                    <NavDropdown.Item>
                      <i className="bi bi-gear me-2"></i>Quản lý Sự kiện
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/settings">
                    <NavDropdown.Item className="dropdown-item-custom">
                      <i className="bi bi-gear me-2"></i> Cài đặt
                    </NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logout} className="dropdown-item-custom text-danger">
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link className="me-2">Đăng nhập</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="primary" size="sm" className="register-button">
                    Đăng ký
                  </Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
