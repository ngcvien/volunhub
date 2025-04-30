import React, { useState } from 'react';
import { Card, Image, Button, Badge, Form, Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  Heart, HeartFill, 
  Chat, 
  Share, 
  Bookmark, BookmarkFill,
  GeoAlt, 
  Calendar2Event, 
  PeopleFill,
  ThreeDots,
  EmojiSmile,
  Image as ImageIcon,
  Send
} from 'react-bootstrap-icons';
import { EventType } from '../../types/event.types';
import { User } from '../../types/user.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import './EventPost.css';

interface EventPostProps {
  event: EventType;
  currentUser: User | null;
}

const EventPost: React.FC<EventPostProps> = ({ event, currentUser }) => {
  const [isLiked, setIsLiked] = useState(event.isLiked);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const formatEventDate = (date: string) => {
    return format(new Date(date), "d MMMM 'lúc' HH:mm", { locale: vi });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Implement like API call
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Implement save API call
  };

  const handleShare = () => {
    // Implement share functionality
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement comment submission
    console.log('Comment:', commentText);
    setCommentText('');
  };

  return (
    <Card className="event-post mb-4">
      {/* Post Header */}
      <Card.Header className="bg-transparent border-0 pt-3 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to={`/profile/${event.creator.id}`} className="me-3">
              <Image
                src={event.creator.avatarUrl || '/default-avatar.png'}
                roundedCircle
                className="post-avatar"
                alt={event.creator.username}
              />
            </Link>
            <div>
              <Link 
                to={`/profile/${event.creator.id}`} 
                className="creator-name"
              >
                {event.creator.username}
              </Link>
              <div className="post-meta">
                <span className="text-muted small">
                  {formatEventDate(event.createdAt)}
                </span>
                <Badge 
                  bg={event.status === 'active' ? 'success' : 'secondary'}
                  className="ms-2"
                >
                  {event.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="link" className="text-muted p-0">
            <ThreeDots size={20} />
          </Button>
        </div>
      </Card.Header>

      {/* Post Content */}
      <Card.Body className="px-4">
        <Link to={`/events/${event.id}`} className="event-title-link">
          <h5 className="mb-3">{event.title}</h5>
        </Link>

        <div className="event-details mb-3">
          <div className="detail-item">
            <Calendar2Event className="text-primary" />
            <span>{formatEventDate(event.eventTime)}</span>
          </div>
          <div className="detail-item">
            <GeoAlt className="text-primary" />
            <span>{event.location}</span>
          </div>
          <div className="detail-item">
            <PeopleFill className="text-primary" />
            <span>{event.participantCount || 0} người tham gia</span>
          </div>
        </div>

        <p className="event-description">{event.description}</p>

        {event.imageUrl && (
          <div className="event-image-container">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="event-image"
            />
          </div>
        )}
      </Card.Body>

      {/* Post Actions */}
      <Card.Footer className="bg-transparent px-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex gap-3">
            <Button 
              variant="link" 
              className={`action-button ${isLiked ? 'text-danger' : 'text-muted'}`}
              onClick={handleLike}
            >
              {isLiked ? <HeartFill size={20} /> : <Heart size={20} />}
              <span>{event.likeCount || 0}</span>
            </Button>
            <Button 
              variant="link" 
              className="action-button text-muted"
              onClick={() => setShowComments(!showComments)}
            >
              <Chat size={20} />
              <span>{event.commentCount || 0}</span>
            </Button>
            <Button 
              variant="link" 
              className="action-button text-muted"
              onClick={handleShare}
            >
              <Share size={20} />
            </Button>
          </div>
          <Button 
            variant="link" 
            className={`action-button ${isSaved ? 'text-primary' : 'text-muted'}`}
            onClick={handleSave}
          >
            {isSaved ? <BookmarkFill size={20} /> : <Bookmark size={20} />}
          </Button>
        </div>

        {/* Comments Section */}
        <Collapse in={showComments}>
          <div>
            <div className="comments-section mb-3">
              {/* Render comments here */}
              <div className="text-muted text-center">
                Chưa có bình luận nào
              </div>
            </div>
            {currentUser && (
              <Form onSubmit={handleCommentSubmit} className="comment-form">
                <div className="d-flex align-items-center gap-2">
                  <Image
                    src={currentUser.avatarUrl || '/default-avatar.png'}
                    roundedCircle
                    className="comment-avatar"
                  />
                  <Form.Control
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="rounded-pill"
                  />
                  <div className="comment-actions">
                    <Button 
                      variant="link" 
                      className="text-muted"
                      type="button"
                    >
                      <EmojiSmile size={20} />
                    </Button>
                    <Button 
                      variant="link" 
                      className="text-muted"
                      type="button"
                    >
                      <ImageIcon size={20} />
                    </Button>
                    <Button 
                      variant="link" 
                      className="text-primary"
                      type="submit"
                      disabled={!commentText.trim()}
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </div>
        </Collapse>
      </Card.Footer>
    </Card>
  );
};

export default EventPost;