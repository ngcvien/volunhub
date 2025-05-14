"use client"

// frontend/src/pages/EventDetailPage.tsx
import type React from "react"
import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Form, Container, Row, Col, Image as RBImage, Button, Spinner, Alert, Badge } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { uploadFileApi } from "../api/upload.api"
import {
  getEventByIdApi,
  joinEventApi,
  leaveEventApi,
  createEventPostApi,
  likeEventApi,
  unlikeEventApi,
} from "../api/event.api"
import type { EventType } from "../types/event.types"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  GeoAlt,
  Calendar2Event,
  PeopleFill,
  HandThumbsUp,
  HandThumbsUpFill,
  Share,
  BookmarkPlus,
  ChatLeftText,
  ArrowLeft,
  Star,
} from "react-bootstrap-icons"
import EventPostItem from "../components/Event/EventPostItem"
import { gsap } from "gsap"
import "./EventDetailPage.css"

// Ảnh mặc định
const defaultAvatar = "/default-avatar.png"
const placeholderImageUrl = "/placeholder-event.png"

// Hàm format (có thể đưa ra utils)
const formatEventDateTimeFull = (isoString: string): string => {
  try {
    return format(new Date(isoString), "HH:mm EEEE, dd/MM/yyyy", { locale: vi })
  } catch (e) {
    return "N/A"
  }
}

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Refs for animation
  const spaceBackgroundRef = useRef<HTMLDivElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)
  const planet1Ref = useRef<HTMLDivElement>(null)
  const planet2Ref = useRef<HTMLDivElement>(null)
  const planet3Ref = useRef<HTMLDivElement>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const postFileInputRef = useRef<HTMLInputElement>(null) // Ref cho input file ẩn
  const [postImageFile, setPostImageFile] = useState<File | null>(null) // File đã chọn
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null) // URL ảnh đã upload
  const [isUploadingPostImage, setIsUploadingPostImage] = useState(false) // Trạng thái upload ảnh
  const [postImageError, setPostImageError] = useState<string | null>(null) // Lỗi upload ảnh

  // State cho nút Join/Leave
  const [isProcessingJoin, setIsProcessingJoin] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  // State cho nút Like
  const [isProcessingLike, setIsProcessingLike] = useState(false)
  const [likeError, setLikeError] = useState<string | null>(null)
  const [displayLiked, setDisplayLiked] = useState(false)
  const [displayLikeCount, setDisplayLikeCount] = useState(0)

  // State cho bài viết mới
  const [newPostContent, setNewPostContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  const [showPostForm, setShowPostForm] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeMediaQuery.addEventListener("change", handleChange)
    return () => darkModeMediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Initialize space background
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
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 3000)

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05,
      })
    }

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Twinkle effect
        star.opacity += Math.random() * 0.01 - 0.005
        if (star.opacity < 0.1) star.opacity = 0.1
        if (star.opacity > 1) star.opacity = 1

        // Slow movement
        star.y += star.speed
        if (star.y > canvas.height) star.y = 0
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Create shooting stars
    const createShootingStar = () => {
      if (!spaceBackgroundRef.current) return

      const shootingStar = document.createElement("div")
      shootingStar.className = "event-shooting-star"
      spaceBackgroundRef.current.appendChild(shootingStar)

      // Random position and angle
      const startX = Math.random() * window.innerWidth
      const startY = Math.random() * (window.innerHeight / 2)
      const angle = Math.random() * 20 - 10 // -10 to 10 degrees variation

      shootingStar.style.top = `${startY}px`
      shootingStar.style.left = `${startX}px`
      shootingStar.style.transform = `rotate(${-45 + angle}deg)`

      // Animate with GSAP
      gsap.to(shootingStar, {
        x: 500,
        y: 500,
        opacity: 1,
        duration: 0.1,
        onComplete: () => {
          gsap.to(shootingStar, {
            x: 1000,
            y: 1000,
            opacity: 0,
            duration: 0.9,
            ease: "power1.in",
            onComplete: () => {
              if (shootingStar.parentNode) {
                shootingStar.parentNode.removeChild(shootingStar)
              }
            },
          })
        },
      })
    }

    // Create shooting stars periodically
    const shootingStarInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        // 30% chance each interval
        createShootingStar()
      }
    }, 3000)

    // Animate planets
    if (planet1Ref.current && planet2Ref.current && planet3Ref.current) {
      gsap.fromTo(
        planet1Ref.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 0.8, duration: 1.5, ease: "power2.out", delay: 0.2 },
      )
      gsap.fromTo(
        planet2Ref.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 0.8, duration: 1.5, ease: "power2.out", delay: 0.4 },
      )
      gsap.fromTo(
        planet3Ref.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 0.8, duration: 1.5, ease: "elastic.out(1, 0.5)", delay: 0.6 },
      )
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
      clearInterval(shootingStarInterval)
    }
  }, [])

  // Animate content when loaded
  useEffect(() => {
    if (!loading && event && mainContentRef.current && sidebarRef.current) {
      gsap.fromTo(
        mainContentRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      )
      gsap.fromTo(
        sidebarRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 },
      )
    }
  }, [loading, event])

  // Fetch dữ liệu chi tiết sự kiện
  const fetchEventDetail = async () => {
    if (!eventId) {
      setError("ID sự kiện không hợp lệ.")
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await getEventByIdApi(eventId)
      setEvent(response.event)
      setDisplayLiked(response.event.isLiked || false)
      setDisplayLikeCount(response.event.likeCount || 0)
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết sự kiện.")
    } finally {
      setLoading(false)
    }
  }

  // Xử lý đăng bài viết mới
  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !eventId || !newPostContent.trim()) {
      setPostError("Nội dung bài viết không được để trống.")
      return
    }
    // Kiểm tra nếu đang upload ảnh thì không cho submit
    if (isUploadingPostImage) {
      setPostError("Vui lòng chờ ảnh được tải lên hoàn tất.")
      return
    }

    setIsPosting(true)
    setPostError(null)
    try {
      // Chuẩn bị dữ liệu post, bao gồm cả imageUrl từ state
      const postData = {
        content: newPostContent,
        imageUrl: postImageUrl, // Gửi URL ảnh đã upload (có thể là null)
      }

      await createEventPostApi(eventId, postData) // Gọi API tạo post

      // Reset form và state ảnh
      setNewPostContent("")
      setPostImageFile(null)
      setPostImageUrl(null)
      setPostImageError(null)
      setShowPostForm(false) // Ẩn form sau khi đăng thành công

      // Animate success
      if (mainContentRef.current) {
        gsap.fromTo(
          mainContentRef.current,
          { y: 0 },
          { y: -10, duration: 0.2, ease: "power1.out", yoyo: true, repeat: 1 },
        )
      }

      // Fetch lại chi tiết sự kiện để cập nhật danh sách bài viết
      await fetchEventDetail()
    } catch (err: any) {
      setPostError(err.message || "Không thể đăng bài viết.")
    } finally {
      setIsPosting(false)
    }
  }

  useEffect(() => {
    fetchEventDetail()
  }, [eventId])

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""))
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [location.hash])

  useEffect(() => {
    if (location.hash === "#comments") {
      setShowPostForm(false)
      setTimeout(() => {
        const el = document.getElementById("comments")
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 200)
    }
  }, [location.hash])

  const handlePostImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setPostImageFile(file || null) // Lưu file (hoặc null)
    setPostImageUrl(null) // Reset URL cũ
    setPostImageError(null) // Reset lỗi cũ

    if (file) {
      // Hiển thị preview tạm thời (tùy chọn, có thể bỏ qua bước này)
      const previewUrl = URL.createObjectURL(file)
      setPostImageUrl(previewUrl) // Tạm thời hiển thị ảnh local

      setIsUploadingPostImage(true)
      try {
        const uploadResult = await uploadFileApi(file) // Gọi API upload chung
        setPostImageUrl(uploadResult.url) // Lưu URL từ Cloudinary
        console.log("Post Image uploaded:", uploadResult.url)
        // URL.revokeObjectURL(previewUrl); // Thu hồi preview nếu có dùng
      } catch (err: any) {
        setPostImageError(err.message || "Lỗi tải ảnh lên.")
        setPostImageFile(null) // Bỏ chọn file nếu lỗi
        // setPostImageUrl(null); // Đã reset ở trên
      } finally {
        setIsUploadingPostImage(false)
      }
    }
    // Reset input file để có thể chọn lại cùng file
    if (event.target) {
      event.target.value = ""
    }
  }

  // Hàm xử lý Tham gia sự kiện
  const handleJoin = async () => {
    if (!user || !event) return
    setIsProcessingJoin(true)
    setJoinError(null)
    try {
      await joinEventApi(event.id)
      setEvent({ ...event, isParticipating: true }) // Cập nhật UI ngay

      // Animation for success
      if (mainContentRef.current) {
        gsap.fromTo(
          ".event-actions-bar",
          { scale: 1 },
          { scale: 1.03, duration: 0.3, ease: "back.out(1.7)", yoyo: true, repeat: 1 },
        )
      }
    } catch (err: any) {
      setJoinError(err.message || "Lỗi khi tham gia.")
    } finally {
      setIsProcessingJoin(false)
    }
  }

  // Hàm xử lý Rời khỏi sự kiện
  const handleLeave = async () => {
    if (!user || !event) return
    setIsProcessingJoin(true)
    setJoinError(null)
    try {
      await leaveEventApi(event.id)
      setEvent({ ...event, isParticipating: false }) // Cập nhật UI ngay
    } catch (err: any) {
      setJoinError(err.message || "Lỗi khi rời sự kiện.")
    } finally {
      setIsProcessingJoin(false)
    }
  }

  // Xử lý thích/bỏ thích sự kiện
  const handleToggleLike = async () => {
    if (!user || !event) {
      if (!user) {
        alert("Vui lòng đăng nhập để thích sự kiện.")
        navigate("/login")
      }
      return
    }

    setIsProcessingLike(true)
    setLikeError(null)
    try {
      if (displayLiked) {
        await unlikeEventApi(event.id)
        setDisplayLiked(false)
        setDisplayLikeCount((prev) => prev - 1)
      } else {
        await likeEventApi(event.id)
        setDisplayLiked(true)
        setDisplayLikeCount((prev) => prev + 1)

        // Animation for like
        const stars = []
        for (let i = 0; i < 5; i++) {
          const star = document.createElement("div")
          star.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>'
          star.style.position = "absolute"
          star.style.color = "#FFD700"
          star.style.zIndex = "1000"
          document.body.appendChild(star)
          stars.push(star)

          // Random position around the like button
          const likeButton = document.querySelector(".like-button")
          if (likeButton) {
            const rect = likeButton.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            gsap.set(star, {
              x: centerX,
              y: centerY,
              scale: 0,
              opacity: 1,
            })

            gsap.to(star, {
              x: centerX + (Math.random() * 100 - 50),
              y: centerY + (Math.random() * 100 - 50),
              scale: Math.random() * 1 + 0.5,
              opacity: 0,
              duration: 1,
              ease: "power1.out",
              onComplete: () => {
                document.body.removeChild(star)
              },
            })
          }
        }
      }
    } catch (err: any) {
      setLikeError(err.message || "Không thể thích/bỏ thích sự kiện.")
    } finally {
      setIsProcessingLike(false)
    }
  }

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <Container className="py-4 text-center">
        <div className="event-space-background" ref={spaceBackgroundRef}>
          <canvas ref={starsCanvasRef} className="event-stars-canvas"></canvas>
          <div className="event-planet event-planet-1 event-float" ref={planet1Ref}></div>
          <div className="event-planet event-planet-2 event-float-reverse" ref={planet2Ref}></div>
          <div className="event-planet event-planet-3 event-float-slow" ref={planet3Ref}></div>
          <div className="event-space-fog"></div>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Đang tải thông tin sự kiện...</p>
        </div>
      </Container>
    )
  }

  // Hiển thị lỗi
  if (error || !event) {
    return (
      <Container className="py-3">
        <div className="event-space-background" ref={spaceBackgroundRef}>
          <canvas ref={starsCanvasRef} className="event-stars-canvas"></canvas>
          <div className="event-planet event-planet-1 event-float" ref={planet1Ref}></div>
          <div className="event-planet event-planet-2 event-float-reverse" ref={planet2Ref}></div>
          <div className="event-planet event-planet-3 event-float-slow" ref={planet3Ref}></div>
          <div className="event-space-fog"></div>
        </div>
        <Alert variant="danger" className="event-space-card">
          <Alert.Heading>Không thể tải sự kiện</Alert.Heading>
          <p>{error || "Không tìm thấy sự kiện."}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={() => navigate(-1)} className="event-space-button">
              <ArrowLeft className="me-2" /> Quay lại
            </Button>
            <Button variant="outline-primary" onClick={() => fetchEventDetail()} className="event-space-button">
              Thử lại
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <div className={`event-detail-space ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* Space Background */}
      <div className="event-space-background" ref={spaceBackgroundRef}>
        <canvas ref={starsCanvasRef} className="event-stars-canvas"></canvas>
        <div className="event-planet event-planet-1 event-float" ref={planet1Ref}></div>
        <div className="event-planet event-planet-2 event-float-reverse" ref={planet2Ref}></div>
        <div className="event-planet event-planet-3 event-float-slow" ref={planet3Ref}></div>
        <div className="event-space-fog"></div>
      </div>

      {/* Hero Section với ảnh nền */}
      <div className="event-hero-section">
        <div
          className="event-cover-image"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${
              event.images && event.images.length > 0 ? event.images[0].imageUrl : event.imageUrl || placeholderImageUrl
            })`,
          }}
        >
          <Container className="h-100 d-flex flex-column justify-content-end text-white py-4">
            <div className="mb-2 d-flex align-items-center flex-wrap">
              <Badge bg={new Date(event.eventTime) > new Date() ? "success" : "secondary"} className="me-2 py-1 px-2">
                {new Date(event.eventTime) > new Date() ? "Sắp diễn ra" : "Đã diễn ra"}
              </Badge>
              <div className="d-flex align-items-center">
                <Calendar2Event className="me-1" size={16} />
                <span>{formatEventDateTimeFull(event.eventTime)}</span>
              </div>
            </div>
            <h1 className="event-title-text">{event.title}</h1>
            <div className="d-flex align-items-center">
              <Link
                to={`/profile/${event.creator.id}`}
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <RBImage
                  src={event.creator.avatarUrl || defaultAvatar}
                  roundedCircle
                  width={40}
                  height={40}
                  className="me-2 border border-2 border-white"
                  style={{ objectFit: "cover" }}
                />
                <span>
                  Tổ chức bởi <strong>{event.creator.fullName || event.creator.username}</strong>
                </span>
              </Link>
            </div>
          </Container>
        </div>
      </div>

      <Container className="px-3">
        <Row className="g-4">
          {/* Cột chính */}
          <Col lg={8} className="mb-3" ref={mainContentRef}>
            {/* Nút tham gia và tương tác */}
            <div className="event-actions-bar mb-4">
              <div className="d-flex align-items-center mb-0">
                {user && (
                  <Button
                    variant={event.isParticipating ? "success" : "primary"}
                    onClick={event.isParticipating ? handleLeave : handleJoin}
                    disabled={isProcessingJoin}
                    className={`me-2 px-3 ${
                      event.isParticipating ? "event-space-button event-space-button-success" : "event-space-button"
                    }`}
                  >
                    {isProcessingJoin ? <Spinner size="sm" animation="border" className="me-1" /> : null}
                    {event.isParticipating ? "Đã tham gia" : "Tham gia"}
                  </Button>
                )}
                {!user && (
                  <Button variant="primary" as={Link} to="/login" className="me-2 px-3 event-space-button">
                    Đăng nhập
                  </Button>
                )}
                <div className="d-flex">
                  <Button
                    variant="light"
                    className="me-2 p-2 d-flex align-items-center event-space-button-light like-button"
                    onClick={handleToggleLike}
                    disabled={isProcessingLike}
                  >
                    {isProcessingLike ? (
                      <Spinner size="sm" animation="border" className="me-1" />
                    ) : displayLiked ? (
                      <HandThumbsUpFill className="text-primary" />
                    ) : (
                      <HandThumbsUp />
                    )}
                    <span className="ms-1">{displayLikeCount}</span>
                  </Button>
                  <Button variant="light" className="me-2 p-2 event-space-button-light">
                    <Share />
                  </Button>
                  <Button variant="light" className="p-2 event-space-button-light">
                    <BookmarkPlus />
                  </Button>
                </div>
              </div>
              <div className="event-participants-preview d-flex align-items-center">
                <div className="d-flex">
                  {event.participants &&
                    event.participants.slice(0, 3).map((participant, index) => (
                      <RBImage
                        key={participant.id}
                        src={participant.avatarUrl || defaultAvatar}
                        roundedCircle
                        width={30}
                        height={30}
                        className="event-participant-avatar"
                        style={{
                          marginLeft: index > 0 ? "-10px" : "0",
                        }}
                      />
                    ))}
                  {event.participants && event.participants.length > 3 && (
                    <div className="event-participants-count">+{event.participants.length - 3}</div>
                  )}
                </div>
                <span className="ms-2 text-muted">{event.participants?.length || 0} người tham gia</span>
              </div>
            </div>

            {joinError && (
              <Alert variant="danger" className="mb-3 py-2 event-space-card">
                {joinError}
              </Alert>
            )}

            {/* Thông tin chi tiết sự kiện */}
            <div className="event-space-card mb-4">
              <div className="event-space-card-header">
                <h5 className="mb-0">Thông tin chi tiết</h5>
              </div>
              <div className="event-space-card-body">
                <div className="event-details-section mb-3">
                  <div className="d-flex mb-3">
                    <div className="event-icon-wrapper">
                      <Calendar2Event size={20} />
                    </div>
                    <div>
                      <h6 className="mb-0">Thời gian</h6>
                      <p className="mb-0">{formatEventDateTimeFull(event.eventTime)}</p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="d-flex mb-3">
                      <div className="event-icon-wrapper">
                        <GeoAlt size={20} />
                      </div>
                      <div>
                        <h6 className="mb-0">Địa điểm</h6>
                        <p className="mb-0">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="d-flex">
                    <div className="event-icon-wrapper">
                      <PeopleFill size={20} />
                    </div>
                    <div>
                      <h6 className="mb-0">Người tham gia</h6>
                      <p className="mb-0">{event.participants?.length || 0} người đã tham gia</p>
                    </div>
                  </div>
                </div>

                <h5 className="mb-3">Mô tả</h5>
                <div className="event-description-text">
                  {event.description || <em className="text-muted">Không có mô tả chi tiết.</em>}
                </div>
              </div>
            </div>

            {/* Phần thảo luận */}
            <div className="event-space-card mb-4" id="comments">
              <div className="event-space-card-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Thảo luận</h5>
                  {user && !showPostForm && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        setShowPostForm(true)
                        // Animation
                        gsap.fromTo(
                          ".event-post-form",
                          { height: 0, opacity: 0 },
                          { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" },
                        )
                      }}
                      className="event-space-button"
                    >
                      <ChatLeftText className="me-1" /> Viết bài
                    </Button>
                  )}
                </div>
              </div>
              <div className="event-space-card-body">
                {/* Form đăng bài viết mới */}
                {user && showPostForm && (
                  <div className="event-post-form mb-4">
                    <div className="d-flex align-items-start mb-3">
                      <RBImage
                        src={user.avatarUrl || defaultAvatar}
                        roundedCircle
                        width={40}
                        height={40}
                        className="me-3 event-participant-avatar"
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">Đăng bài viết mới</h6>
                        <p className="text-muted mb-0">Chia sẻ thông tin hoặc đặt câu hỏi</p>
                      </div>
                    </div>

                    <Form onSubmit={handlePostSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Viết bài viết của bạn..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          disabled={isPosting}
                          required
                          className="event-space-textarea"
                        />
                      </Form.Group>

                      <Form.Group controlId="postImageUpload" className="mb-3">
                        {/* Input file ẩn */}
                        <Form.Control
                          type="file"
                          accept="image/*"
                          ref={postFileInputRef}
                          onChange={handlePostImageChange}
                          style={{ display: "none" }}
                          disabled={isUploadingPostImage || isPosting}
                        />
                        {/* Nút bấm để mở cửa sổ chọn file */}
                        {!postImageUrl && !isUploadingPostImage && (
                          <Button
                            variant="outline-secondary"
                            className="event-space-button-light"
                            onClick={() => postFileInputRef.current?.click()}
                            disabled={isUploadingPostImage || isPosting}
                          >
                            <i className="bi bi-image me-1"></i> Thêm ảnh
                          </Button>
                        )}

                        {/* Hiển thị trạng thái Upload */}
                        {isUploadingPostImage && (
                          <div className="mt-2">
                            <Spinner size="sm" /> Đang tải ảnh...
                          </div>
                        )}
                        {postImageError && (
                          <Alert variant="danger" className="mt-2 py-1">
                            {postImageError}
                          </Alert>
                        )}

                        {/* Hiển thị Ảnh Preview và nút Xóa */}
                        {postImageUrl && !postImageError && (
                          <div className="event-image-preview">
                            <RBImage src={postImageUrl} alt="Preview" fluid />
                            <Button
                              className="event-remove-image-btn"
                              onClick={() => {
                                setPostImageUrl(null)
                                setPostImageFile(null)
                              }}
                              disabled={isPosting}
                              title="Xóa ảnh"
                            >
                              &times;
                            </Button>
                          </div>
                        )}
                      </Form.Group>

                      {postError && (
                        <Alert variant="danger" className="py-1 mb-3 small">
                          {postError}
                        </Alert>
                      )}

                      <div className="d-flex justify-content-end">
                        <Button
                          variant="outline-secondary"
                          className="me-2 event-space-button-light"
                          onClick={() => {
                            // Animation
                            gsap.to(".event-post-form", {
                              height: 0,
                              opacity: 0,
                              duration: 0.5,
                              ease: "power2.in",
                              onComplete: () => {
                                setShowPostForm(false)
                                setNewPostContent("")
                              },
                            })
                          }}
                          disabled={isPosting}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isPosting || !newPostContent.trim()}
                          className="event-space-button"
                        >
                          {isPosting ? <Spinner size="sm" animation="border" className="me-1" /> : null}
                          Đăng bài
                        </Button>
                      </div>
                    </Form>
                  </div>
                )}

                {/* Danh sách bài viết */}
                <div className="event-posts">
                  {event.posts && event.posts.length > 0 ? (
                    event.posts.map((post, index) => (
                      <div
                        key={post.id}
                        className="post-item"
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        ref={(el) => {
                          if (el && !el.classList.contains("animated")) {
                            el.classList.add("animated")
                            gsap.fromTo(
                              el,
                              { y: 20, opacity: 0 },
                              { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: "power2.out" },
                            )
                          }
                        }}
                      >
                        <EventPostItem post={post} eventCreatorId={event.creator.id} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <ChatLeftText size={40} className="text-muted mb-3" />
                      <h5>Chưa có bài viết nào</h5>
                      <p className="text-muted mb-3">Hãy là người đầu tiên chia sẻ thông tin hoặc đặt câu hỏi.</p>
                      {user && !showPostForm && (
                        <Button
                          variant="primary"
                          onClick={() => {
                            setShowPostForm(true)
                            // Animation
                            gsap.fromTo(
                              ".event-post-form",
                              { height: 0, opacity: 0 },
                              { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" },
                            )
                          }}
                          className="event-space-button"
                        >
                          Viết bài đầu tiên
                        </Button>
                      )}
                      {!user && (
                        <Button variant="primary" as={Link} to="/login" className="event-space-button">
                          Đăng nhập để viết bài
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4} ref={sidebarRef}>
            <div className="event-sidebar-section">
              {/* Thông tin người tổ chức */}
              <div className="event-space-card mb-4">
                <div className="event-space-card-header">
                  <h5 className="mb-0">Người tổ chức</h5>
                </div>
                <div className="event-space-card-body">
                  <div className="event-organizer-card">
                    <Link to={`/profile/${event.creator.id}`}>
                      <RBImage
                        src={event.creator.avatarUrl || defaultAvatar}
                        roundedCircle
                        className="event-organizer-avatar"
                      />
                    </Link>
                    <div>
                      <h6 className="mb-1">
                        <Link to={`/profile/${event.creator.id}`} className="text-decoration-none">
                          {event.creator.fullName || event.creator.username}
                        </Link>
                      </h6>
                      <p className="text-muted mb-0">@{event.creator.username}</p>
                      {user && user.id !== event.creator.id && (
                        <div className="mt-2 d-flex">
                          <Button variant="outline-primary" className="me-2 event-space-button-light" size="sm">
                            Theo dõi
                          </Button>
                          <Button variant="outline-primary" className="event-space-button-light" size="sm">
                            Nhắn tin
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách người tham gia */}
              <div className="event-space-card mb-4">
                <div className="event-space-card-header">
                  <h5 className="mb-0">Người tham gia ({event.participants?.length || 0})</h5>
                </div>
                <div className="event-space-card-body p-0">
                  {event.participants && event.participants.length > 0 ? (
                    <div className="event-participants-list">
                      {event.participants.slice(0, 5).map((participant, index) => (
                        <Link
                          key={participant.id}
                          to={`/profile/${participant.id}`}
                          className="event-participant-item text-decoration-none"
                          ref={(el) => {
                            if (el && !el.classList.contains("animated")) {
                              el.classList.add("animated")
                              gsap.fromTo(
                                el,
                                { x: -20, opacity: 0 },
                                { x: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: "power2.out" },
                              )
                            }
                          }}
                        >
                          <RBImage
                            src={participant.avatarUrl || defaultAvatar}
                            roundedCircle
                            width={40}
                            height={40}
                            className="me-3 event-participant-avatar"
                          />
                          <div>
                            <h6 className="mb-0">{participant.fullName || participant.username}</h6>
                            <p className="text-muted mb-0 small">@{participant.username}</p>
                          </div>
                        </Link>
                      ))}

                      {event.participants.length > 5 && (
                        <div className="text-center p-3">
                          <Button variant="link" className="event-space-button-light">
                            Xem tất cả {event.participants.length} người tham gia
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">Chưa có người tham gia.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sự kiện liên quan */}
              <div className="event-space-card">
                <div className="event-space-card-header">
                  <h5 className="mb-0">Sự kiện liên quan</h5>
                </div>
                <div className="event-space-card-body">
                  <div className="text-center py-3">
                    <div className="mb-3">
                      <Star size={40} className="text-muted" />
                    </div>
                    <p className="text-muted mb-0">Chức năng đang được phát triển.</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EventDetailPage
