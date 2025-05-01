// frontend/src/components/Event/EventCard.tsx

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, Button, Spinner, Alert, Image, Badge, OverlayTrigger, Tooltip, Overlay } from "react-bootstrap"
import { Link } from "react-router-dom"
import type { EventType } from "../../types/event.types"
import { useAuth } from "../../contexts/AuthContext"
import { joinEventApi, leaveEventApi, likeEventApi, unlikeEventApi } from "../../api/event.api"
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
import UserPopup from "../User/UserPopup"
import { useNavigate } from "react-router-dom";


// Ảnh mặc định
const defaultAvatar = '/default-avatar.png'; // Đảm bảo file này có trong /public
const placeholderImageUrl = '/placeholder-event.png'; // Đảm bảo file này có trong /public

interface EventCardProps {
  event: EventType;
  onActionComplete?: () => void; // Callback để báo cho HomePage refresh
}

const EventCard: React.FC<EventCardProps> = ({ event, onActionComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State cho các hành động Join/Leave/Like...
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [displayParticipating, setDisplayParticipating] = useState(event.isParticipating ?? false);

  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  // State cục bộ để hiển thị trạng thái like, khởi tạo từ prop
  const [displayLiked, setDisplayLiked] = useState(event.isLiked ?? false);

  // State và Ref cho User Popup
  const [showUserPopup, setShowUserPopup] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null); // Ref cho vùng trigger (avatar + tên)
  const popupTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref cho timer ẩn/hiện popup

  const [displayLikeCount, setDisplayLikeCount] = useState(event.likeCount || 0);

  useEffect(() => {
    setDisplayLikeCount(event.likeCount || 0);
  }, [event.likeCount]);
  // Effect cập nhật trạng thái tham gia hiển thị khi prop thay đổi
  useEffect(() => {
    setDisplayParticipating(event.isParticipating ?? false);
  }, [event.isParticipating]);

  useEffect(() => {
    setDisplayLiked(event.isLiked ?? false);
    // Cập nhật displayLikeCount nếu backend trả về likeCount
    // setDisplayLikeCount(event.likeCount || 0);
  }, [event.isLiked /*, event.likeCount */]);

  // Hàm xử lý Tham gia sự kiện
  const handleJoin = async () => {
    if (!user) return;
    setIsLoadingAction(true);
    setActionError(null);
    try {
      await joinEventApi(event.id);
      setDisplayParticipating(true); // Cập nhật UI ngay
      // onActionComplete?.(); 
    } catch (err: any) {
      setActionError(err.message || "Lỗi khi tham gia.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  // Hàm xử lý Rời khỏi sự kiện
  const handleLeave = async () => {
    if (!user) return;
    setIsLoadingAction(true);
    setActionError(null);
    try {
      await leaveEventApi(event.id);
      setDisplayParticipating(false); // Cập nhật UI ngay
      // onActionComplete?.(); 
    } catch (err: any) {
      setActionError(err.message || "Lỗi khi rời sự kiện.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thích sự kiện.");
      navigate("/auth");
      return;
    }

    setIsLoadingLike(true);
    setLikeError(null);
    const currentLikedStatus = displayLiked;

    try {
      if (currentLikedStatus) {
        await unlikeEventApi(event.id);
        setDisplayLiked(false);
        setDisplayLikeCount((prev) => prev - 1); // cập nhật ngay
      } else {
        await likeEventApi(event.id);
        setDisplayLiked(true);
        setDisplayLikeCount((prev) => prev + 1); // cập nhật ngay
      }
      // Không cần gọi onActionComplete ở đây nữa
    } catch (err: any) {
      setActionError(err.message || `Lỗi khi ${currentLikedStatus ? 'bỏ thích' : 'thích'} sự kiện.`);
    } finally {
      setIsLoadingLike(false);
    }
  };

  // --- Logic xử lý Hover cho User Popup ---
  const handleMouseEnterTriggerOrPopup = () => {
    if (popupTimerRef.current) {
      clearTimeout(popupTimerRef.current); // Xóa timer ẩn đang chờ (nếu có)
      popupTimerRef.current = null;
    }
    setShowUserPopup(true); // Hiển thị popup ngay
  };

  const handleMouseLeaveTriggerOrPopup = () => {
    // Đặt timer để ẩn popup sau một khoảng trễ ngắn
    popupTimerRef.current = setTimeout(() => {
      setShowUserPopup(false);
    }, 200); // 200ms trễ trước khi ẩn
  };
  // --- Kết thúc Logic Hover ---

  // --- Các hàm Format thời gian ---
  const formatTimeAgo = (isoString: string): string => {
    try {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi });
    } catch (e) { return isoString; }
  };
  const formatEventDate = (isoString: string): string => {
    try {
      return format(new Date(isoString), "EEEE, dd/MM/yyyy", { locale: vi });
    } catch (e) { return "Ngày không hợp lệ"; }
  };
  const formatEventTime = (isoString: string): string => {
    try {
      return format(new Date(isoString), "HH:mm", { locale: vi });
    } catch (e) { return "Giờ không hợp lệ"; }
  };
  const getTimeRemaining = (isoString: string): string => {
    try {
      const eventDate = new Date(isoString);
      const now = new Date();
      if (eventDate < now) return "Đã diễn ra";
      const diffTime = eventDate.getTime() - now.getTime(); // Chỉ cần hiệu số dương
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 30) return `Còn ~${Math.floor(diffDays / 30)} tháng`;
      if (diffDays > 0) return `Còn ${diffDays} ngày`;
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours > 0) return `Còn ${diffHours} giờ`;
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      if (diffMinutes > 0) return `Còn ${diffMinutes} phút`;
      return "Sắp diễn ra";
    } catch (e) { return ""; }
  };
  const getEventStatusBadge = (isoString: string) => {
    try {
      const eventDate = new Date(isoString);
      const now = new Date();
      if (eventDate < now) return <Badge bg="secondary">Đã diễn ra</Badge>;
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) return <Badge bg="danger">Hôm nay/Ngày mai</Badge>; // Sửa logic
      if (diffDays <= 7) return <Badge bg="warning" text="dark">Tuần này</Badge>;
      return <Badge bg="info">Sắp tới</Badge>;
    } catch (e) { return <Badge bg="light" text="dark">Không xác định</Badge>; } // Sửa màu badge
  };
  // --- Kết thúc Các hàm Format thời gian ---


  return (
    <Card className="event-card shadow-sm mb-4"> {/* Thêm mb-4 nếu muốn khoảng cách giữa các card */}
      {/* Card Header */}
      <Card.Header className="bg-transparent border-0 pt-3 pb-0">
        <div className="d-flex align-items-center text-start">
          {/* Vùng Trigger cho Popup (bao gồm Avatar và Tên) */}
          <span
            ref={triggerRef}
            onMouseEnter={handleMouseEnterTriggerOrPopup}
            onMouseLeave={handleMouseLeaveTriggerOrPopup}
            className="d-inline-flex align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <Link to={`/profile/${event.creator?.id || ""}`} className="me-2" tabIndex={-1}>
              <Image
                src={event.creator?.avatarUrl || defaultAvatar}
                alt={event.creator?.username}
                roundedCircle
                className="creator-avatar"
                width={40}
                height={40}
                style={{ objectFit: 'cover', pointerEvents: 'none' }}
              />
            </Link>
            <div className="flex-grow-1">
              <Link
                to={`/profile/${event.creator?.id || ""}`}
                className="creator-name text-decoration-none" // Cần style cho class này trong CSS
                style={{ pointerEvents: 'none' }}
              >
                {event.creator?.fullName || event.creator?.username || "Người dùng ẩn"} {/* Bỏ @ nếu muốn */}
              </Link>
              <div className="text-muted small d-flex align-items-center">
                <span>{formatTimeAgo(event.createdAt)}</span>
              </div>
            </div>
          </span>
          {/* Kết thúc Vùng Trigger */}

          <div className="flex-grow-1"></div> {/* Đẩy Badge sang phải */}
          {getEventStatusBadge(event.eventTime)}
        </div>
      </Card.Header>

      {/* User Popup Overlay */}
      <Overlay
        show={showUserPopup}
        target={triggerRef.current}
        placement="bottom-start"
        container={document.body}
        popperConfig={{ modifiers: [{ name: 'offset', options: { offset: [0, 8] } }] }}
      >
        {({ ...props }) => (
          <div
            {...props}
            onMouseEnter={handleMouseEnterTriggerOrPopup} // Giữ popup khi hover vào nó
            onMouseLeave={handleMouseLeaveTriggerOrPopup} // Đặt timer ẩn khi rời nó
            style={{
              ...props.style,
              // Có thể thêm style cho popup ở đây hoặc trong UserPopup.css
              zIndex: 1080 // Đảm bảo nổi lên trên
            }}
          >
            {/* --- Component UserPopup --- */}
            {/* Đảm bảo component này tồn tại và nhận đúng props */}
            <UserPopup
              userId={event.creator?.id || 0} // Cần kiểm tra userId=0 có hợp lệ không
              // Truyền các props cần thiết khác mà UserPopup cần
              username={event.creator?.username || 'Người dùng ẩn'}
              avatarUrl={event.creator?.avatarUrl}
              fullName={event.creator?.fullName}
            // bio={event.creator?.bio} 
            />

          </div>
        )}
      </Overlay>

      {/* Card Body */}
      <Card.Body className="pt-2 pb-3"> {/* Giảm padding top */}
        

        <div className="event-meta mb-3">
          <div className="d-flex align-items-center mb-1">
            <Calendar2Event className="event-icon text-primary me-2" />
            <span>{formatEventDate(event.eventTime)}</span>
            <span className="time-remaining ms-2">{getTimeRemaining(event.eventTime)}</span>
          </div>
          <div className="time-and-location">
            <div className="d-flex justify-content-end align-items-center mb-1">
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
        </div>
        <Link to={`/events/${event.id}`} className="event-title-link text-decoration-none">
          <h5 className="event-title mb-3">{event.title}</h5> 
        </Link>

        {event.description && (
          <div className="event-description mb-3">
            <p className="mb-0">{event.description}</p>
          </div>
        )}
      </Card.Body>

      {/* Card Image (Nếu có) */}
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

      {/* Card Footer */}
      <Card.Footer className="bg-transparent pt-0 pb-3">
        {(actionError || likeError) && (
          <Alert variant="danger" size="sm" className="mb-2 py-1" onClose={() => { setActionError(null); setLikeError(null); }} dismissible>
            {actionError || likeError}
          </Alert>
        )}
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
            <OverlayTrigger placement="top" overlay={<Tooltip>{displayLiked ? "Bỏ thích" : "Thích"}</Tooltip>}>
              <Button
                type="button"
                variant="light" // Giữ variant light
                size="sm"
                className="action-button d-flex align-items-center  me-2 mb-1 like-button"
                onClick={handleLike} // Gắn hàm xử lý mới
                disabled={isLoadingLike} // Disable khi đang xử lý Like 
              >
                {isLoadingLike ? <Spinner size="sm" animation="border" variant="primary" /> :
                  (displayLiked ? <HandThumbsUpFill className="text-primary me-1" /> : <HandThumbsUp className="me-1" />) // Icon thay đổi theo displayLiked
                }
                {/* Hiển thị likeCount từ prop event (hoặc 0 nếu chưa có) */}
                <span className="small ms-1">{displayLikeCount || 0}</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger placement="top" overlay={<Tooltip>Bình luận</Tooltip>}>
              <Button variant="light" size="sm" className="action-button me-1 mb-2" onClick={() => navigate(`/events/${event.id}#comments`)}>
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
  );
};

export default EventCard;