import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar2Event, 
  GeoAlt, 
  Heart, 
  HeartFill,
  People,
  Clock
} from 'react-bootstrap-icons';
import { EventType } from '../../types/event.types';
import { useAuth } from '../../contexts/AuthContext';
import { joinEventApi, likeEventApi, unlikeEventApi } from '../../api/event.api';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import './EventCardOverlay.css';

interface EventCardOverlayProps {
  event: EventType;
  onParticipationChange?: () => void;
}

const EventCardOverlay: React.FC<EventCardOverlayProps> = ({ 
  event, 
  onParticipationChange 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isLoadingLike, setIsLoadingLike] = useState(false);
  const [displayLiked, setDisplayLiked] = useState(event.isLiked);
  const [displayParticipating, setDisplayParticipating] = useState(event.isParticipating);
  const [displayLikeCount, setDisplayLikeCount] = useState(event.likeCount);

  const handleJoin = async () => {
    if (!user) {
      const shouldLogin = window.confirm(
        "Bạn cần đăng nhập để tham gia sự kiện. Đăng nhập ngay?"
      );
      if (shouldLogin) navigate("/auth");
      return;
    }

    setIsLoadingAction(true);
    try {
      await joinEventApi(event.id);
      setDisplayParticipating(true);
      onParticipationChange?.();
    } catch (error) {
      console.error('Failed to join event:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      const shouldLogin = window.confirm(
        "Bạn cần đăng nhập để thích sự kiện. Đăng nhập ngay?"
      );
      if (shouldLogin) navigate("/auth");
      return;
    }

    setIsLoadingLike(true);
    try {
      if (displayLiked) {
        await unlikeEventApi(event.id);
        setDisplayLiked(false);
        setDisplayLikeCount(prev => prev - 1);
      } else {
        await likeEventApi(event.id);
        setDisplayLiked(true);
        setDisplayLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to like/unlike event:', error);
    } finally {
      setIsLoadingLike(false);
    }
  };

  return (
    <Card className="event-card-overlay">
      <div className="event-image-container">
        <img 
          src={event.imageUrl || '/default-event.jpg'} 
          alt={event.title} 
          className="event-image"
        />
        <div className="event-overlay">
          <div className="event-content">
            {/* Event Status & Time */}
            <div className="event-meta">
              <Badge 
                bg={event.status === 'active' ? 'success' : 'secondary'}
                className="status-badge"
              >
                {event.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
              </Badge>
              <span className="time-ago">
                <Clock className="icon" />
                {formatDistanceToNow(new Date(event.createdAt), { 
                  addSuffix: true,
                  locale: vi 
                })}
              </span>
            </div>

            {/* Event Title */}
            <Link 
              to={`/events/${event.id}`} 
              className="event-title-link"
            >
              <h3 className="event-title">{event.title}</h3>
            </Link>

            {/* Event Details */}
            <div className="event-details">
              <div className="detail-item">
                <Calendar2Event className="icon" />
                <span>
                  {new Date(event.eventTime).toLocaleDateString('vi-VN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="detail-item">
                <GeoAlt className="icon" />
                <span>{event.location}</span>
              </div>
              <div className="detail-item">
                <People className="icon" />
                <span>{event.participantCount || 0} người tham gia</span>
              </div>
            </div>

            {/* Creator Info */}
            <div className="creator-info">
              <Link to={`/profile/${event.creator.id}`} className="creator-link">
                <img 
                  src={event.creator.avatarUrl || '/default-avatar.png'} 
                  alt={event.creator.username} 
                  className="creator-avatar"
                />
                <span className="creator-name">{event.creator.username}</span>
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="event-actions">
              <Button
                variant={displayParticipating ? "success" : "primary"}
                onClick={handleJoin}
                disabled={isLoadingAction || event.status !== 'active'}
                className="join-button"
              >
                {isLoadingAction ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : displayParticipating ? (
                  'Đã tham gia'
                ) : (
                  'Tham gia ngay'
                )}
              </Button>

              <Button
                variant="link"
                onClick={handleLike}
                disabled={isLoadingLike}
                className={`like-button ${displayLiked ? 'liked' : ''}`}
              >
                {isLoadingLike ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : displayLiked ? (
                  <HeartFill className="icon" />
                ) : (
                  <Heart className="icon" />
                )}
                <span className="like-count">{displayLikeCount}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCardOverlay;