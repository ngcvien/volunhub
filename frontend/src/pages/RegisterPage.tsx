import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap'; // Thêm Spinner
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

        // Validation cơ bản phía client (có thể thêm phức tạp hơn)
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
            setTimeout(() => navigate('/login'), 2000); // Chuyển hướng sau khi thành công
        } catch (err: any) {
            setError(err.message || 'Đã xảy ra lỗi không mong muốn khi đăng ký.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5"> {/* Thêm mb-5 */}
            <Row className="justify-content-md-center">
                <Col xs={12} md={12} lg={20} xl={200}>
                    <Card className="shadow-sm border-0"> {/* Bỏ border */}
                        <Card.Body className="p-4 p-md-5"> {/* Tăng padding trên màn hình lớn */}
                            <h2 className="text-center mb-4 fw-bold text-primary">Đăng Ký VolunHub</h2> {/* Thêm màu primary */}
                            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form noValidate onSubmit={handleSubmit}> {/* Thêm noValidate để dùng validation của React */}
                                <Form.Group className="mb-3" controlId="registerUsername">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập tên đăng nhập"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        disabled={loading}
                                        isInvalid={!!error && error.toLowerCase().includes('tên đăng nhập')} // Highlight nếu lỗi liên quan
                                    />
                                    {/* Có thể thêm Form.Control.Feedback type="invalid" */}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="registerEmail">
                                    <Form.Label>Địa chỉ email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        isInvalid={!!error && error.toLowerCase().includes('email')} // Highlight nếu lỗi liên quan
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="registerPassword">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ít nhất 6 ký tự"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        disabled={loading}
                                        isInvalid={!!error && error.toLowerCase().includes('mật khẩu')} // Highlight nếu lỗi liên quan
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        'Đăng Ký'
                                    )}
                                </Button>
                            </Form>
                            <div className="mt-4 text-center"> {/* Tăng margin top */}
                                Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;