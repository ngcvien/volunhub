// frontend/src/components/Layout/Navbar.tsx
import React from 'react';
import { Navbar, Nav, Container,NavDropdown, Image as RBImage } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const defaultAvatar = '/default-avatar.png';


const AppNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <Navbar expand="lg" collapseOnSelect fixed="top" data-bs-theme={null}> {/* Có thể thêm data-bs-theme={null} để reset mặc định nếu cần */}
            <Container>
                <LinkContainer to="/">
                     {/* Thêm class nếu muốn target riêng brand */}
                    <Navbar.Brand href="#home" className="fw-bold app-navbar-brand">VolunHub</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <LinkContainer to="/">
                             {/* Thêm class nếu muốn target riêng link */}
                            <Nav.Link className="app-nav-link">Sự kiện</Nav.Link>
                        </LinkContainer>
                        {user ? (
                            <>
                                <Nav.Link disabled className="app-nav-link">Chào, {user.username}!</Nav.Link>
                                
                                <NavDropdown
                                title={
                                    // Title của dropdown là Avatar và Username
                                    <>
                                        <RBImage
                                            src={user.avatarUrl || defaultAvatar}
                                            alt={user.username}
                                            roundedCircle
                                            width={30}
                                            height={30}
                                            className="me-2" // Thêm khoảng cách
                                            style={{ objectFit: 'cover' }} // Đảm bảo ảnh tròn đẹp
                                        />
                                        {/* <span className="app-nav-link">{user.username}</span>  */}
                                    </>
                                }
                                id="user-nav-dropdown"
                                align="end" // Căn dropdown sang phải
                            >
                                {/* Item Hồ sơ */}
                                <LinkContainer to="/profile/me">
                                    <NavDropdown.Item>
                                        <i className="bi bi-person-circle me-2"></i> Hồ sơ
                                    </NavDropdown.Item>
                                </LinkContainer>

                                {/* TODO: Thêm các link khác nếu cần (Cài đặt,...) */}
                                <NavDropdown.Divider />

                                {/* Item Đăng xuất */}
                                <NavDropdown.Item onClick={logout}>
                                     <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                            </>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link className="app-nav-link">Đăng nhập</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Nav.Link className="app-nav-link">Đăng ký</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;