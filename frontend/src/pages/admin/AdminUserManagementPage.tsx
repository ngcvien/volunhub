// frontend/src/pages/admin/AdminUserManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert, Badge, Button, Form } from 'react-bootstrap'; // Thêm Form
import { adminGetAllUsersApi, adminUpdateUserStatusApi } from '../../api/admin.api';
import { User, UserRole } from '../../types/user.types'; // Import UserRole enum
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth để lấy currentUser
import { set } from 'date-fns';

const AdminUserManagementPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuth(); // Lấy currentUser để tránh admin tự sửa mình

    // --- THÊM STATE CHO VIỆC CẬP NHẬT ---
    // Lưu ID của user đang được cập nhật để hiển thị loading đúng chỗ
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    // Lưu lỗi cụ thể của hành động cập nhật
    const [updateError, setUpdateError] = useState<string | null>(null);
    // --- KẾT THÚC THÊM STATE ---


    // Hàm fetch users giữ nguyên, thêm reset updateError
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        setUpdateError(null); // Reset lỗi update khi fetch lại
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

    // --- THÊM CÁC HÀM XỬ LÝ CẬP NHẬT ---

    const handleUpdateStatus = async (userToUpdate: User, updates: { role?: UserRole; isVerified?: boolean; isActive?: boolean }) => {
        if (userToUpdate.id === currentUser?.id) {
            setUpdateError("Không thể thay đổi trạng thái của chính tài khoản Admin đang đăng nhập.");
            setTimeout(() => setUpdateError(null), 3000);
            return;
        }

        const originalUsers = [...users]; // Tạo bản sao nông của mảng users
        const userIndex = originalUsers.findIndex(u => u.id === userToUpdate.id);
        if (userIndex === -1) return; // Không tìm thấy user? Lỗi lạ.
        const originalUser = { ...originalUsers[userIndex] }; // Tạo bản sao của user cũ

        // 2. Cập nhật state users NGAY LẬP TỨC với giá trị mới (lạc quan)
        const optimisticUpdate = { ...originalUser, ...updates }; // Merge trạng thái mới
        setUsers(prevUsers =>
            prevUsers.map(u => (u.id === userToUpdate.id ? optimisticUpdate : u))
        );
        // --- KẾT THÚC CẬP NHẬT LẠC QUAN ---

        // 3. Vẫn set loading cho dòng đó (để disable control) nhưng không cần spinner nếu muốn tức thì hoàn toàn
        setUpdatingUserId(userToUpdate.id);
        setUpdateError(null);
        try {
            // 4. Gọi API backend ngầm
            await adminUpdateUserStatusApi(userToUpdate.id, updates);
            // API thành công -> không cần làm gì thêm ở UI vì đã cập nhật lạc quan rồi
            console.log(`Successfully updated status for user ${userToUpdate.id}`);

        } catch (err: any) {
            // 5. XỬ LÝ LỖI: API thất bại -> Khôi phục lại state cũ và báo lỗi
            console.error(`Failed to update status for user ${userToUpdate.id}:`, err);
            setUpdateError(err.message || `Lỗi khi cập nhật trạng thái.`);
            // Khôi phục lại mảng users về trạng thái ban đầu trước khi cập nhật lạc quan
            setUsers(originalUsers);
        } finally {
            // 6. Luôn bỏ trạng thái loading của dòng đó
            setUpdatingUserId(null);
        }
    };

    // Hàm riêng cho từng loại cập nhật để gắn vào event handler
    const handleToggleVerified = (userToUpdate: User) => {
        handleUpdateStatus(userToUpdate, { isVerified: !userToUpdate.isVerified });
    };

    const handleToggleActive = (userToUpdate: User) => {
        handleUpdateStatus(userToUpdate, { isActive: !userToUpdate.isActive });
    };

    const handleChangeRole = (userToUpdate: User, newRole: UserRole) => {
        // Kiểm tra xem role mới có hợp lệ không (dù Select thường đã đảm bảo)
        if (Object.values(UserRole).includes(newRole)) {
            handleUpdateStatus(userToUpdate, { role: newRole });
        } else {
            setUpdateError(`Vai trò '${newRole}' không hợp lệ.`);
        }
    };

    // --- KẾT THÚC THÊM HÀM ---


    if (loading) return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    if (error) return <Container><Alert variant="danger" className="mt-4">{error} <Button size="sm" variant="outline-danger" onClick={fetchUsers}>Thử lại</Button></Alert></Container>;

    return (
        <Container fluid className="mt-4 admin-component-page">
            <h2>Quản lý Người dùng ({users.length})</h2>
            {updateError && <Alert variant="danger" onClose={() => setUpdateError(null)} dismissible>{updateError}</Alert>}

            <Table striped bordered hover responsive className="mt-3 align-middle user-management-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Tên đầy đủ</th>
                        <th className='text-center'>Vai trò</th>
                        <th className='text-center'>Xác minh</th>
                        <th className='text-center'>Hoạt động</th>
                        <th>Ngày tham gia</th>
                        {/* Bỏ cột Hành động nếu chỉ có sửa trạng thái */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id} className={!u.isActive ? 'table-secondary text-muted' : ''}> {/* Làm mờ user bị disable */}
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{u.email}</td>
                            <td>{u.fullName || '-'}</td>
                            {/* --- CỘT VAI TRÒ (Dùng Select) --- */}
                            <td className='text-center'>
                                {updatingUserId === u.id ? <Spinner animation="border" size="sm" /> : (
                                    <Form.Select
                                        size="sm"
                                        value={u.role}
                                        onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                                        disabled={updatingUserId === u.id || u.id === currentUser?.id} // Không cho sửa chính mình
                                        style={{ minWidth: '100px', display: 'inline-block', width: 'auto' }}
                                    >
                                        {Object.values(UserRole).map(roleValue => (
                                            <option key={roleValue} value={roleValue}>{roleValue}</option>
                                        ))}
                                    </Form.Select>
                                )}
                            </td>
                            {/* --- CỘT XÁC MINH (Dùng Switch) --- */}
                            <td className='text-center'>
                                {updatingUserId === u.id ? <Spinner animation="border" size="sm" /> : (
                                    <Form.Check
                                        type="switch"
                                        id={`verify-switch-${u.id}`}
                                        checked={u.isVerified || false} // Handle potential null/undefined from initial state
                                        onChange={e => {
                                            e.preventDefault();
                                            handleToggleVerified(u);
                                        }}
                                        disabled={updatingUserId === u.id || u.id === currentUser?.id} // Không cho sửa chính mình
                                        title={u.isVerified ? "Bỏ xác minh" : "Xác minh người dùng"}
                                    />
                                )}
                            </td>
                            {/* --- CỘT HOẠT ĐỘNG (Dùng Switch) --- */}
                            <td className='text-center'>
                                {updatingUserId === u.id ? <Spinner animation="border" size="sm" /> : (
                                    <Form.Check
                                        type="switch"
                                        id={`active-switch-${u.id}`}
                                        checked={u.isActive || false} // Handle potential null/undefined
                                        onChange={() => handleToggleActive(u)}
                                        disabled={updatingUserId === u.id || u.id === currentUser?.id} // Không cho sửa chính mình
                                        title={u.isActive ? "Vô hiệu hóa" : "Kích hoạt lại"}
                                    />
                                )}
                            </td>
                            <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default AdminUserManagementPage;