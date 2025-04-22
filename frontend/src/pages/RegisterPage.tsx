import React, { useState } from 'react';
// Import thêm Spinner, Image nếu cần
import { Form, Button, Container, Row, Col, Alert, Spinner, Image } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        if (!username || !email) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        setLoading(true);
        try {
            await register({ username, email, password });
            setSuccess('Đăng ký thành công! Chuyển đến trang đăng nhập sau 2 giây...');
            setUsername('');
            setEmail('');
            setPassword('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'Đã xảy ra lỗi không mong muốn khi đăng ký.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Container fluid để chiếm hết chiều rộng, vh-100 để chiếm hết chiều cao viewport
        <Container fluid className="vh-100 p-0">
            {/* Row chiếm hết chiều cao, căn giữa nội dung theo chiều dọc */}
            <Row className="g-0 h-100 align-items-center">

                {/* --- CỘT TRÁI (Ảnh/Text) - Ẩn trên màn hình nhỏ --- */}
                <Col md={6} lg={7} className="d-none d-md-flex align-items-center justify-content-center p-5 h-100" style={{ /* backgroundColor: '#111' */ }}>
                    {/* Thay thế bằng nội dung và ảnh của bạn */}
                    <div className="text-center text-light">
                        <Image src="..\src\assets\Feta-IG-Web-A.png" className="hover-effect-image" fluid rounded style={{ maxWidth: '700px', marginBottom: '30px' }} />

                    </div>
                </Col>

                {/* --- CỘT PHẢI (Form Đăng ký) --- */}
                {/* Căn giữa nội dung cột này */}
                <Col xs={12} md={6} lg={5} className="d-flex flex-column align-items-center justify-content-center p-4 h-100">
                    {/* Container giới hạn độ rộng của form */}
                    <div style={{ width: '100%', maxWidth: '380px' }}>

                        <div className="text-center mb-4"> {/* Giảm mb từ 5 xuống 4 */}
                            {/* Có thể thêm logo VolunHub ở đây */}
                            <h1 className="fw-bold">VolunHub</h1>
                            <h2 className="fw-bold mt-3 h4">Đăng Ký</h2> {/* Đổi thành h4 cho nhỏ hơn */}
                        </div>

                        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible className="py-2" style={{ fontSize: '0.9em' }}>{error}</Alert>}
                        {success && <Alert variant="success" className="py-2" style={{ fontSize: '0.9em' }}>{success}</Alert>}

                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-2" controlId="registerUsername">
                                <Form.Control
                                    size="lg"
                                    type="text"
                                    placeholder="Tên đăng nhập"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Form.Group className="mb-2" controlId="registerEmail">
                                <Form.Control
                                    size="lg"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="registerPassword">
                                <Form.Control
                                    size="lg"
                                    type="password"
                                    placeholder="Mật khẩu (ít nhất 6 ký tự)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-3 submit-button" size="lg" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Đăng Ký'}
                            </Button>
                        </Form>
                        <div className="mt-4 text-center"> {/* Tăng margin top */}
                            Đã có tài khoản? <Link to="/login" style={{ color: 'var(--bs-primary-text-emphasis)' }}>Đăng nhập</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;