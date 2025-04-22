import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();

    return (
        // --- THAY ĐỔI Ở ĐÂY: Dùng fixed="top" ---
        <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect fixed="top">
            {/* Container vẫn giữ nguyên bên trong để giới hạn chiều rộng content */}
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand href="#home" className="fw-bold">VolunHub</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        {/* ... Các Nav.Link của bạn ... */}
                         <LinkContainer to="/">
                            <Nav.Link>Sự kiện</Nav.Link>
                        </LinkContainer>
                        {user ? (
                            <>
                                <Nav.Link disabled>Chào, {user.username}!</Nav.Link>
                                <Nav.Link onClick={logout} style={{ cursor: 'pointer' }}>
                                    Đăng xuất
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link>Đăng nhập</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/register">
                                    <Nav.Link>Đăng ký</Nav.Link>
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