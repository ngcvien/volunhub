"use client"

// frontend/src/pages/HomePage.tsx
import { useState, useEffect } from "react"
import { Alert, Spinner, Button, Card } from "react-bootstrap"
import { getAllEventsApi } from "../api/event.api"
import type { EventType } from "../types/event.types"
import EventCard from "../components/Event/EventCard"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { PlusCircleFill, Calendar2CheckFill } from "react-bootstrap-icons"

const HomePage = () => {
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0) // State để trigger refresh
  const { user } = useAuth()

  // Hàm refresh danh sách sự kiện
  const refreshEvents = () => {
    setRefreshKey((oldKey) => oldKey + 1)
  }

  // useEffect để gọi API khi component được mount hoặc refreshKey thay đổi
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAllEventsApi()
        setEvents(response.events)
      } catch (err: any) {
        setError(err.message || "Không thể tải dữ liệu sự kiện.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [refreshKey]) // Thêm refreshKey vào dependencies

  // --- Phần hiển thị ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Đang tải bảng tin...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Alert variant="danger" className="my-4 shadow-sm">
          <Alert.Heading>Không thể tải bảng tin</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={refreshEvents}>
              Thử lại
            </Button>
          </div>
        </Alert>
      )
    }

    if (events.length === 0) {
      return (
        <Card className="text-center my-4 shadow-sm border-0">
          <Card.Body className="py-5">
            <Calendar2CheckFill size={48} className="text-muted mb-3" />
            <Card.Title>Chưa có sự kiện nào</Card.Title>
            <Card.Text className="text-muted">Hãy là người đầu tiên tạo sự kiện và chia sẻ với cộng đồng!</Card.Text>
            {user && (
              <Link to="/events/new">
                <Button variant="primary" className="mt-3">
                  <PlusCircleFill className="me-2" /> Tạo sự kiện mới
                </Button>
              </Link>
            )}
          </Card.Body>
        </Card>
      )
    }

    return (
      <div className="events-feed">
        {events.map((event) => (
          <div key={event.id} className="event-card-wrapper mb-4 animate__animated animate__fadeIn">
            <EventCard event={event} onActionComplete={refreshEvents} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="homepage-container">
      {/* Sidebar bên trái */}
      <div className="sidebar-left">
        <div className="position-sticky" style={{ top: "80px" }}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Card.Title className="d-flex align-items-center mb-3">
                <Calendar2CheckFill className="me-2 text-primary" />
                <span>VolunHub</span>
              </Card.Title>
              <p className="text-muted small">
                Khám phá và tham gia các sự kiện tình nguyện gần bạn. Cùng nhau tạo nên những thay đổi tích cực!
              </p>
              {user && (
                <Link to="/events/new" className="text-decoration-none">
                  <Button variant="primary" className="w-100 mt-2">
                    <PlusCircleFill className="me-2" /> Tạo sự kiện
                  </Button>
                </Link>
              )}
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="d-flex align-items-center mb-3">
                <span>Xu hướng</span>
              </Card.Title>
              <div className="trending-tags">
                <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                  #MôiTrường
                </Button>
                <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                  #GiáoDục
                </Button>
                <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                  #CộngĐồng
                </Button>
                <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                  #TrồngCây
                </Button>
                <Button variant="outline-secondary" size="sm" className="me-2 mb-2">
                  #HiếnMáu
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Phần chính - Newsfeed */}
      <div className="main-content">
        {/* Phần tạo sự kiện (chỉ hiển thị khi đăng nhập) */}
        {user && (
          <Card className="shadow-sm border-0 mb-4 create-event-card">
            <Card.Body className="d-flex align-items-center">
              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.username}
                className="rounded-circle me-3"
                width="40"
                height="40"
                style={{ objectFit: "cover" }}
              />
              <Link to="/events/new" className="flex-grow-1 text-decoration-none">
                <div className="create-event-prompt p-2 rounded-pill bg-light text-muted ps-3">
                  Bạn muốn tạo sự kiện tình nguyện mới?
                </div>
              </Link>
            </Card.Body>
          </Card>
        )}

        {/* Tiêu đề bảng tin */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0">Bảng tin sự kiện</h4>
          <Button variant="outline-primary" size="sm" onClick={refreshEvents} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
          </Button>
        </div>

        {/* Nội dung chính */}
        {renderContent()}
      </div>

      {/* Sidebar bên phải */}
      <div className="sidebar-right">
        <div className="position-sticky" style={{ top: "80px" }}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Card.Title className="mb-3">Sự kiện sắp diễn ra</Card.Title>
              <div className="upcoming-events">
                {events.slice(0, 3).map((event) => (
                  <div key={`upcoming-${event.id}`} className="d-flex align-items-center mb-3 pb-2 border-bottom">
                    <div className="event-date me-2 text-center">
                      <div className="small fw-bold text-danger">
                        {new Date(event.eventTime).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                      </div>
                    </div>
                    <div className="event-info small">
                      <div className="fw-semibold text-truncate" style={{ maxWidth: "180px" }}>
                        {event.title}
                      </div>
                      <div className="text-muted">{event.location || "Chưa có địa điểm"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title className="mb-3">Gợi ý kết nối</Card.Title>
              <div className="suggested-connections">
                <div className="d-flex align-items-center mb-2">
                  <img
                    src="/default-avatar.png"
                    alt="Người dùng"
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <div className="small">Trung tâm Tình nguyện Quốc gia</div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <img
                    src="/default-avatar.png"
                    alt="Người dùng"
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <div className="small">Quỹ Bảo trợ Trẻ em Việt Nam</div>
                </div>
                <div className="d-flex align-items-center">
                  <img
                    src="/default-avatar.png"
                    alt="Người dùng"
                    className="rounded-circle me-2"
                    width="32"
                    height="32"
                  />
                  <div className="small">Hội Chữ thập đỏ Việt Nam</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomePage
