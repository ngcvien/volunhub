import type React from "react"
import { Popover, Image, Button, Badge } from "react-bootstrap"
import { Link } from "react-router-dom"
import { Envelope, PersonPlus } from "react-bootstrap-icons"
import "./UserPopup.css"

interface UserPopupProps {
  userId: number
  username: string
  avatarUrl?: string | null
  fullName?: string | null
  bio?: string | null
  location?: string | null
  volunCredit?: number
}
const UserPopup: React.FC<UserPopupProps> = ({
  userId,
  username,
  avatarUrl,
  fullName,
  bio,
  location,
  volunCredit = 0,
}) => {
  return (
    <Popover id={`user-popover-${userId}`} className="user-popup" >
      <Popover.Body className="p-0">
        <div className="user-popup-content">
          {/* Header with background and avatar */}
          <div className="user-popup-header">
            <div className="user-popup-avatar-container">
              <Image
                src={avatarUrl || "/default-avatar.png"}
                alt={username}
                roundedCircle
                className="user-popup-avatar"
              />
            </div>
          </div>

          {/* User info */}
          <div className="user-popup-info">
            <h5 className="mb-1">{fullName || username}</h5>
            <p className="text-muted small mb-2">@{username}</p>

            {location && (
              <p className="small mb-2">
                <i className="bi bi-geo-alt me-1"></i> {location}
              </p>
            )}

            {bio && <p className="small text-truncate-3 mb-3">{bio}</p>}

            <div className="d-flex align-items-center mb-3">
              <Badge bg="primary" className="volun-credit-badge">
                <i className="bi bi-star-fill me-1"></i> {volunCredit} VolunCredit
              </Badge>
            </div>

            {/* Action buttons */}
            <div className="d-flex gap-2">
              <Link to={`/profile/${userId}`} className="flex-grow-1">
                <Button variant="primary" size="sm" className="w-100">
                  Xem hồ sơ
                </Button>
              </Link>
              <Button variant="outline-primary" size="sm" className="action-btn">
                <Envelope size={16} />
              </Button>
              <Button variant="outline-primary" size="sm" className="action-btn">
                <PersonPlus size={16} />
              </Button>
            </div>
          </div>
        </div>
      </Popover.Body>
    </Popover>
  )
}



export default UserPopup
