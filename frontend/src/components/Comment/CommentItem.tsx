"use client"

// frontend/src/components/Comment/CommentItem.tsx
import type React from "react"
import { useState } from "react"
import { Image as RBImage, Button, Form } from "react-bootstrap"
import { Link } from "react-router-dom"
import type { EventPostCommentType } from "../../types/comment.types"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { HandThumbsUp, HandThumbsUpFill, Reply } from "react-bootstrap-icons"
import { useAuth } from "../../contexts/AuthContext"
import "./CommentItem.css" // Thêm file CSS cho animations

const defaultAvatar = "/default-avatar.png"

interface CommentItemProps {
  comment: EventPostCommentType
  onReply?: (commentId: number) => void
}

const formatTimeAgo = (isoString: string): string => {
  try {
    return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi })
  } catch (e) {
    return isoString
  }
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply }) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyText.trim() && onReply) {
      onReply(comment.id)
      setReplyText("")
      setShowReplyForm(false)
    }
  }

  return (
    <div className="comment-item mb-2">
      <div className="d-flex">
        <Link to={`/profile/${comment.author.id}`} className="flex-shrink-0 me-2">
          <RBImage
            src={comment.author.avatarUrl || defaultAvatar}
            alt={comment.author.username}
            roundedCircle
            width={28}
            height={28}
            style={{ objectFit: "cover" }}
          />
        </Link>
        <div className="flex-grow-1">
          <div className="comment-bubble p-2 rounded ">
            <div className="d-flex justify-content-between align-items-start">
              <Link
                to={`/profile/${comment.author.id}`}
                className="fw-bold text-body text-decoration-none"
                style={{ fontSize: "0.85rem" }}
              >
                {comment.author.username}
              </Link>
              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", whiteSpace: "pre-wrap", textAlign: "left" }}>{comment.content}</div>
          </div>

          <div className="comment-actions mt-1 ms-1" style={{ textAlign:"left"}}>
            <Button
              variant="link"
              size="sm"
              className={`text-muted p-0 me-3 ${liked ? "text-primary" : ""}`}
              style={{ fontSize: "0.75rem" }}
              onClick={handleLike}
            >
              {liked ? <HandThumbsUpFill size={12} /> : <HandThumbsUp size={12} />} Thích
            </Button>
            {user && (
              <Button
                variant="link"
                size="sm"
                className="text-muted p-0"
                style={{ fontSize: "0.75rem" }}
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <Reply size={12} /> Trả lời
              </Button>
            )}
          </div>

          {showReplyForm && user && (
            <Form onSubmit={handleReplySubmit} className="mt-2">
              <div className="d-flex">
                <RBImage
                  src={user.avatarUrl || defaultAvatar}
                  roundedCircle
                  width={24}
                  height={24}
                  className="me-1"
                  style={{ objectFit: "cover" }}
                />
                <Form.Group className="flex-grow-1 position-relative">
                  <Form.Control
                    type="text"
                    placeholder={`Trả lời ${comment.author.username}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="rounded-pill py-1"
                    size="sm"
                    style={{ fontSize: "0.8rem" }}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="position-absolute end-0 top-0 rounded-pill"
                    style={{ marginTop: "1px", marginRight: "1px", padding: "0.15rem 0.5rem", fontSize: "0.75rem" }}
                    disabled={!replyText.trim()}
                  >
                    Gửi
                  </Button>
                </Form.Group>
              </div>
            </Form>
          )}

          {/* Hiển thị các replies nếu có */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="replies-list mt-2 ms-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
