import React from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { EventType } from '../../types/event.types';
import { User } from '../../types/user.types';
import EventPost from './EventPost';
import EventCard from '../Event/EventCard';
// import './EventFeed.css';

interface EventFeedProps {
    events: EventType[];
    loading: boolean;
    error: string | null;
    currentUser: User | null;
}

const EventFeed: React.FC<EventFeedProps> = ({
    events,
    loading,
    error,
    currentUser
}) => {
    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (loading && events.length === 0) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Đang tải danh sách sự kiện...</p>
            </div>
        );
    }

    return (
        <div className="event-feed">
            {events.map(event => (
                <EventCard
                    key={event.id}
                    event={event}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
};

export default EventFeed;