import React, { useState, useEffect, useRef } from 'react';
import { Image, Spinner } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { getAllEventsApi } from '../../api/event.api';
import type { EventType } from '../../types/event.types';
import './EventStories.css';

const EventStories: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showStoryView, setShowStoryView] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch random featured events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch events with a larger limit, then we'll randomize and take a subset
        const response = await getAllEventsApi({ page: 1, limit: 20 });
        
        // Shuffle the events array to get random events
        const shuffledEvents = [...response.events].sort(() => 0.5 - Math.random());
        
        // Take the first 8 events (or fewer if less are available)
        const featuredEvents = shuffledEvents.slice(0, 8);
        setEvents(featuredEvents);
      } catch (err: any) {
        setError(err.message || 'Không thể tải sự kiện nổi bật');
        console.error('Error fetching featured events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle horizontal scroll with buttons
  const scrollStories = (direction: 'left' | 'right') => {
    if (storyContainerRef.current) {
      const container = storyContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of the visible width
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Open story view when clicking on a story
  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setShowStoryView(true);
    setStoryProgress(0);
    
    // Start progress timer
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    progressIntervalRef.current = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          // Move to next story when progress reaches 100%
          if (activeStoryIndex !== null && activeStoryIndex < events.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            // Close story view if it's the last story
            closeStoryView();
            return 0;
          }
        }
        return prev + 1; // Increment by 1% every ~50ms (5 seconds total)
      });
    }, 50); // Update every 50ms for smooth progress
  };

  // Close story view
  const closeStoryView = () => {
    setShowStoryView(false);
    setActiveStoryIndex(null);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  // Navigate between stories
  const navigateStory = (direction: 'prev' | 'next') => {
    if (activeStoryIndex === null) return;
    
    if (direction === 'prev' && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    } else if (direction === 'next' && activeStoryIndex < events.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else if (direction === 'next' && activeStoryIndex === events.length - 1) {
      // Close if we're at the last story and trying to go next
      closeStoryView();
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Get the image URL for a story
  const getStoryImageUrl = (event: EventType): string => {
    // If event has multiple images, use the first one
    if (event.images && event.images.length > 0) {
      return event.images[0].imageUrl;
    }
    // Otherwise use the main imageUrl or a placeholder
    return event.imageUrl || '/placeholder-event.png';
  };

  // Format event date for display
  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="event-stories-container">
      <div className="event-stories-header">
        <h5 className="event-stories-title">Sự kiện nổi bật</h5>
        <div className="event-stories-nav">
          <button 
            className="event-stories-nav-btn" 
            onClick={() => scrollStories('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft />
          </button>
          <button 
            className="event-stories-nav-btn" 
            onClick={() => scrollStories('right')}
            aria-label="Scroll right"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="event-stories-loading">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Đang tải sự kiện nổi bật...</span>
        </div>
      ) : error ? (
        <div className="event-stories-error">
          {error}
        </div>
      ) : (
        <div className="event-stories-scroll" ref={storyContainerRef}>
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="event-story-item"
              onClick={() => openStory(index)}
            >
              <div className="event-story-image-container">
                <Image 
                  src={getStoryImageUrl(event)} 
                  alt={event.title}
                  className="event-story-image"
                />
                <div className="event-story-date">
                  {formatEventDate(event.eventTime)}
                </div>
              </div>
              <div className="event-story-title">
                {event.title.length > 20 
                  ? `${event.title.substring(0, 20)}...` 
                  : event.title}
              </div>
            </div>
          ))}
          
          {/* Add a "create event" story item */}
          <Link to="/events/new" className="event-story-item create-story">
            <div className="event-story-image-container create-story-container">
              <div className="create-story-icon">+</div>
            </div>
            <div className="event-story-title">Tạo sự kiện</div>
          </Link>
        </div>
      )}

      {/* Full-screen story view */}
      {showStoryView && activeStoryIndex !== null && events[activeStoryIndex] && (
        <div className="story-view-overlay" onClick={closeStoryView}>
          <div className="story-view-container" onClick={e => e.stopPropagation()}>
            {/* Progress bar */}
            <div className="story-progress-container">
              {events.map((_, index) => (
                <div 
                  key={index} 
                  className={`story-progress-bar ${index === activeStoryIndex ? 'active' : ''} ${index < activeStoryIndex ? 'completed' : ''}`}
                >
                  {index === activeStoryIndex && (
                    <div 
                      className="story-progress-fill" 
                      style={{ width: `${storyProgress}%` }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Close button */}
            <button className="story-close-btn" onClick={closeStoryView}>×</button>
            
            {/* Navigation buttons */}
            <button 
              className="story-nav-btn prev" 
              onClick={(e) => { e.stopPropagation(); navigateStory('prev'); }}
              disabled={activeStoryIndex === 0}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              className="story-nav-btn next" 
              onClick={(e) => { e.stopPropagation(); navigateStory('next'); }}
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Story content */}
            <div className="story-content">
              <Image 
                src={getStoryImageUrl(events[activeStoryIndex])} 
                alt={events[activeStoryIndex].title}
                className="story-image"
              />
              
              <div className="story-info">
                <h3 className="story-title">{events[activeStoryIndex].title}</h3>
                {events[activeStoryIndex].description && (
                  <p className="story-description">{events[activeStoryIndex].description}</p>
                )}
                <div className="story-meta">
                  <div className="story-date">
                    {new Date(events[activeStoryIndex].eventTime).toLocaleDateString('vi-VN', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="story-location">
                    {events[activeStoryIndex].location || 'Chưa có địa điểm'}
                  </div>
                </div>
                
                <Link 
                  to={`/events/${events[activeStoryIndex].id}`} 
                  className="story-view-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventStories;
