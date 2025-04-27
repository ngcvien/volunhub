// frontend/src/components/Event/EventPostItem.tsx
import React, {useState, useEffect} from 'react';
import { Card, Image as RBImage, Badge, Button, Spinner, Alert, Form } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import { EventPostType } from '../../types/event.types'; 
import { EventPostCommentType } from '../../types/comment.types'; 
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChatLeftText } from 'react-bootstrap-icons';
import CommentItem from '../Comment/CommentItem'; 

import { getCommentsForPostApi, createCommentApi } from '../../api/comment.api';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

// Ảnh avatar mặc định
const defaultAvatar = '/default-avatar.png';

interface EventPostItemProps {
    post: EventPostType;
    eventCreatorId: number; // ID của người tạo sự kiện để so sánh
}

// Hàm format thời gian (có thể đưa ra utils)
const formatTimeAgo = (isoString: string): string => {
    try {
        return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi });
    } catch (e) { return isoString; }
};

const EventPostItem: React.FC<EventPostItemProps> = ({ post, eventCreatorId }) => {
    const { user } = useAuth();
    const isCreator = post.author.id === eventCreatorId;

    // State cho comments
    const [comments, setComments] = useState<EventPostCommentType[]>([]);
    const [showComments, setShowComments] = useState(false); // Ẩn/hiện comment
    const [loadingComments, setLoadingComments] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);

    // State cho việc tạo comment mới
    const [newComment, setNewComment] = useState('');
    const [isPostingComment, setIsPostingComment] = useState(false);
    const [postCommentError, setPostCommentError] = useState<string | null>(null);

     // Hàm fetch comments
     const fetchComments = async () => {
        if (!showComments) return; // Chỉ fetch nếu đang muốn hiển thị
        setLoadingComments(true);
        setCommentError(null);
        try {
            const response = await getCommentsForPostApi(post.id);
            setComments(response.comments);
        } catch (err: any) {
            setCommentError(err.message || 'Lỗi tải bình luận.');
        } finally {
            setLoadingComments(false);
        }
    };

    // Gọi fetchComments khi showComments thay đổi thành true
    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
        // Không cần fetch lại khi showComments thành false
    }, [showComments, post.id]); // Phụ thuộc showComments và postId

    // Hàm xử lý submit comment mới
    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        setIsPostingComment(true);
        setPostCommentError(null);
        try {
            // Gọi API tạo comment (chưa làm trả lời lồng nhau, parentId = null)
            await createCommentApi(post.id, { content: newComment, parentId: null });
            setNewComment(''); // Xóa ô nhập liệu
            // Fetch lại comment để hiển thị comment mới
            fetchComments();
        } catch (err: any) {
            setPostCommentError(err.message || 'Lỗi gửi bình luận.');
        } finally {
            setIsPostingComment(false);
        }
    };
    return (
        // Dùng Card hoặc chỉ div tùy theo thiết kế bạn muốn
        <Card className="mb-3 shadow-sm border-0 event-post-item">
            <Card.Body className="p-3">
                <div className="d-flex align-items-start mb-2">
                    {/* Avatar người đăng */}
                    <Link to={`/profile/${post.author.id}`} className="me-2 flex-shrink-0">
                        <RBImage
                            src={post.author.avatarUrl || defaultAvatar}
                            alt={post.author.username}
                            roundedCircle
                            width={38}
                            height={38}
                            style={{ objectFit: 'cover' }}
                        />
                    </Link>
                    {/* Tên, Tag, Thời gian */}
                    <div className="flex-grow-1">
                        <div>
                            <Link to={`/profile/${post.author.id}`} className="fw-bold text-dark text-decoration-none me-2">
                                {post.author.username}
                            </Link>
                            {/* Tag Người tổ chức */}
                            {isCreator && (
                                <Badge pill bg="info" text="dark" className="me-2" style={{ fontSize: '0.7em' }}>
                                    Người tổ chức
                                </Badge>
                            )}
                        </div>
                        <small className="text-muted">{formatTimeAgo(post.createdAt)}</small>
                    </div>
                    {/* TODO: Thêm nút options (...) cho bài viết (xóa, sửa...) */}
                </div>
                {/* Nội dung bài viết */}
                <div className="post-content" style={{ whiteSpace: 'pre-wrap' }}>
                    {post.content}
                </div>
                {/* TODO: Thêm phần tương tác (Like, Reply) cho bài viết */}
                {/* <div className="post-actions mt-2 d-flex gap-2"> ... </div> */}
            </Card.Body>

            <Card.Footer className="bg-white border-top pt-2 pb-2">
                 {/* Nút xem/ẩn bình luận */}
                 <Button
                     variant="link"
                     size="sm"
                     className="text-muted p-0 mb-2"
                     onClick={() => setShowComments(!showComments)}
                 >
                     <ChatLeftText className="me-1" />
                      {showComments ? 'Ẩn bình luận' : `Xem bình luận (${post.commentCount || comments.length})`} {/* Hiển thị count nếu có */}
                      {loadingComments && <Spinner animation="border" size="sm" className="ms-2"/>}
                 </Button>

                 {/* Danh sách bình luận (chỉ hiện khi showComments=true) */}
                 {showComments && (
                     <div className="comments-section mt-2">
                         {commentError && <Alert variant="danger" size="sm">{commentError}</Alert>}
                         {!loadingComments && comments.length === 0 && !commentError && <p className="text-muted small">Chưa có bình luận nào.</p>}
                         {!loadingComments && comments.map(comment => (
                             <CommentItem
                                 key={comment.id}
                                 comment={comment}
                                 // onReply={(commentId) => console.log('Reply to:', commentId)} // Xử lý reply sau
                             />
                         ))}
                     </div>
                 )}

                 {/* Form đăng bình luận mới (chỉ hiện khi đăng nhập) */}
                 {user && (
                     <Form onSubmit={handleCommentSubmit} className={`mt-3 ${!showComments ? 'border-top pt-3' : ''}`}> {/* Thêm border nếu comment đang ẩn */}
                          <Form.Group>
                              <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Viết bình luận của bạn..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  disabled={isPostingComment}
                                  required
                              />
                          </Form.Group>
                          {postCommentError && <Alert variant="danger" size="sm" className="mt-1 py-1">{postCommentError}</Alert>}
                          <div className="text-end mt-2">
                              <Button type="submit" size="sm" variant="primary" disabled={isPostingComment || !newComment.trim()}>
                                  {isPostingComment ? <Spinner size="sm" animation="border" /> : 'Gửi'}
                              </Button>
                          </div>
                     </Form>
                 )}
            </Card.Footer>
        </Card>
    );
};

export default EventPostItem;