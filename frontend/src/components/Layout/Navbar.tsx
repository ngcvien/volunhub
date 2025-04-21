import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // Dùng để Nav.Link hoạt động đúng với React Router
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

const AppNavbar = () => { // Đổi tên component để tránh trùng với Navbar của react-bootstrap
    const { user, logout } = useAuth(); // Lấy trạng thái user và hàm logout

    return (
        // expand="lg" để navbar tự động thu gọn trên màn hình nhỏ hơn large
        // collapseOnSelect để menu tự đóng lại khi chọn 1 mục trên mobile
        // variant="dark" bg="primary": Nền xanh chữ trắng (có thể đổi thành "light" bg="light")
        <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect sticky="top">
            <Container> {/* Bọc nội dung navbar trong Container */}
                {/* Dùng LinkContainer để Navbar.Brand hoạt động như Link của React Router */}
                <LinkContainer to="/">
                    <Navbar.Brand href="#home" className="fw-bold">VolunHub</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Nút 3 gạch trên mobile */}
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* ms-auto đẩy các mục Nav sang bên phải */}
                    <Nav className="ms-auto align-items-center">
                        <LinkContainer to="/">
                            <Nav.Link>Sự kiện</Nav.Link>
                        </LinkContainer>

                        {/* Hiển thị tùy theo trạng thái đăng nhập */}
                        {user ? (
                            <>
                                {/* TODO: Thêm Dropdown cho user menu */}
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

export default AppNavbar; // Xuất component đã đổi tên