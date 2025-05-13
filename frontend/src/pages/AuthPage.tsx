import React, { useState } from 'react';
import { Container, Form, Button, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Google, EnvelopeFill, LockFill, PersonFill } from 'react-bootstrap-icons';
import './AuthPage.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        navigate('/');
      } else {
        await register(formData);
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // Implement Google login
    console.log('Google login');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-sphere gradient-sphere-1"></div>
        <div className="gradient-sphere gradient-sphere-2"></div>
        <div className="gradient-sphere gradient-sphere-3"></div>
      </div>

      <Container className="auth-container">
        <div className="auth-wrapper">
          {/* Brand Section */}
          <motion.div 
            className="brand-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* <Image 
              src="/" 
              alt="VolunHub Logo" 
              className="auth-logo" 
            /> */}
            <Image
            src='Feta-IG-Web-A.png'
            height={500}
            // width={100}
            />
            <h1 className="brand-title">VolunHub</h1>
            <p className="brand-subtitle">
              Kết nối - Chia sẻ - Lan tỏa yêu thương
            </p>
          </motion.div>

          {/* Auth Form */}
          <div className="auth-form-container">
            <motion.div 
              className="auth-form-wrapper"
              initial={false}
              animate={{ height: isLogin ? '400px' : '480px' }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'register'}
                  initial={{ opacity: 0, x: isLogin ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 50 : -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="auth-title">
                    {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                  </h2>

                  {error && (
                    <Alert variant="danger" className="mb-3">
                      {error}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {!isLogin && (
                      <div className="form-floating mb-3">
                        <Form.Control
                          type="text"
                          placeholder=""
                          value={formData.username}
                          onChange={(e) => setFormData({
                            ...formData,
                            username: e.target.value
                          })}
                          required
                        />
                        <label>
                          <PersonFill /> Tên người dùng
                        </label>
                      </div>
                    )}

                    <div className="form-floating mb-3">
                      <Form.Control
                        type="email"
                        placeholder=""
                        value={formData.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          email: e.target.value
                        })}
                        required
                      />
                      <label>
                        <EnvelopeFill /> Email
                      </label>
                    </div>

                    <div className="form-floating mb-4">
                      <Form.Control
                        type="password"
                        placeholder=""
                        value={formData.password}
                        onChange={(e) => setFormData({
                          ...formData,
                          password: e.target.value
                        })}
                        required
                      />
                      <label>
                        <LockFill /> Mật khẩu
                      </label>
                    </div>

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 mb-3 no-border home-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="spinner-border spinner-border-sm" />
                      ) : (
                        isLogin ? 'Đăng nhập' : 'Đăng ký'
                      )}
                    </Button>

                    <div className="divider">
                      <span>Hoặc</span>
                    </div>

                    <Button
                      variant="outline-primary"
                      className="w-100 mb-4 google-btn events-button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                    >
                      <Google className="me-2" />
                      Tiếp tục với Google
                    </Button>

                    <p className="d-flex justify-content-center gap-2 text-center mb-0">
                      {isLogin ? (
                        <>
                          Chưa có tài khoản?{' '}
                          <Button 
                            variant="link" 
                            className="p-0 border-0 text-decoration-none "
                            onClick={toggleMode}
                          >
                            Đăng ký ngay
                          </Button>
                        </>
                      ) : (
                        <>
                          Đã có tài khoản?{' '}
                          <Button 
                            variant="link" 
                            className="p-0 border-0 text-decoration-none"
                            onClick={toggleMode}
                          >
                            Đăng nhập
                          </Button>
                        </>
                      )}
                    </p>
                  </Form>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AuthPage;