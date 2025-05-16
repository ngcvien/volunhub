"use client"

import { useState, useEffect } from "react"
import { Card, Table, Button, Badge, Form, InputGroup, Alert, Spinner, Modal, Nav, Tab, Container } from "react-bootstrap"
import {
  Search,
  CheckCircleFill,
  XCircleFill,
  Gear,
  CalendarEvent,
  PeopleFill,
  ClockFill,
  House,
  BarChartFill,
  GearFill,
} from "react-bootstrap-icons"
import { Link, useLocation } from "react-router-dom"
import {
  adminGetAllUsersApi,
  adminUpdateUserStatusApi,
  adminGetPendingEventsApi,
  adminApproveEventApi,
  adminRejectEventApi,
} from "../../api/admin.api"
import { useAuth } from "../../contexts/AuthContext"
import { type User, UserRole } from "../../types/user.types"
import type { EventType } from "../../types/event.types"
import "./AdminDashboardPage.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
)

// Hàm format ngày đơn giản
const formatDateTimeSimple = (isoString: string): string => {
  try {
    return new Date(isoString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch (e) {
    return "N/A"
  }
}

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  // User Management States
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [updateForm, setUpdateForm] = useState({
    role: "",
    isVerified: false,
    isActive: true,
  })

  // Event Management States
  const [pendingEvents, setPendingEvents] = useState<EventType[]>([])
  const [processingEventId, setProcessingEventId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    pendingEventsCount: 0,
  })

  // Fetch Users
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminGetAllUsersApi()
      setUsers(response.users)

      // Cập nhật thống kê
      setStats((prev) => ({
        ...prev,
        totalUsers: response.users.length,
        activeUsers: response.users.filter((user) => user.isActive).length,
      }))
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách người dùng.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch Pending Events
  const fetchPendingEvents = async () => {
    setLoading(true)
    setError(null)
    setActionError(null)
    try {
      const response = await adminGetPendingEventsApi()
      setPendingEvents(response.events)

      // Cập nhật thống kê
      setStats((prev) => ({
        ...prev,
        pendingEventsCount: response.events.length,
        totalEvents: response.totalEvents || prev.totalEvents,
      }))
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách sự kiện chờ duyệt.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchPendingEvents()
  }, [])

  // User Management Handlers
  const handleUpdateStatus = async (userToUpdate: User, updates: any) => {
    if (userToUpdate.id === currentUser?.id) {
      setUpdateError("Không thể thay đổi trạng thái của chính tài khoản Admin đang đăng nhập.")
      return
    }

    setUpdatingUserId(userToUpdate.id)
    setUpdateError(null)

    try {
      await adminUpdateUserStatusApi(userToUpdate.id, updates)
      await fetchUsers()
    } catch (err: any) {
      setUpdateError(err.message || "Lỗi khi cập nhật trạng thái.")
    } finally {
      setUpdatingUserId(null)
    }
  }

  const handleBulkAction = async (action: string) => {
    if (!selectedUsers.length) return

    const updates = {
      isActive: action === "activate",
      isVerified: action === "verify",
    }

    try {
      await Promise.all(selectedUsers.map((userId) => adminUpdateUserStatusApi(userId, updates)))
      await fetchUsers()
      setSelectedUsers([])
    } catch (error) {
      setUpdateError("Lỗi khi thực hiện thao tác hàng loạt")
    }
  }

  const handleShowUpdateModal = (user: User) => {
    setSelectedUser(user)
    setUpdateForm({
      role: user.role,
      isVerified: user.isVerified || false,
      isActive: user.isActive || false,
    })
    setShowUpdateModal(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      await handleUpdateStatus(selectedUser, updateForm)
      setShowUpdateModal(false)
    } catch (error) {
      console.error("Update failed:", error)
    }
  }

  // Event Management Handlers
  const handleApprove = async (eventId: number) => {
    setProcessingEventId(eventId)
    setActionError(null)
    try {
      await adminApproveEventApi(eventId)
      await fetchPendingEvents()
    } catch (err: any) {
      setActionError(err.message || `Lỗi khi duyệt sự kiện ID ${eventId}.`)
    } finally {
      setProcessingEventId(null)
    }
  }

  const handleReject = async (eventId: number) => {
    setProcessingEventId(eventId)
    setActionError(null)
    try {
      await adminRejectEventApi(eventId)
      await fetchPendingEvents()
    } catch (err: any) {
      setActionError(err.message || `Lỗi khi từ chối sự kiện ID ${eventId}.`)
    } finally {
      setProcessingEventId(null)
    }
  }

  // Filter Users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive)

    return matchesSearch && matchesRole && matchesStatus
  })

  // Dữ liệu biểu đồ
  const userRoleData = {
    labels: ["Người dùng", "Tổ chức đã xác minh", "Quản trị viên"],
    datasets: [
      {
        label: "Phân bố vai trò người dùng",
        data: [
          users.filter((u) => u.role === UserRole.USER).length,
          users.filter((u) => u.role === UserRole.VERIFIED_ORG).length,
          users.filter((u) => u.role === UserRole.ADMIN).length,
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const userActivityData = {
    labels: ["Đang hoạt động", "Đã khóa"],
    datasets: [
      {
        label: "Trạng thái người dùng",
        data: [users.filter((u) => u.isActive).length, users.filter((u) => !u.isActive).length],
        backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  }

  // Dữ liệu biểu đồ đăng ký người dùng theo thời gian
  const userRegistrationData = {
    labels: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
    datasets: [
      {
        label: "Người dùng đăng ký",
        data: [65, 78, 90, 81, 56, 55, 40, 55, 72, 89, 95, 120],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
      },
    ],
  }

  // Dữ liệu biểu đồ sự kiện theo trạng thái
  const eventStatusData = {
    labels: ["Đã duyệt", "Đang chờ", "Đã từ chối", "Đã kết thúc"],
    datasets: [
      {
        label: "Trạng thái sự kiện",
        data: [45, pendingEvents.length, 12, 30],
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
        </div>
        <Nav className="flex-column admin-nav">
          <Nav.Link 
            eventKey="dashboard" 
            className={activeTab === 'dashboard' ? 'active-admin nav-link-admin' : 'nav-link-admin'}
            onClick={() => setActiveTab('dashboard')}
          >
            <House />
            <span>Dashboard</span>
          </Nav.Link>
          <Nav.Link 
            eventKey="users" 
            className={activeTab === 'users' ? 'active-admin nav-link-admin' : 'nav-link-admin'}
            onClick={() => setActiveTab('users')}
          >
            <PeopleFill />
            <span>Người dùng</span>
          </Nav.Link>
          <Nav.Link 
            eventKey="events" 
            className={activeTab === 'events' ? 'active-admin nav-link-admin' : 'nav-link-admin'}
            onClick={() => setActiveTab('events')}
          >
            <CalendarEvent />
            <span>Sự kiện</span>
          </Nav.Link>
          <Nav.Link 
            eventKey="reports" 
            className={activeTab === 'reports' ? 'active-admin nav-link-admin' : 'nav-link-admin'}
            onClick={() => setActiveTab('reports')}
          >
            <BarChartFill />
            <span>Báo cáo</span>
          </Nav.Link>
          <Nav.Link 
            eventKey="settings" 
            className={activeTab === 'settings' ? 'active-admin nav-link-admin' : 'nav-link-admin'}
            onClick={() => setActiveTab('settings')}
          >
            <GearFill />
            <span>Cài đặt</span>
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="admin-content-wrapper">
        <Tab.Container activeKey={activeTab}>
          <Tab.Content>
            {/* Dashboard Tab */}
            <Tab.Pane eventKey="dashboard">
              <h2 className="mb-4">Tổng quan hệ thống</h2>

              {/* Stats Cards */}
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: "rgba(54, 162, 235, 0.1)", color: "#3498db" }}>
                      <PeopleFill />
                    </div>
                  </div>
                  <div className="stat-value">{stats.totalUsers}</div>
                  <div className="stat-label">Tổng số người dùng</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: "rgba(75, 192, 192, 0.1)", color: "#2ecc71" }}>
                      <CheckCircleFill />
                    </div>
                  </div>
                  <div className="stat-value">{stats.activeUsers}</div>
                  <div className="stat-label">Người dùng đang hoạt động</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: "rgba(255, 159, 64, 0.1)", color: "#f39c12" }}>
                      <CalendarEvent />
                    </div>
                  </div>
                  <div className="stat-value">{stats.totalEvents}</div>
                  <div className="stat-label">Tổng số sự kiện</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon" style={{ backgroundColor: "rgba(255, 99, 132, 0.1)", color: "#e74c3c" }}>
                      <ClockFill />
                    </div>
                  </div>
                  <div className="stat-value">{stats.pendingEventsCount}</div>
                  <div className="stat-label">Sự kiện đang chờ duyệt</div>
                </div>
              </div>

              {/* Charts */}
              <div className="chart-grid">
                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3 className="chart-card-title">Phân bố vai trò người dùng</h3>
                  </div>
                  <div className="chart-card-content">
                    <Doughnut
                      data={userRoleData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3 className="chart-card-title">Trạng thái người dùng</h3>
                  </div>
                  <div className="chart-card-content">
                    <Pie
                      data={userActivityData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "bottom",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3 className="chart-card-title">Người dùng đăng ký theo tháng</h3>
                  </div>
                  <div className="chart-card-content">
                    <Line
                      data={userRegistrationData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <h3 className="chart-card-title">Trạng thái sự kiện</h3>
                  </div>
                  <div className="chart-card-content">
                    <Bar
                      data={eventStatusData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="table-card">
                <div className="table-header">
                  <h3 className="table-title">Người dùng mới nhất</h3>
                  <Button variant="outline-primary" size="sm">
                    Xem tất cả
                  </Button>
                </div>
                <div className="table-content">
                  <Table hover responsive className="align-middle">
                    <thead>
                      <tr>
                        <th>Người dùng</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày tham gia</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.slice(0, 5).map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-info">
                              <img
                                src={user.avatarUrl || "/default-avatar.png"}
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
                                user.role === UserRole.ADMIN
                                  ? "danger"
                                  : user.role === UserRole.VERIFIED_ORG
                                    ? "success"
                                    : "info"
                              }
                            >
                              {user.role === UserRole.ADMIN
                                ? "Quản trị viên"
                                : user.role === UserRole.VERIFIED_ORG
                                  ? "Tổ chức đã xác minh"
                                  : "Người dùng"}
                            </Badge>
                          </td>
                          <td>
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
                          <td>{new Date(user.createdAt || "").toLocaleDateString("vi-VN")}</td>
                          <td>
                            <Button variant="light" size="sm" onClick={() => handleShowUpdateModal(user)}>
                              <Gear />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              
            </Tab.Pane>

            {/* User Management Tab */}
            <Tab.Pane eventKey="users">
              <div className="admin-content">
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
                        {Object.values(UserRole).map((role) => (
                          <option key={role} value={role}>
                            {role === UserRole.ADMIN
                              ? "Quản trị viên"
                              : role === UserRole.VERIFIED_ORG
                                ? "Tổ chức đã xác minh"
                                : "Người dùng"}
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
                            onClick={() => handleBulkAction("activate")}
                            className="me-2"
                          >
                            Kích hoạt ({selectedUsers.length})
                          </Button>
                          <Button variant="outline-danger" onClick={() => handleBulkAction("deactivate")}>
                            Khóa ({selectedUsers.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>

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
                                    setSelectedUsers(e.target.checked ? filteredUsers.map((u) => u.id) : [])
                                  }}
                                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
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
                            {filteredUsers.map((user) => (
                              <tr key={user.id}>
                                <td>
                                  <Form.Check
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) => {
                                      setSelectedUsers((prev) =>
                                        e.target.checked ? [...prev, user.id] : prev.filter((id) => id !== user.id),
                                      )
                                    }}
                                  />
                                </td>
                                <td>
                                  <div className="user-info">
                                    <img
                                      src={user.avatarUrl || "/default-avatar.png"}
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
                                      user.role === UserRole.ADMIN
                                        ? "danger"
                                        : user.role === UserRole.VERIFIED_ORG
                                          ? "success"
                                          : "info"
                                    }
                                  >
                                    {user.role === UserRole.ADMIN
                                      ? "Quản trị viên"
                                      : user.role === UserRole.VERIFIED_ORG
                                        ? "Tổ chức đã xác minh"
                                        : "Người dùng"}
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
                                <td>{new Date(user.createdAt || "").toLocaleDateString("vi-VN")}</td>
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
              </div>
            </Tab.Pane>

            {/* Event Management Tab */}
            <Tab.Pane eventKey="events">
            <Container fluid className="mt-3 p-5 ">
            <h2 className='mt-4'>Duyệt Sự kiện Mới ({pendingEvents.length})</h2>
            {actionError && <Alert variant="warning" onClose={() => setActionError(null)} dismissible>{actionError}</Alert>}

            {pendingEvents.length === 0 && !loading ? (
                <Alert variant="info" className="mt-3">Không có sự kiện nào đang chờ duyệt.</Alert>
            ) : (
                <Table striped bordered hover responsive className="mt-3 align-middle">
                    <thead className='table-light'>
                        <tr>
                            <th>ID</th>
                            <th>Tiêu đề</th>
                            <th>Người tạo</th>
                            <th>Thời gian tạo</th>
                            <th>Thời gian sự kiện</th>
                            <th className='text-center'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingEvents.map((event) => (
                            <tr key={event.id}>
                                <td>{event.id}</td>
                                <td><Link to={`/events/${event.id}`}>{event.title}</Link></td>
                                <td>
                                    <Link to={`/profile/${event.creator.id}`}>
                                        {event.creator.username} (ID: {event.creator.id})
                                    </Link>
                                </td>
                                <td>{formatDateTimeSimple(event.createdAt)}</td>
                                <td>{formatDateTimeSimple(event.eventTime)}</td>
                                <td className='text-center'>
                                    {processingEventId === event.id ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleApprove(event.id)}
                                                title="Duyệt sự kiện này"
                                            >
                                                <i className="bi bi-check-lg"></i> Duyệt
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleReject(event.id)}
                                                title="Từ chối sự kiện này"
                                            >
                                                <i className="bi bi-x-lg"></i> Từ chối
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>

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
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    role: e.target.value,
                  })
                }
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {role === UserRole.ADMIN
                      ? "Quản trị viên"
                      : role === UserRole.VERIFIED_ORG
                        ? "Tổ chức đã xác minh"
                        : "Người dùng"}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Đã xác minh"
                checked={updateForm.isVerified}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    isVerified: e.target.checked,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Đang hoạt động"
                checked={updateForm.isActive}
                onChange={(e) =>
                  setUpdateForm({
                    ...updateForm,
                    isActive: e.target.checked,
                  })
                }
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
  )
}

export default AdminDashboardPage
