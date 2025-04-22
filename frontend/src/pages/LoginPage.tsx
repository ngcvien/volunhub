import React, { useState } from 'react';
// Import thêm các component cần thiết, bỏ Card
import { Form, Button, Container, Row, Col, Alert, Spinner, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Giữ lại useAuth
import './LoginPage.css'; 

const LoginPage = () => {
    const { login } = useAuth();
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
            await login({ email, password });
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại.');
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
                <Col md={6} lg={7} className="d-none d-md-flex align-items-center justify-content-center p-5 h-100" style={{ /* backgroundColor: '#111' */ /* Có thể thêm màu nền khác biệt nhẹ */ }}>
                     <div className="text-center text-light">
                         <Image src="..\src\assets\Feta-IG-Web-A.png"  className="hover-effect-image" fluid rounded style={{ maxWidth: '700px', marginBottom: '30px' }}/>  
                     </div>
                </Col>

                {/* --- CỘT PHẢI (Form Đăng nhập) --- */}
                 {/* Căn giữa nội dung cột này */}
                <Col xs={12} md={6} lg={5} className="d-flex flex-column align-items-center justify-content-center p-4 h-100">
                     {/* Container giới hạn độ rộng của form */}
                    <div style={{ width: '100%', maxWidth: '380px' }}>

                        {/* Card bị loại bỏ, style trực tiếp hoặc qua CSS */}
                        <div className="text-center mb-5">
                            {/* Có thể thêm logo VolunHub ở đây */}
                            <h1 className="fw-bold">VolunHub</h1> {/* Hoặc logo */}
                        </div>

                        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible className="py-2" style={{fontSize: '0.9em'}}>{error}</Alert>}

                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-2" controlId="loginEmail">
                                {/* Không dùng Label, dùng placeholder */}
                                <Form.Control
                                    size="lg" // Input lớn hơn
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    // Thêm style nếu cần (Dark mode của Bootstrap thường đã xử lý input khá tốt)
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="loginPassword">
                                <Form.Control
                                    size="lg"
                                    type="password"
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-3 submit-button" size="lg" disabled={loading}>
                                {loading ? <Spinner animation="border" size="sm" /> : 'Đăng Nhập'}
                            </Button>

                            {/* Đường kẻ phân cách */}
                            <div className="text-center my-4 position-relative">
                                <hr style={{borderColor: 'var(--bs-secondary-color)'}}/> {/* Đổi màu đường kẻ */}
                                <span
                                  className="position-absolute top-50 start-50 translate-middle px-2"
                                  style={{ fontSize: '0.9em', backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-secondary-color)'}}
                                >
                                  HOẶC
                                </span>
                            </div>

                            {/* Nút/Link Tạo tài khoản */}
                            <div className="text-center">
                                 <Link to="/register" className="btn btn-link text-decoration-none fw-bold" style={{color: 'var(--bs-primary-text-emphasis)'}}> {/* Màu link sáng hơn */}
                                    Tạo tài khoản mới
                                </Link>
                            </div>

                            {/* Link Quên mật khẩu (nếu cần) */}
                            <div className="text-center mt-3">
                                <Link to="/forgot-password" style={{ fontSize: '0.9em', color: 'var(--bs-secondary-color)' }}>Quên mật khẩu?</Link>
                            </div>

                        </Form>
                    </div>
                    {/* Footer nhỏ (nếu cần) */}
                    {/* <div className="position-absolute bottom-0 mb-3 text-center text-muted" style={{fontSize: '0.8em'}}>
                         &copy; {new Date().getFullYear()} VolunHub
                    </div> */}
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;