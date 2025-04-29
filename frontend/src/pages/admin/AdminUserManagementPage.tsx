// frontend/src/pages/admin/AdminUserManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Badge, Button } from 'react-bootstrap';
import { adminGetAllUsersApi, adminUpdateUserStatusApi } from '../../api/admin.api'; // Import API admin
import { User, UserRole } from '../../types/user.types';

const AdminUserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // State cho việc cập nhật (sẽ dùng sau)
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminGetAllUsersApi();
            setUsers(response.users);
        } catch (err: any) {
            setError(err.message || 'Lỗi tải danh sách người dùng.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // TODO: Thêm hàm xử lý khi nhấn nút thay đổi trạng thái (verified, active)
    // const handleToggleVerified = async (userToUpdate: User) => { ... }
    // const handleToggleActive = async (userToUpdate: User) => { ... }
    // TODO: Thêm hàm xử lý thay đổi Role (có thể dùng Modal hoặc Select)

    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container><Alert variant="danger" className="mt-4">{error}</Alert></Container>;

    return (
        <Container fluid className="mt-4">
            <h2>Quản lý Người dùng</h2>
            {updateError && <Alert variant="danger" onClose={() => setUpdateError(null)} dismissible>{updateError}</Alert>}
            <Table striped bordered hover responsive className="mt-3 align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Tên đầy đủ</th>
                        <th>Vai trò</th>
                        <th>Xác minh</th>
                        <th>Hoạt động</th>
                        <th>Ngày tham gia</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.fullName || '-'}</td>
                            <td>
                                <Badge bg={u.role === UserRole.ADMIN ? 'danger' : (u.role === UserRole.VERIFIED_ORG ? 'success' : 'secondary')}>
                                    {u.role}
                                </Badge>
                            </td>
                            <td>
                                {u.isVerified ? <Badge bg="success">Đã X.Minh</Badge> : <Badge bg="warning" text="dark">Chưa X.Minh</Badge>}
                                {/* TODO: Nút Toggle Verified */}
                            </td>
                            <td>
                                {u.isActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Disabled</Badge>}
                                 {/* TODO: Nút Toggle Active */}
                            </td>
                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                            <td>
                                {/* TODO: Nút đổi Role, nút xem chi tiết... */}
                                <Button variant="outline-primary" size="sm" disabled={updatingUserId === u.id}>
                                    {/* Tạm thời */}
                                    Chi tiết
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminUserManagementPage;