// frontend/src/components/Layout/Navbar.tsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();

    return (
        // Bỏ variant="dark" và className="navbar-neon-gradient"
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
                                <Nav.Link onClick={logout} style={{ cursor: 'pointer' }} className="app-nav-link">
                                    Đăng xuất
                                </Nav.Link>
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