"use client"

import { useState } from "react"
import {
  Container, Row, Col, Card,
  Image, Button, Spinner, Alert,
  Badge, Nav, Tab, Modal
} from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import EditProfileForm from "../components/Profile/EditProfileForm"
import { PencilSquare, GeoAlt, Calendar3, PersonBadge } from "react-bootstrap-icons"

// Đường dẫn đến ảnh avatar mặc định trong thư mục public
const defaultAvatar = "/default-avatar.png"
const defaultCoverImage = "/default-cover.jpg" // Thêm ảnh bìa mặc định

const ProfilePage = () => {
  const { user, isLoading: authIsLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const [showImageModal, setShowImageModal] = useState(false)

  // Dữ liệu giả cho thống kê (sau này sẽ lấy từ API)
  const stats = {
    eventsCreated: 5,
    eventsJoined: 12,
    totalVolunteerHours: 48,
  }

  // --- Xử lý trạng thái Loading ban đầu từ AuthContext ---
  if (authIsLoading) {
    return (
      <div className="profile-loading-container d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" style={{ width: "3rem", height: "3rem" }} />
        <p className="text-muted">Đang tải thông tin người dùng...</p>
      </div>
    )
  }

  // --- Xử lý trường hợp không có user (dù route đã bảo vệ) ---
  if (!user) {
    return (
      <Container>
        <Alert variant="warning" className="text-center mt-5">
          Vui lòng <Alert.Link href="/login">đăng nhập</Alert.Link> để xem hồ sơ.
        </Alert>
      </Container>
    )
  }
  

  // --- Hàm được gọi khi EditProfileForm lưu thành công hoặc bị hủy ---
  const handleFinishEditing = () => {
    setIsEditing(false)
  }
  console.log("user", user.isActive);
  if(user.isActive === false) {
    return (
      <Container>
        <Alert variant="danger" className="text-center mt-5">
          Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.
        </Alert>
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
                style={{ objectFit: "cover", cursor: "pointer" }}
                onClick={() => setShowImageModal(true)}
              />
            </div>
            <Modal
              show={showImageModal}
              onHide={() => setShowImageModal(false)}
              centered
              size="lg"
              contentClassName="bg-transparent border-0"
            >
              <Modal.Header closeButton className="border-0" />
              <Modal.Body className="d-flex justify-content-center align-items-center p-0">
                <img
                  src={user.avatarUrl || defaultAvatar}
                  alt={user.username}
                  style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 8 }}
                />
              </Modal.Body>
            </Modal>

            {!isEditing && (
              <Button
                variant="light"
                size="sm"
                className="edit-profile-btn shadow-sm mb-2"
                onClick={() => setIsEditing(true)}
              >
                <PencilSquare className="me-2" /> Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>
        </div>
      </div>

      <Container className="mt-3">
        {isEditing ? (
          // ---- Chế độ Sửa: Render EditProfileForm ----
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="border-0 shadow-sm">
                <Card.Header as="h4" className="bg-white border-bottom-0 pt-3">
                  Chỉnh sửa hồ sơ
                </Card.Header>
                <Card.Body className="p-4">
                  <EditProfileForm onSaveSuccess={handleFinishEditing} onCancel={handleFinishEditing} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          // ---- Chế độ Xem: Hiển thị thông tin user ----
          <Row>
            <Col lg={8} className="mb-4">
              {/* Thông tin cơ bản */}
              <div className="profile-info mb-4">
                <h2 className="mb-1">{user.fullName || user.username}</h2>
                {user.fullName && <p className="text-muted mb-2">@{user.username}</p>}

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
                              <strong>Email:</strong> {user.email}
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
                    <div className="stat-item d-flex justify-content-between align-items-center">
                      <span>Tổng giờ tình nguyện</span>
                      <Badge bg="info" pill className="px-3 py-2">
                        {stats.totalVolunteerHours}
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
        )}
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

export default ProfilePage
