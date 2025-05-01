"use client"

// frontend/src/components/Event/EventPostItem.tsx
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, Image as RBImage, Badge, Button, Spinner, Alert, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import type { EventPostType } from "../../types/event.types"
import type { EventPostCommentType } from "../../types/comment.types"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { ChatLeftText, HandThumbsUp, HandThumbsUpFill, ThreeDots } from "react-bootstrap-icons"
import CommentItem from "../Comment/CommentItem"

import { getCommentsForPostApi, createCommentApi } from "../../api/comment.api"
import { useAuth } from "../../contexts/AuthContext"
import "./EventPostItem.css" // Thêm file CSS cho animations

// Ảnh avatar mặc định
const defaultAvatar = "/default-avatar.png"

interface EventPostItemProps {
  post: EventPostType
  eventCreatorId: number // ID của người tạo sự kiện để so sánh
}

// Hàm format thời gian
const formatTimeAgo = (isoString: string): string => {
  try {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi })
  } catch (e) {
    return isoString
  }
}

const EventPostItem: React.FC<EventPostItemProps> = ({ post, eventCreatorId }) => {
  const { user } = useAuth()
  const isCreator = post.author.id === eventCreatorId
  const commentsRef = useRef<HTMLDivElement>(null)

  // State cho comments
  const [comments, setComments] = useState<EventPostCommentType[]>([])
  const [showComments, setShowComments] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  // State cho việc tạo comment mới
  const [newComment, setNewComment] = useState("")
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [postCommentError, setPostCommentError] = useState<string | null>(null)

  // State cho like (giả lập)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 10))

  // Hàm fetch comments
  const fetchComments = async () => {
    if (!showComments) return
    setLoadingComments(true)
    setCommentError(null)
    try {
      const response = await getCommentsForPostApi(post.id)
      setComments(response.comments)
    } catch (err: any) {
      setCommentError(err.message || "Lỗi tải bình luận.")
    } finally {
      setLoadingComments(false)
    }
  }

  // Gọi fetchComments khi showComments thay đổi thành true
  useEffect(() => {
    if (showComments) {
      fetchComments()
    }
  }, [showComments, post.id])

  // Scroll to comments section when it opens
  useEffect(() => {
    if (showComments && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }, [showComments])

  // Hàm xử lý submit comment mới
  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setIsPostingComment(true)
    setPostCommentError(null)
    try {
      await createCommentApi(post.id, { content: newComment, parentId: null })
      setNewComment("")
      fetchComments()
    } catch (err: any) {
      setPostCommentError(err.message || "Lỗi gửi bình luận.")
    } finally {
      setIsPostingComment(false)
    }
  }

  // Hàm xử lý like (giả lập)
  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  // Hàm toggle comments với animation
  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <Card className="event-post-item mb-3 shadow-sm border-0">
      <Card.Header className=" border-0 pt-2 pb-0 px-3">
        <div className="d-flex">
          <Link to={`/profile/${post.author.id}`} className="me-2">
            <RBImage
              src={post.author.avatarUrl || defaultAvatar}
              alt={post.author.username}
              roundedCircle
              width={40}
              height={40}
              className="border"
              style={{ objectFit: "cover" }}
            />
          </Link>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-0">
              <Link to={`/profile/${post.author.id}`} className="fw-bold text-decoration-none me-2">
                {post.author.fullName || post.author.username}
              </Link>
              {isCreator && (
                <Badge bg="primary" className="me-2 py-1 px-2" style={{ fontSize: "0.65rem" }}>
                  Người tổ chức
                </Badge>
              )}
            </div>
            <div className="text-muted small">{formatTimeAgo(post.createdAt)}</div>
          </div>
          <div className="dropdown">
            <Button variant="link" size="sm" className="rounded-circle p-1">
              <ThreeDots size={16} />
            </Button>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="pt-2 pb-2 px-3">
        <div className="post-content mb-2" style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem" }}>
          {post.content}
        </div>

        <div className="post-actions d-flex border-top pt-2">
          <Button variant="link" className="d-flex align-items-center me-2 p-1" onClick={handleLike} size="sm">
            {liked ? <HandThumbsUpFill className="text-primary" size={16} /> : <HandThumbsUp size={16} />}
            <span className="ms-1 small">{likeCount}</span>
          </Button>

          <Button variant="link" className="reaction-btn d-flex align-items-center p-1" onClick={toggleComments} size="sm">
            <ChatLeftText size={16} />
            <span className="ms-1 small">{showComments ? comments.length : post.commentCount }</span>
          </Button>
        </div>
      </Card.Body>

      <div className={`comments-container ${showComments ? "show" : ""}`} ref={commentsRef}>
        {showComments && (
          <Card.Footer className="border-0 pt-2 pb-2 px-3">
            {loadingComments ? (
              <div className="text-center py-2">
                <Spinner animation="border" size="sm" />
                <span className="ms-2 small">Đang tải bình luận...</span>
              </div>
            ) : (
              <>
                {commentError && (
                  <Alert variant="danger" className="py-1 mb-2 small">
                    {commentError}
                  </Alert>
                )}

                {comments.length === 0 ? (
                  <p className="text-muted text-center mb-2 small">Chưa có bình luận nào.</p>
                ) : (
                  <div className="comments-list mb-2">
                    {comments.map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}
                  </div>
                )}

                {user ? (
                  <Form onSubmit={handleCommentSubmit} className="comment-form">
                    <div className="d-flex">
                      <RBImage
                        src={user.avatarUrl || defaultAvatar}
                        roundedCircle
                        width={32}
                        height={32}
                        className="me-2"
                        style={{ objectFit: "cover" }}
                      />
                      <Form.Group className="flex-grow-1 position-relative">
                        <Form.Control
                          type="text"
                          placeholder="Viết bình luận..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          disabled={isPostingComment}
                          className="rounded-pill pr-5 py-1"
                          size="sm"
                        />
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          className="position-absolute end-0 top-0 rounded-pill"
                          style={{ marginTop: "1px", marginRight: "1px", padding: "0.15rem 0.5rem" }}
                          disabled={isPostingComment || !newComment.trim()}
                        >
                          {isPostingComment ? <Spinner animation="border" size="sm" /> : "Gửi"}
                        </Button>
                      </Form.Group>
                    </div>
                    {postCommentError && (
                      <Alert variant="danger" className="mt-2 py-1 small">
                        {postCommentError}
                      </Alert>
                    )}
                  </Form>
                ) : (
                  <div className="text-center">
                    <Link to="/login" className="btn btn-outline-primary btn-sm py-1">
                      Đăng nhập để bình luận
                    </Link>
                  </div>
                )}
              </>
            )}
          </Card.Footer>
        )}
      </div>
    </Card>
  )
}

export default EventPostItem
