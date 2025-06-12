import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import UserManagement from '../components/Admin/UserManagement';
import EventManagement from '../components/Admin/EventManagement';
import ReportManagement from '../components/Admin/ReportManagement';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const location = useLocation();

    return (
        <Container fluid className="admin-dashboard">
            <Row>
                <Col md={3} lg={2} className="sidebar">
                    <h3 className="mb-4">Admin Dashboard</h3>
                    <Nav className="flex-column">
                        <Nav.Link
                            as={Link}
                            to="/admin/users"
                            className={location.pathname === '/admin/users' ? 'active' : ''}
                        >
                            Quản lý người dùng
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/admin/events"
                            className={location.pathname === '/admin/events' ? 'active' : ''}
                        >
                            Quản lý sự kiện
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/admin/reports"
                            className={location.pathname === '/admin/reports' ? 'active' : ''}
                        >
                            Quản lý báo cáo
                        </Nav.Link>
                    </Nav>
                </Col>
                <Col md={9} lg={10} className="content">
                    <Routes>
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/events" element={<EventManagement />} />
                        <Route path="/reports" element={<ReportManagement />} />
                        <Route path="/" element={<UserManagement />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard; 