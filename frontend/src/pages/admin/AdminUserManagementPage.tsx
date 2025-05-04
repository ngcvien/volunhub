import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Table, 
  Button, 
  Badge, 
  Form, 
  InputGroup,
  Dropdown,
  Alert,
  Spinner,
  Modal,
  DropdownButton
} from 'react-bootstrap';
import { 
  Search, 
  Filter, 
  ThreeDots, 
  PersonFill,
  CheckCircleFill,
  XCircleFill,
  Gear,
  Download,
  Upload,
  ArrowClockwise
} from 'react-bootstrap-icons';
import { adminGetAllUsersApi, adminUpdateUserStatusApi } from '../../api/admin.api';
import { useAuth } from '../../contexts/AuthContext';
import { User, UserRole } from '../../types/user.types';
import './AdminUserManagementPage.css';
const AdminUserManagementPage = () => {
  const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updateForm, setUpdateForm] = useState({
    role: '',
    isVerified: false,
    isActive: true
  });
    useEffect(() => {
        fetchUsers();
    }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
        try {
      const response = await adminGetAllUsersApi();
      setUsers(response.users);
        } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng.');
        } finally {
      setLoading(false);
        }
    };

  const handleUpdateStatus = async (userToUpdate: User, updates: any) => {
    if (userToUpdate.id === currentUser?.id) {
      setUpdateError("Không thể thay đổi trạng thái của chính tài khoản Admin đang đăng nhập.");
      return;
    }

    setUpdatingUserId(userToUpdate.id);
    setUpdateError(null);

    try {
      await adminUpdateUserStatusApi(userToUpdate.id, updates);
      await fetchUsers();
    } catch (err: any) {
      setUpdateError(err.message || "Lỗi khi cập nhật trạng thái.");
    } finally {
      setUpdatingUserId(null);
    }
    };

  const handleBulkAction = async (action: string) => {
    if (!selectedUsers.length) return;

    const updates = {
      isActive: action === 'activate',
      isVerified: action === 'verify'
    };

    try {
      await Promise.all(
        selectedUsers.map(userId => 
          adminUpdateUserStatusApi(userId, updates)
        )
      );
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      setUpdateError('Lỗi khi thực hiện thao tác hàng loạt');
    }
};

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleShowUpdateModal = (user: User) => {
    setSelectedUser(user);
    setUpdateForm({
      role: user.role,
      isVerified: user.isVerified || false,
      isActive: user.isActive || false
    });
    setShowUpdateModal(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await handleUpdateStatus(selectedUser, updateForm);
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="admin-page">
      <Container fluid className="py-4">
        {/* Header Section */}
        <div className="admin-header">
          <div className="admin-title">
            <h2>Quản lý người dùng</h2>
            <Badge bg="info" className="ms-2" >
              {filteredUsers.length} người dùng
            </Badge>
          </div>
          <div className="admin-actions">
            <Button variant="outline-primary" className="action-btn">
              <Download /> 
            </Button>
            <Button variant="outline-secondary" className="action-btn">
              <Upload />
            </Button>
            <Button 
              variant="primary" 
              className="action-btn"
              onClick={fetchUsers}
            >
              <ArrowClockwise /> 
            </Button>
            
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-4 filter-card">
          <Card.Body>
            <div className="filters-container">
              <InputGroup className="search-input">
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Form.Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả vai trò</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {role === UserRole.ADMIN ? 'Quản trị viên' :
                     role === UserRole.VERIFIED_ORG ? 'Tổ chức đã xác minh' : 
                     'Người dùng'}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Đã khóa</option>
              </Form.Select>

              {selectedUsers.length > 0 && (
                <div className="bulk-actions">
                  <Button
                    variant="outline-success"
                    onClick={() => handleBulkAction('activate')}
                    className="me-2"
                  >
                    Kích hoạt ({selectedUsers.length})
                  </Button>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleBulkAction('deactivate')}
                  >
                    Khóa ({selectedUsers.length})
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Error Messages */}
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        {updateError && (
          <Alert variant="danger" className="mb-4" dismissible>
            {updateError}
          </Alert>
        )}

        {/* Users Table */}
        <Card className="table-card">
          <Card.Body>
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Đang tải danh sách người dùng...</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>
                        <Form.Check
                          type="checkbox"
                          onChange={(e) => {
                            setSelectedUsers(
                              e.target.checked 
                                ? filteredUsers.map(u => u.id)
                                : []
                            );
                          }}
                          checked={
                            selectedUsers.length === filteredUsers.length &&
                            filteredUsers.length > 0
                          }
                        />
                      </th>
                      <th>Người dùng</th>
                      <th>Vai trò</th>
                      <th className="text-center">Trạng thái</th>
                      <th>Xác minh</th>
                      <th>Ngày tham gia</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              setSelectedUsers(prev =>
                                e.target.checked
                                  ? [...prev, user.id]
                                  : prev.filter(id => id !== user.id)
                              );
                            }}
                          />
                        </td>
                        <td>
                          <div className="user-info">
                            <img
                              src={user.avatarUrl || '/default-avatar.png'}
                              alt={user.username}
                              className="user-avatar"
                            />
                            <div>
                              <div className="user-name">{user.username}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={
                              user.role === UserRole.ADMIN ? 'danger' :
                              user.role === UserRole.VERIFIED_ORG ? 'success' :
                              'info'
                            }
                          >
                            {user.role === UserRole.ADMIN ? 'Quản trị viên' :
                             user.role === UserRole.VERIFIED_ORG ? 'Tổ chức đã xác minh' : 
                             'Người dùng'}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {user.isActive ? (
                            <Badge bg="success" className="status-badge">
                              <CheckCircleFill /> Hoạt động
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="status-badge">
                              <XCircleFill /> Đã khóa
                            </Badge>
                          )}
                        </td>
                        <td>
                        {user.isVerified ? (
                            <Badge bg="success" className="status-badge">
                              <CheckCircleFill /> Đã xác minh
                            </Badge>
                          ) : (
                            <Badge bg="warning" className="status-badge">
                              <XCircleFill /> Chưa xác minh
                            </Badge>
                          )}
                        </td>
                        <td>
                          {new Date(user.createdAt || '').toLocaleDateString('vi-VN')}
                        </td>
                        <td>
                          <Button
                            variant="light"
                            size="sm"
                            onClick={() => handleShowUpdateModal(user)}
                            disabled={updatingUserId === user.id}
                          >
                            <Gear />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Update User Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                value={updateForm.role}
                onChange={(e) => setUpdateForm({
                  ...updateForm,
                  role: e.target.value
                })}
              >
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>
                    {role === UserRole.ADMIN ? 'Quản trị viên' :
                     role === UserRole.VERIFIED_ORG ? 'Tổ chức đã xác minh' : 
                     'Người dùng'}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Đã xác minh"
                checked={updateForm.isVerified}
                onChange={(e) => setUpdateForm({
                  ...updateForm,
                  isVerified: e.target.checked
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Đang hoạt động"
                checked={updateForm.isActive}
                onChange={(e) => setUpdateForm({
                  ...updateForm,
                  isActive: e.target.checked
                })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUserManagementPage;