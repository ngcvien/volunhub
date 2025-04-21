import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap'; // Thêm Spinner
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const LoginPage = () => {
    const { login } = useAuth(); // Lấy hàm login từ context
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError('Vui lòng nhập email và mật khẩu.');
            return;
        }

        setLoading(true);
        try {
            await login({ email, password }); // Gọi hàm login từ context
            navigate('/'); // Chuyển về trang chủ nếu đăng nhập thành công
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="mt-5 mb-5">
            <Row className="justify-content-md-center">
                <Col xs={12} md={12} lg={20} xl={200}>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="text-center mb-4 fw-bold text-primary">Đăng Nhập VolunHub</h2>
                            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="loginEmail">
                                    <Form.Label>Địa chỉ email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Nhập email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        isInvalid={!!error} // Highlight cả 2 nếu có lỗi chung
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="loginPassword">
                                    <Form.Label>Mật khẩu</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        isInvalid={!!error} // Highlight cả 2 nếu có lỗi chung
                                    />
                                    {/* TODO: Thêm link "Quên mật khẩu?" sau */}
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
                                        'Đăng Nhập'
                                    )}
                                </Button>
                            </Form>
                            <div className="mt-4 text-center">
                                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;