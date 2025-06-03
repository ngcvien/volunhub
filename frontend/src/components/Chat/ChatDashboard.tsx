// frontend/src/components/Chat/ChatDashboard.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, ListGroup, Spinner, Alert, Form, Button, InputGroup, Image as RBImage } from 'react-bootstrap'; // Thêm Image, InputGroup
import ConversationListItem from './ConversationListItem';
import MessageItem from './MessageItem'; // <<<--- IMPORT MESSAGE ITEM
import { MessageType as MessageDataType, ConversationListItem as ConversationListItemType, MessageInputData } from '../../types/chat.types';
import { useAuth } from '../../contexts/AuthContext';
// Import các hàm API
import { findOrCreatePrivateConversationApi, getUserConversationsApi } from '../../api/conversation.api';
import { getMessagesForConversationApi, sendMessageApi } from '../../api/message.api';
// Import Socket.IO client
import { io, Socket } from 'socket.io-client';
// Import Icons
import { SendFill, ArrowLeft, PersonPlus, XCircleFill } from 'react-bootstrap-icons'; // Thêm icons

interface ChatDashboardProps {
    show: boolean;
    onHide: () => void;
}

// URL của backend WebSocket
const SOCKET_SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'; // Loại bỏ /api

const ChatDashboard: React.FC<ChatDashboardProps> = ({ show, onHide }) => {
    const { user, token } = useAuth(); // Lấy user và token từ context
    const socketRef = useRef<Socket | null>(null); // Ref để lưu instance socket

    const [conversations, setConversations] = useState<ConversationListItemType[]>([]);
    const [activeConversation, setActiveConversation] = useState<ConversationListItemType | null>(null);
    const [messages, setMessages] = useState<MessageDataType[]>([]);

    const [loadingConversations, setLoadingConversations] = useState(false);
    const [errorConversations, setErrorConversations] = useState<string | null>(null);

    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string | null>(null);

    const [newMessageContent, setNewMessageContent] = useState(''); // State cho nội dung tin nhắn mới
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null); // Để tự cuộn xuống

    // State cho việc tìm kiếm người dùng mới để chat
    const [showNewChatSearch, setShowNewChatSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]); // Sẽ là BasicUserForChat[]
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    // --- SOCKET.IO CLIENT CONNECTION AND AUTHENTICATION ---
    useEffect(() => {
        if (!show || !user || !token) {
            // Ngắt kết nối socket nếu modal không hiển thị hoặc user không đăng nhập
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                console.log('SOCKET: Disconnected');
            }
            return;
        }

        if (!socketRef.current) {
            // Thiết lập kết nối socket khi user đăng nhập và chat modal hiển thị
            console.log('SOCKET: Connecting...');
            const newSocket = io(SOCKET_SERVER_URL, {
                auth: {
                    token: token // Gửi JWT để xác thực socket
                },
                transports: ['websocket', 'polling'] // Ưu tiên websocket
            });

            newSocket.on('connect', () => {
                console.log(`SOCKET: Connected with ID: ${newSocket.id}`);
                // Sau khi kết nối, nếu có active conversation, join room
                if (activeConversation) {
                    newSocket.emit('join_conversation', activeConversation.id);
                }
            });

            newSocket.on('connect_error', (err) => {
                console.error('SOCKET: Connection error:', err.message);
                // Xử lý lỗi xác thực: token hết hạn/không hợp lệ
                if (err.message === 'Authentication error: Invalid token') {
                    alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
                    onHide(); // Đóng chat
                    // Tùy chọn: Gọi hàm logout của AuthContext để xóa token
                    // logout();
                }
            });

            // Lắng nghe tin nhắn mới từ server
            newSocket.on('new_message', (newMessage: MessageDataType) => {
                console.log('SOCKET: New message received:', newMessage);
                // Nếu tin nhắn thuộc cuộc trò chuyện đang hoạt động
                if (activeConversation && newMessage.conversationId === activeConversation.id) {
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                }
                // TODO: Cập nhật 'lastMessage' và 'updatedAt' của cuộc trò chuyện trong list conversations
                // để nó nhảy lên đầu
                setConversations(prevConvs => {
                    const convToUpdate = prevConvs.find(c => c.id === newMessage.conversationId);
                    if (convToUpdate) {
                        const updatedConv = { ...convToUpdate, lastMessage: newMessage, updatedAt: newMessage.createdAt };
                        return [updatedConv, ...prevConvs.filter(c => c.id !== newMessage.conversationId)].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                    }
                    return prevConvs;
                });
            });

            socketRef.current = newSocket;
        }
    }, [show, user, token, activeConversation, onHide]); // Dependencies for socket connection management


    // --- FETCH CONVERSATIONS AND MESSAGES ---
    // Fetch danh sách cuộc trò chuyện
    useEffect(() => {
        if (show && user) {
            const fetchConversations = async () => {
                setLoadingConversations(true);
                setErrorConversations(null);
                try {
                    const response = await getUserConversationsApi();
                    setConversations(response.conversations);
                    // Tự động chọn cuộc trò chuyện đầu tiên nếu có
                    if (!activeConversation && response.conversations.length > 0) {
                        // handleSelectConversation(response.conversations[0]); // Bỏ dòng này để không tự chọn nếu có lỗi ở bước 1
                    }
                } catch (err: any) { setErrorConversations(err.message || 'Lỗi tải danh sách chat.'); }
                finally { setLoadingConversations(false); }
            };
            fetchConversations();
        } else { // Reset khi đóng
            setConversations([]);
            setActiveConversation(null);
            setMessages([]);
            setShowNewChatSearch(false); // Đóng search mới
            setSearchQuery(''); setSearchResults([]);
            setSearchError(null);
        }
    }, [show, user]);

    // Fetch tin nhắn khi chọn một cuộc trò chuyện
    useEffect(() => {
        if (activeConversation) {
            const fetchMessages = async () => {
                setLoadingMessages(true);
                setErrorMessages(null);
                // Gửi sự kiện join_conversation khi chọn chat
                socketRef.current?.emit('join_conversation', activeConversation.id);

                try {
                    const response = await getMessagesForConversationApi(activeConversation.id);
                    setMessages(response.messages.reverse()); // Đảo ngược để hiển thị đúng thứ tự (cũ->mới)
                } catch (err: any) { setErrorMessages(err.message || 'Lỗi tải tin nhắn.'); }
                finally { setLoadingMessages(false); }
            };
            fetchMessages();
        } else {
            setMessages([]);
        }
    }, [activeConversation]);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    // --- HÀM XỬ LÝ ---
    const handleSelectConversation = (conversation: ConversationListItemType) => {
        setActiveConversation(conversation);
        setShowNewChatSearch(false); // Ẩn tìm kiếm mới khi chọn chat cũ
        setSearchQuery(''); setSearchResults([]); setSearchError(null);
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessageContent.trim() || !activeConversation || !user) return; // Add mediaUrl check later

        setIsSending(true);
        try {
            // Gửi tin nhắn qua API HTTP (để lưu vào DB)
            const response = await sendMessageApi(activeConversation.id, { content: newMessageContent, messageType: 'text' });
            // Sau khi gửi, tin nhắn sẽ được server phát lại qua socket.io
            // Client sẽ nhận tin nhắn qua socket.on('new_message') và tự cập nhật messages state
            // Tuy nhiên, chúng ta có thể thêm nó vào state ngay lập tức để có optimistic update
            // Hoặc chờ socket trả về để đảm bảo tính nhất quán (tùy thuộc vào thiết kế)
            // Để đơn giản và chắc chắn, chờ socket phát lại.
            // setMessages(prevMessages => [...prevMessages, response.messageSent]); // Bỏ optimistic update ở đây

            setNewMessageContent(''); // Xóa input

        } catch (error: any) {
            alert(error.message || "Lỗi gửi tin nhắn");
        } finally {
            setIsSending(false);
        }
    };

    // Hàm tìm kiếm người dùng mới để chat (sẽ dùng cho ô tìm kiếm)
    const handleSearchUsers = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) { // Yêu cầu ít nhất 2 ký tự để tìm kiếm
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(async () => {
            setLoadingSearch(true);
            setSearchError(null);
            try {
                // TODO: Tạo API users/search ở backend (hoặc dùng API Event/User Search đã có)
                // const response = await searchUsersApi(query);
                // Giả lập API Search
                await new Promise(res => setTimeout(res, 300));
                const mockResults = [
                    { id: 1, username: 'user1', fullName: 'Người Dùng 1', avatarUrl: '/default-avatar.png' },
                    { id: 2, username: 'user2', fullName: 'Người Dùng 2', avatarUrl: '/default-avatar.png' },
                ].filter(u => u.username.includes(query) || u.fullName.includes(query));

                setSearchResults(mockResults.filter(u => u.id !== user?.id)); // Không hiển thị chính mình
            } catch (err: any) {
                setSearchError(err.message || 'Lỗi tìm kiếm người dùng.');
            } finally {
                setLoadingSearch(false);
            }
        }, 300); // Debounce search
    };

    const handleStartNewChat = async (recipientId: number) => {
        if (!user) return;
        setLoadingSearch(true); // Dùng loading search cho việc này
        try {
            const conversation = await findOrCreatePrivateConversationApi(recipientId);
            handleSelectConversation(conversation); // Mở cuộc trò chuyện mới/đã có
            // Sau khi mở, cần đảm bảo danh sách conversations được cập nhật
            // Cần một cơ chế refresh list conversations (ví dụ: trigger lại fetchConversations)
            const response = await getUserConversationsApi(); // Fetch lại danh sách conversations
            setConversations(response.conversations);

        } catch (error: any) {
            setSearchError(error.message || 'Không thể bắt đầu chat.');
        } finally {
            setLoadingSearch(false);
        }
    };


    return (
        <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: '400px', maxWidth: '100%' }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    {activeConversation ? (
                        <div className="d-flex align-items-center">
                            <Button variant="link" size="sm" onClick={() => setActiveConversation(null)} className="me-2 p-0">
                                <ArrowLeft />
                            </Button>
                            <RBImage
                                src={activeConversation.otherParticipant?.avatarUrl || defaultAvatar}
                                roundedCircle width={32} height={32} className="me-2" style={{objectFit: 'cover'}}
                            />
                            {activeConversation.otherParticipant?.fullName || activeConversation.otherParticipant?.username || 'Người dùng'}
                        </div>
                    ) : (
                        "Tin nhắn"
                    )}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0 d-flex flex-column">
                {/* --- KHU VỰC DANH SÁCH CUỘC TRÒ CHUYỆN --- */}
                {activeConversation ? (
                    // Ẩn danh sách khi có cuộc trò chuyện active
                    null
                ) : (
                    <div className="conversation-list flex-grow-1" style={{ overflowY: 'auto' }}>
                        {/* Nút/Form tìm kiếm chat mới */}
                        <div className="p-2 border-bottom">
                            {showNewChatSearch ? (
                                <InputGroup className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm người dùng..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearchUsers(e.target.value)}
                                        disabled={loadingSearch}
                                    />
                                    <Button variant="outline-secondary" onClick={() => { setShowNewChatSearch(false); setSearchQuery(''); setSearchResults([]); setSearchError(null); }}>
                                        <XCircleFill />
                                    </Button>
                                </InputGroup>
                            ) : (
                                <Button variant="primary" className="w-100 mb-2" onClick={() => setShowNewChatSearch(true)}>
                                    <PersonPlus className="me-2" /> Bắt đầu cuộc trò chuyện mới
                                </Button>
                            )}
                            {loadingSearch && <div className="text-center"><Spinner size="sm"/> Đang tìm...</div>}
                            {searchError && <Alert variant="danger" size="sm" className="py-1">{searchError}</Alert>}

                            {/* Kết quả tìm kiếm */}
                            {searchQuery.length >= 2 && searchResults.length > 0 && (
                                <ListGroup className="search-results mb-3">
                                    {searchResults.map(result => (
                                        <ListGroup.Item key={result.id} action onClick={() => handleStartNewChat(result.id)} className="d-flex align-items-center">
                                            <RBImage src={result.avatarUrl || defaultAvatar} roundedCircle width={32} height={32} className="me-2" style={{objectFit: 'cover'}}/>
                                            {result.fullName || result.username}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                            {searchQuery.length >=2 && !loadingSearch && searchResults.length === 0 && !searchError && (
                                <p className="text-muted small text-center">Không tìm thấy người dùng nào.</p>
                            )}
                        </div>

                        {loadingConversations && <div className="p-3 text-center"><Spinner size="sm" /> Đang tải cuộc trò chuyện...</div>}
                        {errorConversations && <Alert variant="danger" className="m-2">{errorConversations}</Alert>}
                        {!loadingConversations && conversations.length === 0 && !errorConversations && !showNewChatSearch && (
                            <p className="p-3 text-muted text-center">Chưa có cuộc trò chuyện nào.</p>
                        )}
                        <ListGroup variant="flush">
                            {conversations.map(conv => (
                                <ConversationListItem
                                    key={conv.id}
                                    conversation={conv}
                                    isActive={activeConversation?.id === conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                />
                            ))}
                        </ListGroup>
                    </div>
                )}

                {/* --- KHU VỰC CỬA SỔ CHAT CHI TIẾT --- */}
                {activeConversation ? (
                    <div className="message-window d-flex flex-column flex-grow-1">
                        {/* Phần hiển thị tin nhắn */}
                        <div className="messages-area flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                            {loadingMessages && <div className="text-center"><Spinner size="sm" /> Đang tải tin nhắn...</div>}
                            {errorMessages && <Alert variant="danger">{errorMessages}</Alert>}
                            {!loadingMessages && messages.map(msg => (
                                <MessageItem key={msg.id} message={msg} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        {/* Phần nhập tin nhắn */}
                        <Form onSubmit={handleSendMessage} className="message-input-area p-2 border-top">
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessageContent}
                                    onChange={(e) => setNewMessageContent(e.target.value)}
                                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e as any); }}}
                                    disabled={isSending}
                                    style={{ resize: 'none' }}
                                />
                                {/* TODO: Thêm nút đính kèm file */}
                                <Button variant="primary" type="submit" disabled={isSending || !newMessageContent.trim()}>
                                    {isSending ? <Spinner size="sm" /> : <SendFill />}
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                ) : null}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ChatDashboard;