"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Container, Row, Col, Spinner, Alert, Button, Toast } from "react-bootstrap"
import { useInView } from "react-intersection-observer"
import LeftSidebar from "../components/Home/LeftSidebar"
import RightSidebar from "../components/Home/RightSidebar"
import EventCard from "../components/Event/EventCard"
import EventFilterBar from "../components/Home/EventFilterBar"
import { getAllEventsApi } from "../api/event.api"
import type { EventType } from "../types/event.types"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import { PlusCircleFill, Calendar2CheckFill, ArrowClockwise } from "react-bootstrap-icons"
import { gsap } from "gsap"
import "./HomePage.css"

const HomePage = () => {
  const { user, theme } = useAuth()
  const [events, setEvents] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [showLocationToast, setShowLocationToast] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    status: "active",
    sortBy: "latest",
    search: "",
  })

  // Refs for animation
  const spaceBackgroundRef = useRef<HTMLDivElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)
  const shootingStarRef = useRef<HTMLDivElement>(null)

  // Infinite scroll setup
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const refreshEvents = () => {
    setRefreshKey((oldKey) => oldKey + 1)
  }

  const fetchEvents = useCallback(
    async (pageNum: number) => {
      try {
        setLoading(true)
        // Build filters to send
        let filtersToSend = { ...filters, page: pageNum };
        if (filters.sortBy === 'nearby' && user?.location) {
          (filtersToSend as Record<string, any>).location = user.location;
        }
        const response = await getAllEventsApi(filtersToSend as Record<string, any>)
        if (pageNum === 1) {
          setEvents(response.events)
        } else {
          setEvents((prev) => [...prev, ...response.events])
        }
        setHasMore(response.events.length > 0)
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách sự kiện.")
      } finally {
        setLoading(false)
      }
    },
    [filters, user],
  )

  // Initial load
  useEffect(() => {
    setPage(1)
    fetchEvents(1)
  }, [fetchEvents, refreshKey])

  // Load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage((prev) => prev + 1)
      fetchEvents(page + 1)
    }
  }, [inView, hasMore, loading, fetchEvents, page])

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    const isNearbyFilter = newFilters.sortBy === "nearby"
    const hasLocation = Boolean(user?.location)

    if (isNearbyFilter && !hasLocation) {
      setShowLocationToast(true)
      return
    }

    setFilters(newFilters)
    setPage(1)
  }

  // Handle location toast close
  const handleLocationToastClose = () => {
    setShowLocationToast(false)
  }

  // Handle location update click
  const handleLocationUpdateClick = () => {
    setShowLocationToast(false)
  }

  // Stars background effect
  useEffect(() => {
    if (!starsCanvasRef.current) return

    const canvas = starsCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars
    const stars: { x: number; y: number; size: number; speed: number }[] = []
    const createStars = () => {
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 1000)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.05,
        })
      }
    }

    createStars()

    // Animate stars
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.fillStyle = theme === "dark" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.5)"
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Move stars
        star.y += star.speed

        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animateStars)
    }

    animateStars()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme])

  // GSAP animations
  useEffect(() => {
    // Animate planets
    gsap.fromTo(".planet-1", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" })

    gsap.fromTo(".planet-2", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, delay: 0.3, ease: "power2.out" })

    gsap.fromTo(
      ".planet-3",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, delay: 0.6, ease: "elastic.out(1, 0.5)" },
    )

    // Animate feed title
    gsap.fromTo(
      ".feed-title",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: "back.out(1.7)" },
    )

    // Create shooting stars at random intervals
    const createShootingStar = () => {
      if (!shootingStarRef.current) return

      const star = document.createElement("div")
      star.className = "shooting-star"

      // Random position
      const startX = Math.random() * window.innerWidth
      const startY = Math.random() * (window.innerHeight / 2)

      star.style.top = `${startY}px`
      star.style.left = `${startX}px`

      shootingStarRef.current.appendChild(star)

      // Remove after animation completes
      setTimeout(() => {
        star.remove()
      }, 3000)
    }

    // Create shooting stars at random intervals
    const shootingStarInterval = setInterval(createShootingStar, 5000)

    // Initial shooting star
    setTimeout(createShootingStar, 2000)

    return () => {
      clearInterval(shootingStarInterval)
    }
  }, [])

  const renderContent = () => {
    if (loading && page === 1) {
      return (
        <div className="loading-container">
          <div className="space-spinner"></div>
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
        <div className="empty-state">
          <div className="empty-state-icon">
            <Calendar2CheckFill size={64} />
          </div>
          <h4 className="mt-3">Chưa có sự kiện nào</h4>
          <p className="text-muted">Hãy là người đầu tiên tạo sự kiện và chia sẻ với cộng đồng!</p>
          {user && (
            <Link to="/events/new">
              <Button className="create-event-btn">
                <PlusCircleFill className="me-2" /> Tạo sự kiện mới
              </Button>
            </Link>
          )}
        </div>
      )
    }

    return (
      <div className="events-feed">
        {events.map((event) => (
          <div key={event.id} className="event-card-wrapper mb-4 animate__animated animate__fadeIn">
            <EventCard event={event} onActionComplete={refreshEvents} />
          </div>
        ))}
        {loading && page > 1 && (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        )}
        <div ref={ref} style={{ height: "20px" }}></div>
      </div>
    )
  }

  return (
    <div className={`homepage${theme === 'dark' ? ' dark' : ''}`}> 
      {/* Space Background */}
      <div className="space-background" ref={spaceBackgroundRef}>
        <canvas ref={starsCanvasRef} className="stars-canvas"></canvas>
        <div className="planet planet-1"></div>
        <div className="planet planet-2"></div>
        <div className="planet planet-3"></div>
        <div className="nebula"></div>
        <div ref={shootingStarRef}></div>
      </div>

      <Container fluid>
        <Row>
          {/* Left Sidebar */}
          <Col lg={3} className="d-none d-lg-block">
            <LeftSidebar currentUser={user} onFilterChange={handleFilterChange} currentFilters={filters} />
          </Col>

          {/* Main Content */}
          <Col lg={6} md={8} sm={12}>
            <div className="main-content">
              {/* Filter Bar */}
              <EventFilterBar
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              {/* Location Toast */}
              {showLocationToast && (
                <Toast 
                  onClose={handleLocationToastClose}
                  delay={5000} 
                  autohide
                  className="position-fixed top-0 end-0 m-3"
                  bg="warning"
                >
                  <Toast.Header>
                    <strong className="me-auto">Cập nhật địa chỉ</strong>
                  </Toast.Header>
                  <Toast.Body>
                    Vui lòng cập nhật địa chỉ của bạn trong hồ sơ để xem các sự kiện gần đây.
                    <div className="mt-2">
                      <div className="d-inline-block">
                        <Link to="/profile" className="text-decoration-none">
                          <Button 
                            variant="outline-dark" 
                            size="sm"
                            onClick={handleLocationUpdateClick}
                          >
                            Cập nhật ngay
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Toast.Body>
                </Toast>
              )}

              {/* Feed Title */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="feed-title">Bảng tin sự kiện</h2>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={refreshEvents}
                  disabled={loading}
                  className="refresh-btn"
                >
                  <ArrowClockwise className="me-1" /> Làm mới
                </Button>
              </div>

              {/* Main Content */}
              {renderContent()}
            </div>
          </Col>

          {/* Right Sidebar */}
          <Col lg={3} md={4} className="d-none d-md-block">
            <RightSidebar currentUser={user} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default HomePage
