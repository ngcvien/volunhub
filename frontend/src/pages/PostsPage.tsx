import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import EventPostItem from '../components/EventPostItem';
import { EventPost } from '../types/event';
import './PostsPage.css';

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<EventPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch posts from API
    // For now, using mock data
    const mockPosts: EventPost[] = [
      {
        id: 1,
        eventId: 1,
        title: 'Sự kiện từ thiện tại Hà Nội',
        content: 'Chúng tôi đã tổ chức một sự kiện từ thiện thành công tại Hà Nội...',
        imageUrl: 'https://via.placeholder.com/800x400',
        likes: 42,
        comments: [
          {
            id: 1,
            postId: 1,
            userId: 1,
            userName: 'Nguyễn Văn A',
            content: 'Sự kiện rất ý nghĩa!',
            createdAt: new Date('2024-03-15T10:00:00'),
          },
        ],
        createdAt: new Date('2024-03-15T09:00:00'),
      },
      // Add more mock posts here
    ];

    setPosts(mockPosts);
    setLoading(false);
  }, []);

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + (post.likes === 0 ? 1 : -1) }
          : post
      )
    );
  };

  const handleComment = (postId: number, content: string) => {
    const newComment = {
      id: Date.now(),
      postId,
      userId: 1, // TODO: Get from auth context
      userName: 'Current User', // TODO: Get from auth context
      content,
      createdAt: new Date(),
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="posts-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <div className="search-container mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>

            {filteredPosts.map((post) => (
              <EventPostItem
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
              />
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PostsPage; 