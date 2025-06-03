// frontend/src/components/Chat/ChatDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, ListGroup, Spinner, Alert, Form, Button, InputGroup } from 'react-bootstrap';
import ConversationListItem from './ConversationListItem';
import { MessageType as MessageDataType, ConversationListItem as ConversationListItemType } from '../../types/chat.types'; // Đổi tên MessageType
import { useAuth } from '../../contexts/AuthContext';
import { getUserConversationsApi} from '../../api/conversation.api'; 
import { getMessagesForConversationApi, sendMessageApi } from '../../api/message.api'; 
import { SendFill } from 'react-bootstrap-icons'; // Icon nút gửi
// import MessageItem from './MessageItem'; // Sẽ tạo sau

interface ChatDashboardProps {
    show: boolean;
    onHide: () => void;
}

const ChatDashboard: React.FC<ChatDashboardProps> = ({ show, onHide }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<ConversationListItemType[]>([]);
    const [activeConversation, setActiveConversation] = useState<ConversationListItemType | null>(null);
    const [messages, setMessages] = useState<MessageDataType[]>([]); // Sẽ là MessageType từ chat.types

    const [loadingConversations, setLoadingConversations] = useState(false);
    const [errorConversations, setErrorConversations] = useState<string | null>(null);

    const [loadingMessages, setLoadingMessages] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string | null>(null);

    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null); // Để tự cuộn xuống tin nhắn mới nhất

    // Fetch danh sách cuộc trò chuyện
    useEffect(() => {
        if (show && user) { // Chỉ fetch khi modal hiện và đã đăng nhập
            const fetchConversations = async () => {
                setLoadingConversations(true);
                setErrorConversations(null);
                try {
                    const response = await getUserConversationsApi();
                    setConversations(response.conversations);
                    // Tự động chọn cuộc trò chuyện đầu tiên nếu có
                    // if (response.conversations.length > 0) {
                    //     handleSelectConversation(response.conversations[0]);
                    // }
                } catch (err: any) {
                    setErrorConversations(err.message || 'Lỗi tải danh sách chat.');
                } finally {
                    setLoadingConversations(false);
                }
            };
            fetchConversations();
        } else {
            // Reset khi đóng
            setConversations([]);
            setActiveConversation(null);
            setMessages([]);
        }
    }, [show, user]); // Chạy lại khi show hoặc user thay đổi

    // Fetch tin nhắn khi chọn một cuộc trò chuyện
    useEffect(() => {
        if (activeConversation) {
            const fetchMessages = async () => {
                setLoadingMessages(true);
                setErrorMessages(null);
                try {
                    const response = await getMessagesForConversationApi(activeConversation.id);
                    setMessages(response.messages.reverse()); // Đảo ngược để hiển thị đúng thứ tự (cũ->mới) và scroll
                } catch (err: any) {
                    setErrorMessages(err.message || 'Lỗi tải tin nhắn.');
                } finally {
                    setLoadingMessages(false);
                }
            };
            fetchMessages();
        } else {
            setMessages([]); // Xóa tin nhắn nếu không có active conversation
        }
    }, [activeConversation]);

     // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSelectConversation = (conversation: ConversationListItemType) => {
        setActiveConversation(conversation);
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || !user) return;

        setIsSending(true);
        try {
            const response = await sendMessageApi(activeConversation.id, { content: newMessage });
            // Thêm tin nhắn mới vào state (cập nhật UI lạc quan hoặc chờ API trả về)
            // Backend nên trả về tin nhắn mới kèm sender đầy đủ
            setMessages(prevMessages => [...prevMessages, response.messageSent]);
            setNewMessage(''); // Xóa input

            // TODO: Cập nhật lại updatedAt của conversation này trong list conversations
            // để nó nhảy lên đầu (cần HomePage refresh lại conversations)

        } catch (error: any) {
            alert(error.message || "Lỗi gửi tin nhắn");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: '400px' /* Hoặc tùy chỉnh */ }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Tin nhắn</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0 d-flex flex-column">
                {/* Danh sách cuộc trò chuyện */}
                <div className="conversation-list border-end" style={{ width: '100%', display: activeConversation ? 'none' : 'block', overflowY: 'auto'}}> {/* Tạm thời ẩn khi có active */}
                    {loadingConversations && <div className="p-3 text-center"><Spinner size="sm" /></div>}
                    {errorConversations && <Alert variant="danger" className="m-2">{errorConversations}</Alert>}
                    {!loadingConversations && conversations.length === 0 && !errorConversations && (
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

                {/* Cửa sổ chat chi tiết (TODO: Tách ra component MessageWindow sau) */}
                {activeConversation && (
                    <div className="message-window d-flex flex-column flex-grow-1" style={{ /*height: '100%'*/ }}>
                         {/* Header của cửa sổ chat (tên người chat cùng) */}
                        <div className="message-window-header p-2 border-bottom d-flex align-items-center">
                            <Button variant="link" size="sm" onClick={() => setActiveConversation(null)} className="me-2 d-md-none">
                                <i className="bi bi-arrow-left"></i> {/* Nút Back trên mobile */}
                            </Button>
                             {/* Hiển thị tên người chat cùng */}
                            <span className="fw-bold">
                                {activeConversation.type === 'private' && activeConversation.otherParticipant
                                    ? (activeConversation.otherParticipant.fullName || activeConversation.otherParticipant.username)
                                    : activeConversation.type === 'group' ? 'Tên Nhóm Chat' : 'Cuộc trò chuyện'
                                }
                            </span>
                        </div>
                        {/* Phần hiển thị tin nhắn */}
                        <div className="messages-area flex-grow-1 p-3" style={{ overflowY: 'auto' }}>
                            {loadingMessages && <div className="text-center"><Spinner size="sm" /></div>}
                            {errorMessages && <Alert variant="danger">{errorMessages}</Alert>}
                            {!loadingMessages && messages.map(msg => (
                                // TODO: Tạo component MessageItem để hiển thị tin nhắn (sent/received)
                                <div key={msg.id} className={`message-bubble mb-2 p-2 rounded ${msg.senderId === user?.id ? 'sent bg-primary text-white ms-auto' : 'received bg-light text-dark me-auto'}`} style={{maxWidth: '75%'}}>
                                    {/* <small className="d-block text-muted" style={{fontSize:'0.7em'}}>{msg.sender?.username}</small> */}
                                    <div>{msg.content}</div>
                                    <small className={`d-block text-end mt-1 ${msg.senderId === user?.id ? 'text-light-emphasis' : 'text-muted'}`} style={{fontSize:'0.65em'}}>
                                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                                    </small>
                                </div>
                            ))}
                            <div ref={messagesEndRef} /> {/* Để tự cuộn */}
                        </div>
                        {/* Phần nhập tin nhắn */}
                        <Form onSubmit={handleSendMessage} className="message-input-area p-2 border-top">
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    rows={1}
                                    placeholder="Nhập tin nhắn..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e as any);}}}
                                    disabled={isSending}
                                    style={{ resize: 'none' }}
                                />
                                {/* TODO: Thêm nút đính kèm file */}
                                <Button variant="primary" type="submit" disabled={isSending || !newMessage.trim()}>
                                    {isSending ? <Spinner size="sm" /> : <SendFill />}
                                </Button>
                            </InputGroup>
                        </Form>
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ChatDashboard;