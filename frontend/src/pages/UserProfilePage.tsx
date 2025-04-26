"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Image, Button, Spinner, Alert, Badge, Nav, Tab } from "react-bootstrap"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PersonPlus, Envelope, GeoAlt, Calendar3, PersonBadge } from "react-bootstrap-icons"
import type { User } from "../types/user.types"

// Đường dẫn đến ảnh avatar mặc định trong thư mục public
const defaultAvatar = "/default-avatar.png"
const defaultCoverImage = "/default-cover.jpg"

const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("about")
  const [isFollowing, setIsFollowing] = useState(false)

  // Dữ liệu giả cho thống kê (sau này sẽ lấy từ API)
  const stats = {
    eventsCreated: Math.floor(Math.random() * 10),
    eventsJoined: Math.floor(Math.random() * 20),
    totalVolunteerHours: Math.floor(Math.random() * 100),
    followers: Math.floor(Math.random() * 50),
    following: Math.floor(Math.random() * 30),
  }

  // Fetch user data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return

      setLoading(true)
      setError(null)

      try {
        // Tạm thời sử dụng dữ liệu giả
        // Sau này sẽ thay bằng API call thực tế: const data = await getUserProfileApi(Number(userId))

        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Dữ liệu giả
        const mockUser: User = {
          id: Number(userId),
          username: `user${userId}`,
          email: `user${userId}@example.com`,
          fullName: `Người dùng ${userId}`,
          bio: "Đây là tiểu sử mẫu của người dùng. Tôi là một tình nguyện viên nhiệt huyết, luôn sẵn sàng giúp đỡ cộng đồng và tham gia các hoạt động xã hội.",
          location: "Hà Nội",
          avatarUrl: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setUser(mockUser)
        // Random set following status
        setIsFollowing(Math.random() > 0.5)
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin người dùng.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [userId])

  const handleFollowToggle = () => {
    // Sau này sẽ gọi API để follow/unfollow
    setIsFollowing(!isFollowing)
  }

  const handleSendMessage = () => {
    // Sau này sẽ mở chat hoặc chuyển đến trang tin nhắn
    alert("Chức năng nhắn tin sẽ được phát triển sau!")
  }

  if (loading) {
    return (
      <div className="profile-loading-container d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
        <p className="text-muted">Đang tải thông tin người dùng...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error || "Không tìm thấy người dùng."}
        </Alert>
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-primary">
            Quay lại trang chủ
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <div className="profile-page">
      {/* Cover Image Section */}
      <div className="position-relative mb-5">
        <div
          className="profile-cover-container"
          style={{ height: "240px", overflow: "hidden", borderRadius: "0 0 10px 10px" }}
        >
          <Image
            src={defaultCoverImage || "/placeholder.svg"}
            alt="Cover"
            fluid
            className="w-100 h-100 object-fit-cover"
            style={{ objectPosition: "center 30%" }}
          />
        </div>

        {/* Container riêng cho avatar và nút chỉnh sửa */}
        <div className="container position-relative" style={{ marginTop: "-60px" }}>
          <div className="d-flex justify-content-between align-items-end">
            <div className="profile-avatar-container">
              <Image
                src={user.avatarUrl || defaultAvatar}
                alt={user.username}
                className="profile-avatar border border-4 border-white shadow"
                roundedCircle
                width={120}
                height={120}
                style={{ objectFit: "cover" }}
              />
            </div>

            {currentUser && currentUser.id !== user.id && (
              <div className="d-flex gap-2 mb-2">
                <Button
                  variant={isFollowing ? "outline-primary" : "primary"}
                  size="sm"
                  className="shadow-sm"
                  onClick={handleFollowToggle}
                >
                  <PersonPlus className="me-2" />
                  {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                </Button>
                <Button variant="outline-primary" size="sm" className="shadow-sm" onClick={handleSendMessage}>
                  <Envelope className="me-2" />
                  Nhắn tin
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Container className="mt-3">
        <Row>
          <Col lg={8} className="mb-4">
            {/* Thông tin cơ bản */}
            <div className="profile-info mb-4">
              <h2 className="mb-1">{user.fullName || user.username}</h2>
              <p className="text-muted mb-2">@{user.username}</p>

              <div className="user-meta d-flex flex-wrap gap-3 text-muted mb-3">
                {user.location && (
                  <div className="d-flex align-items-center">
                    <GeoAlt className="me-1" /> {user.location}
                  </div>
                )}
                <div className="d-flex align-items-center">
                  <Calendar3 className="me-1" /> Tham gia {formatDateTimeSimple(user.createdAt || "")}
                </div>
                <div className="d-flex align-items-center">
                  <PersonBadge className="me-1" /> Tình nguyện viên
                </div>
              </div>

              {user.bio && (
                <div className="bio-section mt-3 mb-4">
                  <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                    {user.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Tabs Section */}
            <Tab.Container id="profile-tabs" defaultActiveKey="about">
              <Nav variant="tabs" className="profile-tabs mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="about" className="px-4">
                    Giới thiệu
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="events" className="px-4">
                    Sự kiện
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="photos" className="px-4">
                    Hình ảnh
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="about">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-3">Thông tin chi tiết</h5>
                      <Row>
                        <Col md={6}>
                          <p>
                            <strong>Email:</strong>{" "}
                            {currentUser && currentUser.id === user.id ? (
                              user.email
                            ) : (
                              <span className="text-muted fst-italic">Chỉ hiển thị với chủ tài khoản</span>
                            )}
                          </p>
                          <p>
                            <strong>Địa điểm:</strong>{" "}
                            {user.location || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p>
                            <strong>Tên đầy đủ:</strong>{" "}
                            {user.fullName || <span className="text-muted fst-italic">Chưa cập nhật</span>}
                          </p>
                          <p>
                            <strong>Tên người dùng:</strong> @{user.username}
                          </p>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="events">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-3">Sự kiện đã tham gia</h5>
                      <p className="text-muted">Chức năng đang được phát triển...</p>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="photos">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h5 className="mb-3">Hình ảnh hoạt động</h5>
                      <p className="text-muted">Chức năng đang được phát triển...</p>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Thống kê */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-3">Thống kê hoạt động</h5>
                <div className="stats-container">
                  <div className="stat-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <span>Sự kiện đã tạo</span>
                    <Badge bg="primary" pill className="px-3 py-2">
                      {stats.eventsCreated}
                    </Badge>
                  </div>
                  <div className="stat-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <span>Sự kiện đã tham gia</span>
                    <Badge bg="success" pill className="px-3 py-2">
                      {stats.eventsJoined}
                    </Badge>
                  </div>
                  <div className="stat-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <span>Tổng giờ tình nguyện</span>
                    <Badge bg="info" pill className="px-3 py-2">
                      {stats.totalVolunteerHours}
                    </Badge>
                  </div>
                  <div className="stat-item d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                    <span>Người theo dõi</span>
                    <Badge bg="secondary" pill className="px-3 py-2">
                      {stats.followers}
                    </Badge>
                  </div>
                  <div className="stat-item d-flex justify-content-between align-items-center">
                    <span>Đang theo dõi</span>
                    <Badge bg="secondary" pill className="px-3 py-2">
                      {stats.following}
                    </Badge>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Huy hiệu */}
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="mb-3">Huy hiệu</h5>
                <div className="badges-container d-flex flex-wrap gap-2">
                  <Badge bg="secondary" className="p-2">
                    🌱 Người mới
                  </Badge>
                  <Badge bg="secondary" className="p-2">
                    🌟 Tích cực
                  </Badge>
                  <Badge bg="secondary" className="p-2">
                    🌍 Môi trường
                  </Badge>
                  <Badge bg="secondary" className="p-2">
                    📚 Giáo dục
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

// Hàm format ngày đơn giản
const formatDateTimeSimple = (isoString: string): string => {
  try {
    const date = new Date(isoString)
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch (e) {
    return "N/A"
  }
}

export default UserProfilePage
