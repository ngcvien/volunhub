"use client"

// frontend/src/pages/EventDetailPage.tsx
import type React from "react"
import { useState, useEffect, useRef, ChangeEvent } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Form, Container, Row, Col, Card, Image as RBImage, Button, Spinner, Alert, Badge } from "react-bootstrap"
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
} from "react-bootstrap-icons"
import EventPostItem from "../components/Event/EventPostItem"

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

  const postFileInputRef = useRef<HTMLInputElement>(null); // Ref cho input file ẩn
  const [postImageFile, setPostImageFile] = useState<File | null>(null); // File đã chọn
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null); // URL ảnh đã upload
  const [isUploadingPostImage, setIsUploadingPostImage] = useState(false); // Trạng thái upload ảnh
  const [postImageError, setPostImageError] = useState<string | null>(null); // Lỗi upload ảnh

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
    e.preventDefault();
    if (!user || !eventId || !newPostContent.trim()) {
      setPostError("Nội dung bài viết không được để trống.");
      return;
    }
    // Kiểm tra nếu đang upload ảnh thì không cho submit
    if (isUploadingPostImage) {
      setPostError("Vui lòng chờ ảnh được tải lên hoàn tất.");
      return;
    }

    setIsPosting(true); // Đổi tên state loading chính thành isPosting (như code trước)
    setPostError(null);
    try {
      // Chuẩn bị dữ liệu post, bao gồm cả imageUrl từ state
      const postData = {
        content: newPostContent,
        imageUrl: postImageUrl // <<<--- Gửi URL ảnh đã upload (có thể là null)
      };

      await createEventPostApi(eventId, postData); // Gọi API tạo post

      // Reset form và state ảnh
      setNewPostContent('');
      setPostImageFile(null);
      setPostImageUrl(null);
      setPostImageError(null);
      setShowPostForm(false); // Ẩn form sau khi đăng thành công

      // Fetch lại chi tiết sự kiện để cập nhật danh sách bài viết
      await fetchEventDetail();

    } catch (err: any) {
      setPostError(err.message || 'Không thể đăng bài viết.');
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    fetchEventDetail()
  }, [eventId]);

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  useEffect(() => {
    if (location.hash === "#comments") {

      setShowPostForm(false);
      setTimeout(() => {
        const el = document.getElementById("comments");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    }
  }, [location.hash]);

  const handlePostImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPostImageFile(file || null); // Lưu file (hoặc null)
    setPostImageUrl(null);      // Reset URL cũ
    setPostImageError(null);    // Reset lỗi cũ

    if (file) {
      // Hiển thị preview tạm thời (tùy chọn, có thể bỏ qua bước này)
      const previewUrl = URL.createObjectURL(file);
      setPostImageUrl(previewUrl); // Tạm thời hiển thị ảnh local

      setIsUploadingPostImage(true);
      try {
        const uploadResult = await uploadFileApi(file); // Gọi API upload chung
        setPostImageUrl(uploadResult.url); // Lưu URL từ Cloudinary
        console.log('Post Image uploaded:', uploadResult.url);
        // URL.revokeObjectURL(previewUrl); // Thu hồi preview nếu có dùng
      } catch (err: any) {
        setPostImageError(err.message || 'Lỗi tải ảnh lên.');
        setPostImageFile(null); // Bỏ chọn file nếu lỗi
        // setPostImageUrl(null); // Đã reset ở trên
      } finally {
        setIsUploadingPostImage(false);
      }
    }
    // Reset input file để có thể chọn lại cùng file
    if (event.target) {
      event.target.value = '';
    }
  };

  // Hàm xử lý Tham gia sự kiện
  const handleJoin = async () => {
    if (!user || !event) return
    setIsProcessingJoin(true)
    setJoinError(null)
    try {
      await joinEventApi(event.id)
      setEvent({ ...event, isParticipating: true }) // Cập nhật UI ngay
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
        <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted">Đang tải thông tin sự kiện...</p>
      </Container>
    )
  }

  // Hiển thị lỗi
  if (error || !event) {
    return (
      <Container className="py-3">
        <Alert variant="danger">
          <Alert.Heading>Không thể tải sự kiện</Alert.Heading>
          <p>{error || "Không tìm thấy sự kiện."}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <Button variant="outline-danger" onClick={() => navigate(-1)}>
              <ArrowLeft className="me-2" /> Quay lại
            </Button>
            <Button variant="outline-primary" onClick={() => fetchEventDetail()}>
              Thử lại
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  return (
    <div className="event-detail-page">
      {/* Hero Section với ảnh nền */}
      <div className="event-hero position-relative mb-3 mb-md-4">
        <div
          className="event-cover"
          style={{
            height: "200px", // Giảm chiều cao trên mobile
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${event.imageUrl || placeholderImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Container className="h-100 d-flex flex-column justify-content-end text-white py-2 py-md-4">
            <div className="mb-1 mb-md-2 d-flex align-items-center flex-wrap">
              <Badge bg={new Date(event.eventTime) > new Date() ? "success" : "secondary"} className="me-2 py-1 px-2">
                {new Date(event.eventTime) > new Date() ? "Sắp diễn ra" : "Đã diễn ra"}
              </Badge>
              <div className="d-flex align-items-center">
                <Calendar2Event className="me-1" size={14} />
                <span className="small">{formatEventDateTimeFull(event.eventTime)}</span>
              </div>
            </div>
            <h1 className="event-title fw-bold mb-2" style={{ fontSize: "1.5rem" }}>
              {event.title}
            </h1>
            <div className="d-flex align-items-center">
              <Link
                to={`/profile/${event.creator.id}`}
                className="d-flex align-items-center text-white text-decoration-none"
              >
                <RBImage
                  src={event.creator.avatarUrl || defaultAvatar}
                  roundedCircle
                  width={28}
                  height={28}
                  className="me-2 border border-2 border-white"
                  style={{ objectFit: "cover" }}
                />
                <span className="small">
                  Tổ chức bởi <strong>{event.creator.fullName || event.creator.username}</strong>
                </span>
              </Link>
            </div>
          </Container>
        </div>
      </div>

      <Container className="px-2 px-md-3">
        <Row className="g-2 g-md-4">
          {/* Cột chính */}
          <Col lg={8} className="mb-3">
            {/* Nút tham gia và tương tác */}
            <div className="event-actions d-flex flex-wrap align-items-center justify-content-between mb-3 p-2 p-md-3 bg-body-tertiary rounded-3">
              <div className="d-flex align-items-center mb-0">
                {user && (
                  <Button
                    variant={event.isParticipating ? "outline-danger" : "success"}
                    onClick={event.isParticipating ? handleLeave : handleJoin}
                    disabled={isProcessingJoin}
                    className="me-2 px-2 px-md-3"
                    size="sm"
                  >
                    {isProcessingJoin ? <Spinner size="sm" animation="border" className="me-1" /> : null}
                    {event.isParticipating ? "Rời khỏi" : "Tham gia"}
                  </Button>
                )}
                {!user && (
                  <Button variant="primary" as={Link} to="/login" className="me-2 px-2 px-md-3" size="sm">
                    Đăng nhập
                  </Button>
                )}
                <div className="d-flex">
                  <Button
                    variant="light"
                    className="me-1 p-1 p-md-2 d-flex align-items-center"
                    onClick={handleToggleLike}
                    disabled={isProcessingLike}
                    size="sm"
                  >
                    {isProcessingLike ? (
                      <Spinner size="sm" animation="border" className="me-1" />
                    ) : displayLiked ? (
                      <HandThumbsUpFill className="text-primary" />
                    ) : (
                      <HandThumbsUp />
                    )}
                    <span className="ms-1 d-none d-sm-inline">{displayLikeCount}</span>
                  </Button>
                  <Button variant="light" className="me-1 p-1 p-md-2" size="sm">
                    <Share />
                  </Button>
                  <Button variant="light" className="p-1 p-md-2" size="sm">
                    <BookmarkPlus />
                  </Button>
                </div>
              </div>
              <div className="participants-preview d-flex align-items-center">
                <div className="d-flex">
                  {event.participants &&
                    event.participants.slice(0, 3).map((participant, index) => (
                      <RBImage
                        key={participant.id}
                        src={participant.avatarUrl || defaultAvatar}
                        roundedCircle
                        width={24}
                        height={24}
                        className="border border-white"
                        style={{
                          objectFit: "cover",
                          marginLeft: index > 0 ? "-8px" : "0",
                        }}
                      />
                    ))}
                  {event.participants && event.participants.length > 3 && (
                    <div
                      className="d-flex align-items-center justify-content-center rounded-circle bg-light text-primary"
                      style={{
                        width: 24,
                        height: 24,
                        marginLeft: "-8px",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      +{event.participants.length - 3}
                    </div>
                  )}
                </div>
                <span className="ms-1 text-muted small">{event.participants?.length || 0}</span>
              </div>
            </div>

            {joinError && (
              <Alert variant="danger" className="mb-3 py-2">
                {joinError}
              </Alert>
            )}

            {/* Thông tin chi tiết sự kiện */}
            <Card className="shadow-sm mb-3">
              <Card.Body className="p-3">
                <h5 className="card-title mb-3">Thông tin chi tiết</h5>

                <div className="event-details mb-3">
                  <div className="d-flex mb-2">
                    <div className="event-icon me-2">
                      <Calendar2Event size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0">Thời gian</h6>
                      <p className="mb-0 small">{formatEventDateTimeFull(event.eventTime)}</p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="d-flex mb-2">
                      <div className="event-icon me-2">
                        <GeoAlt size={20} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-0">Địa điểm</h6>
                        <p className="mb-0 small">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="d-flex">
                    <div className="event-icon me-2">
                      <PeopleFill size={20} className="text-primary" />
                    </div>
                    <div>
                      <h6 className="mb-0">Người tham gia</h6>
                      <p className="mb-0 small">{event.participants?.length || 0} người đã tham gia</p>
                    </div>
                  </div>
                </div>

                <h5 className="mb-2">Mô tả</h5>
                <div className="event-description" style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                  {event.description || <em className="text-muted">Không có mô tả chi tiết.</em>}
                </div>
              </Card.Body>
            </Card>

            {/* Phần thảo luận */}
            <Card className="shadow-sm mb-3" id='comments'>
              <Card.Header className=" py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Thảo luận</h5>
                  {user && !showPostForm && (
                    <Button variant="primary" onClick={() => setShowPostForm(true)} size="sm">
                      <ChatLeftText className="me-1" /> Viết bài
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Body className="p-2 p-md-3">
                {/* Form đăng bài viết mới */}
                {user && showPostForm && (
                  <div className="post-form mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <RBImage
                        src={user.avatarUrl || defaultAvatar}
                        roundedCircle
                        width={36}
                        height={36}
                        className="me-2"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">Đăng bài viết mới</h6>
                        <p className="text-muted small mb-0">Chia sẻ thông tin hoặc đặt câu hỏi</p>
                      </div>
                    </div>

                    <Form onSubmit={handlePostSubmit}>
                      <Form.Group className="mb-2">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Viết bài viết của bạn..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          disabled={isPosting}
                          required
                          className="border-0 bg-light p-2"
                          style={{ resize: "none" }}
                        />
                      </Form.Group>

                      <Form.Group controlId="postImageUpload" className="mb-3">
                        {/* Input file ẩn */}
                        <Form.Control
                          type="file"
                          accept="image/*"
                          ref={postFileInputRef}
                          onChange={handlePostImageChange}
                          style={{ display: 'none' }}
                          disabled={isUploadingPostImage || isPosting}
                        />
                        {/* Nút bấm để mở cửa sổ chọn file */}
                        {!postImageUrl && !isUploadingPostImage && ( // Chỉ hiện nút chọn khi chưa có ảnh và không đang tải
                          <Button
                            variant="outline-secondary" size="sm"
                            onClick={() => postFileInputRef.current?.click()}
                            disabled={isUploadingPostImage || isPosting}
                          >
                            <i className="bi bi-image me-1"></i> Thêm ảnh
                          </Button>
                        )}

                        {/* Hiển thị trạng thái Upload */}
                        {isUploadingPostImage && <div className="mt-2"><Spinner size="sm" /> Đang tải ảnh...</div>}
                        {postImageError && <Alert variant="danger" size="sm" className="mt-2 py-1">{postImageError}</Alert>}

                        {/* Hiển thị Ảnh Preview và nút Xóa */}
                        {postImageUrl && !postImageError && (
                          <div className="mt-2 position-relative" style={{ maxWidth: '150px' }}>
                            <RBImage src={postImageUrl} alt="Preview" thumbnail fluid />
                            <Button
                              variant="danger" size="sm"
                              className="position-absolute top-0 end-0 m-1 p-0 px-1 lh-1"
                              onClick={() => { setPostImageUrl(null); setPostImageFile(null); }}
                              disabled={isPosting}
                              title="Xóa ảnh"
                            >
                              &times; {/* Dấu X */}
                            </Button>
                          </div>
                        )}
                      </Form.Group>

                      {postError && (
                        <Alert variant="danger" className="py-1 mb-2 small">
                          {postError}
                        </Alert>
                      )}

                      <div className="d-flex justify-content-end">
                        <Button
                          variant="outline-secondary"
                          className="me-2"
                          onClick={() => {
                            setShowPostForm(false)
                            setNewPostContent("")
                          }}
                          disabled={isPosting}
                          size="sm"
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isPosting || !newPostContent.trim()}
                          size="sm"
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
                    event.posts.map((post) => (
                      <EventPostItem key={post.id} post={post} eventCreatorId={event.creator.id} />
                    ))
                  ) : (
                    <div className="text-center py-3">
                      <ChatLeftText size={32} className="text-muted mb-2" />
                      <h6>Chưa có bài viết nào</h6>
                      <p className="text-muted small mb-2">Hãy là người đầu tiên chia sẻ thông tin hoặc đặt câu hỏi.</p>
                      {user && !showPostForm && (
                        <Button variant="primary" onClick={() => setShowPostForm(true)} size="sm">
                          Viết bài đầu tiên
                        </Button>
                      )}
                      {!user && (
                        <Button variant="primary" as={Link} to="/login" size="sm">
                          Đăng nhập để viết bài
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Thông tin người tổ chức */}
            <Card className="shadow-sm mb-3">
              <Card.Header className=" py-2">
                <h5 className="mb-0">Người tổ chức</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <Link to={`/profile/${event.creator.id}`}>
                    <RBImage
                      src={event.creator.avatarUrl || defaultAvatar}
                      roundedCircle
                      width={48}
                      height={48}
                      className="me-3"
                      style={{ objectFit: "cover" }}
                    />
                  </Link>
                  <div>
                    <h6 className="mb-0">
                      <Link to={`/profile/${event.creator.id}`} className="text-decoration-none">
                        {event.creator.fullName || event.creator.username}
                      </Link>
                    </h6>
                    <p className="text-muted mb-0 small">@{event.creator.username}</p>
                  </div>
                </div>

                {user && user.id !== event.creator.id && (
                  <div className="mt-2 d-flex">
                    <Button variant="outline-primary" className="me-2 flex-grow-1" size="sm">
                      <span className="d-none d-sm-inline">Theo dõi</span>
                      <span className="d-sm-none">+</span>
                    </Button>
                    <Button variant="outline-primary" className="flex-grow-1" size="sm">
                      <span className="d-none d-sm-inline">Nhắn tin</span>
                      <span className="d-sm-none">✉️</span>
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Danh sách người tham gia */}
            <Card className="shadow-sm mb-3">
              <Card.Header className=" py-2">
                <h5 className="mb-0">Người tham gia ({event.participants?.length || 0})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {event.participants && event.participants.length > 0 ? (
                  <div className="participants-list">
                    {event.participants.slice(0, 5).map((participant) => (
                      <Link
                        key={participant.id}
                        to={`/profile/${participant.id}`}
                        className="d-flex align-items-center p-2 border-bottom text-decoration-none text-body"
                      >
                        <RBImage
                          src={participant.avatarUrl || defaultAvatar}
                          roundedCircle
                          width={32}
                          height={32}
                          className="me-2"
                          style={{ objectFit: "cover" }}
                        />
                        <div>
                          <h6 className="mb-0 small">{participant.username}</h6>
                        </div>
                      </Link>
                    ))}

                    {event.participants.length > 5 && (
                      <div className="text-center p-2">
                        <Button variant="link" size="sm" className="p-0">
                          Xem tất cả {event.participants.length} người tham gia
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted mb-0 small">Chưa có người tham gia.</p>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Sự kiện liên quan - ẩn trên mobile */}
            <Card className="shadow-sm d-none d-lg-block">
              <Card.Header className=" py-2">
                <h5 className="mb-0">Sự kiện liên quan</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="text-center py-3">
                  <p className="text-muted mb-0 small">Chức năng đang được phát triển.</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default EventDetailPage
