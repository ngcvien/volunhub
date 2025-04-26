"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, Button, Spinner, Alert, Image, Badge, OverlayTrigger, Tooltip } from "react-bootstrap"
import { Link } from "react-router-dom"
import type { EventType } from "../../types/event.types"
import { useAuth } from "../../contexts/AuthContext"
import { joinEventApi, leaveEventApi } from "../../api/event.api"
import { formatDistanceToNow, format } from "date-fns"
import { vi } from "date-fns/locale"
import {
  GeoAlt,
  Calendar2Event,
  Clock,
  PersonCheck,
  Share,
  ChatLeftText,
  BookmarkPlus,
  HandThumbsUp,
  HandThumbsUpFill,
} from "react-bootstrap-icons"
import "./EventCard.css"

// Ảnh mặc định
const defaultAvatar = "/default-avatar.png"
const placeholderImageUrl = "/placeholder-event.png"

interface EventCardProps {
  event: EventType
  onActionComplete?: () => void
}

const EventCard: React.FC<EventCardProps> = ({ event, onActionComplete }) => {
  const { user } = useAuth()
  const [isLoadingAction, setIsLoadingAction] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [displayParticipating, setDisplayParticipating] = useState(event.isParticipating ?? false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 20))

  useEffect(() => {
    setDisplayParticipating(event.isParticipating ?? false)
  }, [event.isParticipating]);

  const handleJoin = async () => {
    if (!user) return
    setIsLoadingAction(true)
    setActionError(null)
    try {
      await joinEventApi(event.id)
      setDisplayParticipating(true)
    //   onActionComplete?.()
    } catch (err: any) {
      setActionError(err.message || "Lỗi khi tham gia.")
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleLeave = async () => {
    if (!user) return
    setIsLoadingAction(true)
    setActionError(null)
    try {
      await leaveEventApi(event.id)
      setDisplayParticipating(false)
    //   onActionComplete?.()
    } catch (err: any) {
      setActionError(err.message || "Lỗi khi rời sự kiện.")
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  // Format thời gian kiểu "x phút trước", "y giờ trước"...
  const formatTimeAgo = (isoString: string): string => {
    try {
      const date = new Date(isoString)
      return formatDistanceToNow(date, { addSuffix: true, locale: vi })
    } catch (e) {
      return isoString
    }
  }

  // Format ngày và giờ sự kiện
  const formatEventDate = (isoString: string): string => {
    try {
      const date = new Date(isoString)
      return format(date, "EEEE, dd/MM/yyyy", { locale: vi })
    } catch (e) {
      return "Ngày không hợp lệ"
    }
  }

  const formatEventTime = (isoString: string): string => {
    try {
      const date = new Date(isoString)
      return format(date, "HH:mm", { locale: vi })
    } catch (e) {
      return "Giờ không hợp lệ"
    }
  }

  // Tính thời gian còn lại đến sự kiện
  const getTimeRemaining = (isoString: string): string => {
    try {
      const eventDate = new Date(isoString)
      const now = new Date()

      if (eventDate < now) {
        return "Đã diễn ra"
      }

      const diffTime = Math.abs(eventDate.getTime() - now.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 30) {
        const diffMonths = Math.floor(diffDays / 30)
        return `Còn ${diffMonths} tháng`
      } else if (diffDays > 0) {
        return `Còn ${diffDays} ngày`
      } else {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
        if (diffHours > 0) {
          return `Còn ${diffHours} giờ`
        } else {
          const diffMinutes = Math.floor(diffTime / (1000 * 60))
          return `Còn ${diffMinutes} phút`
        }
      }
    } catch (e) {
      return ""
    }
  }

  // Tạo badge trạng thái sự kiện
  const getEventStatusBadge = (isoString: string) => {
    try {
      const eventDate = new Date(isoString)
      const now = new Date()

      if (eventDate < now) {
        return <Badge bg="secondary">Đã diễn ra</Badge>
      }

      const diffTime = Math.abs(eventDate.getTime() - now.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 3) {
        return <Badge bg="danger">Sắp diễn ra</Badge>
      } else if (diffDays <= 7) {
        return (
          <Badge bg="warning" text="dark">
            Tuần này
          </Badge>
        )
      } else {
        return <Badge bg="info">Sắp tới</Badge>
      }
    } catch (e) {
      return <Badge bg="secondary">Không xác định</Badge>
    }
  }

  return (
    <Card className="event-card shadow-sm ">
      {/* Card Header - Thông tin người đăng */}
      <Card.Header className="bg-transparent border-0 pt-3 pb-0">
        <div className="d-flex align-items-center text-start">
          <Link to={`/profile/${event.creator?.id || ""}`} className="me-2">
            <Image
              src={event.creator?.avatarUrl || defaultAvatar}
              alt={event.creator?.username}
              roundedCircle
              className="creator-avatar"
              width={40}
              height={40}
            />
          </Link>
          <div className="flex-grow-1">
            <Link to={`/profile/${event.creator?.id || ""}`} className="creator-name text-decoration-none">
              @{ event.creator?.username || "Người dùng ẩn"}
            </Link>
            <div className="text-muted small d-flex align-items-center">
              <span>{formatTimeAgo(event.createdAt)}</span>
              
            </div>
          </div>
          {getEventStatusBadge(event.eventTime)}
        </div>
      </Card.Header>

      {/* Card Body - Nội dung sự kiện */}
      <Card.Body className="pt-3">
        {/* Tiêu đề sự kiện */}
        <Link to={`/events/${event.id}`} className="event-title-link">
          <h5 className="event-title mb-2">{event.title}</h5>
        </Link>

        {/* Thông tin thời gian và địa điểm */}
        <div className="event-meta mb-3">
          <div className="d-flex align-items-center mb-1">
            <Calendar2Event className="event-icon text-primary me-2" />
            <span>{formatEventDate(event.eventTime)}</span>
            <span className="time-remaining ms-2">{getTimeRemaining(event.eventTime)}</span>
          </div>
          <div className="d-flex align-items-center mb-1">
            <Clock className="event-icon text-primary me-2" />
            <span>{formatEventTime(event.eventTime)}</span>
          </div>
          {event.location && (
            <div className="d-flex align-items-center">
              <GeoAlt className="event-icon text-primary me-2" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {/* Mô tả sự kiện */}
        {event.description && (
          <div className="event-description mb-3">
            <p className="mb-0">{event.description}</p>
          </div>
        )}

        {/* Ảnh sự kiện */}
        {event.imageUrl && (
          <div className="event-image-container mb-3">
            <Image
              src={event.imageUrl || "/placeholder.svg"}
              alt={event.title}
              fluid
              className="event-image"
              onClick={() => window.open(event.imageUrl, "_blank")}
            />
          </div>
        )}

        {/* Hiển thị lỗi */}
        {actionError && (
          <Alert variant="danger" className="py-2 mt-2" onClose={() => setActionError(null)} dismissible>
            {actionError}
          </Alert>
        )}
      </Card.Body>

      {/* Card Footer - Các nút tương tác */}
      <Card.Footer className="bg-transparent pt-0 pb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          {/* Nút tham gia/rời khỏi */}
          {user && (
            <Button
              variant={displayParticipating ? "outline-danger" : "success"}
              size="sm"
              onClick={displayParticipating ? handleLeave : handleJoin}
              disabled={isLoadingAction}
              className="participation-button me-2 mb-2"
            >
              {isLoadingAction ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <PersonCheck className="me-1" />
                  {displayParticipating ? "Rời khỏi" : "Tham gia"}
                </>
              )}
            </Button>
          )}

          {/* Các nút tương tác khác */}
          <div className="d-flex">
            <OverlayTrigger placement="top" overlay={<Tooltip>{liked ? "Bỏ thích" : "Thích"}</Tooltip>}>
              <Button variant="light" size="sm" className="action-button me-1 mb-2 d-flex justify-content-between p-1" onClick={handleLike}>
                {liked ? <HandThumbsUpFill className="text-primary" /> : <HandThumbsUp />}
                <span className="ms-1">{likeCount}</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={<Tooltip>Bình luận</Tooltip>}>
              <Button variant="light" size="sm" className="action-button me-1 mb-2">
                <ChatLeftText />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={<Tooltip>Chia sẻ</Tooltip>}>
              <Button variant="light" size="sm" className="action-button me-1 mb-2">
                <Share />
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={<Tooltip>Lưu</Tooltip>}>
              <Button variant="light" size="sm" className="action-button mb-2">
                <BookmarkPlus />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default EventCard
