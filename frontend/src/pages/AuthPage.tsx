"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Container, Form, Button, Alert, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Google, EnvelopeFill, LockFill, PersonFill } from "react-bootstrap-icons"
import gsap from "gsap"
import "./AuthPage.css"

const AuthPage = () => {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  // Refs for GSAP animations
  const spaceBackgroundRef = useRef<HTMLDivElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)
  const planet1Ref = useRef<HTMLDivElement>(null)
  const planet2Ref = useRef<HTMLDivElement>(null)
  const planet3Ref = useRef<HTMLDivElement>(null)
  const brandSectionRef = useRef<HTMLDivElement>(null)
  const authFormRef = useRef<HTMLDivElement>(null)
  const shootingStarRef = useRef<HTMLDivElement>(null)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password })
        navigate("/")
      } else {
        await register(formData)
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // Implement Google login
    console.log("Google login")
  }

  const toggleMode = () => {
    // GSAP animation for form transition
    const formWrapper = authFormRef.current
    if (formWrapper) {
      gsap.to(formWrapper, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setIsLogin(!isLogin)
          setError(null)
          setFormData({ username: "", email: "", password: "" })

          gsap.to(formWrapper, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            delay: 0.1,
          })
        },
      })
    } else {
      setIsLogin(!isLogin)
      setError(null)
      setFormData({ username: "", email: "", password: "" })
    }
  }

  // Initialize stars canvas
  useEffect(() => {
    if (!starsCanvasRef.current) return

    const canvas = starsCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth
        canvas.height = canvas.parentElement.offsetHeight
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create stars
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []
    const createStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 1000)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          opacity: Math.random(),
          speed: Math.random() * 0.05,
        })
      }
    }

    createStars()

    // Animate stars
    const animateStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get theme
      const theme = document.documentElement.getAttribute("data-theme") || "dark"
      const starColor = theme === "dark" ? "255, 255, 255" : "0, 0, 0"

      stars.forEach((star) => {
        star.opacity += Math.random() * 0.01 - 0.005
        if (star.opacity < 0) star.opacity = 0
        if (star.opacity > 1) star.opacity = 1

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`
        ctx.fill()

        // Move stars slightly
        star.y += star.speed

        // Reset star position if it goes off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animateStars)
    }

    animateStars()

    // Create shooting stars randomly
    const createShootingStar = () => {
      if (!shootingStarRef.current) return

      const shootingStar = shootingStarRef.current

      // Random position
      const startX = Math.random() * window.innerWidth
      const startY = Math.random() * (window.innerHeight / 2)

      gsap.set(shootingStar, {
        x: startX,
        y: startY,
        opacity: 0,
        rotation: -45,
      })

      gsap.to(shootingStar, {
        x: startX + 1000,
        y: startY + 1000,
        opacity: 1,
        duration: 0.5,
        ease: "power1.in",
        onComplete: () => {
          gsap.to(shootingStar, {
            opacity: 0,
            duration: 0.5,
          })
        },
      })

      // Schedule next shooting star
      const delay = Math.random() * 10000 + 5000 // 5-15 seconds
      setTimeout(createShootingStar, delay)
    }

    // Start shooting stars after a delay
    setTimeout(createShootingStar, 2000)

    // GSAP animations for planets and content
    gsap.fromTo(
      planet1Ref.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" },
    )

    gsap.fromTo(
      planet2Ref.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, delay: 0.3, ease: "elastic.out(1, 0.5)" },
    )

    gsap.fromTo(
      planet3Ref.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, delay: 0.6, ease: "elastic.out(1, 0.5)" },
    )

    // Animate brand section
    gsap.fromTo(
      brandSectionRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
    )

    // Animate auth form
    gsap.fromTo(
      authFormRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" },
    )

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="auth-page">
      {/* Space Background */}
      <div className="space-background" ref={spaceBackgroundRef}>
        <canvas className="stars-canvas" ref={starsCanvasRef}></canvas>
        <div className="planet planet-1 float" ref={planet1Ref}></div>
        <div className="planet planet-2 float-reverse" ref={planet2Ref}></div>
        <div className="planet planet-3 float" ref={planet3Ref}></div>
        <div className="shooting-star" ref={shootingStarRef}></div>
        <div className="space-fog"></div>
      </div>

      <Container className="auth-container">
        <div className="auth-wrapper">
          {/* Brand Section */}
          <div className="brand-section" ref={brandSectionRef}>
            <Image
              src="/logo.png"
              alt="VolunHub Logo"
              className="auth-logo hover-scale hover-glow"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://via.placeholder.com/120?text=VolunHub"
              }}
            />
            <h1 className="brand-title">VolunHub</h1>
            <p className="brand-subtitle">Kết nối - Chia sẻ - Lan tỏa yêu thương</p>
          </div>

          {/* Auth Form */}
          <div className="auth-form-container">
            <div className="auth-form-wrapper" ref={authFormRef}>
              <h2 className="auth-title">{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>

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
                      placeholder=" "
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          username: e.target.value,
                        })
                      }
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
                    placeholder=" "
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                  <label>
                    <EnvelopeFill /> Email
                  </label>
                </div>

                <div className="form-floating mb-4">
                  <Form.Control
                    type="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                  <label>
                    <LockFill /> Mật khẩu
                  </label>
                </div>

                <Button variant="primary" type="submit" className="w-100 mb-3 auth-button" disabled={loading}>
                  {loading ? <div className="spinner-border spinner-border-sm" /> : isLogin ? "Đăng nhập" : "Đăng ký"}
                </Button>

                <div className="divider">
                  <span>Hoặc</span>
                </div>

                <Button
                  variant="outline-primary"
                  className="w-100 mb-4 google-btn"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <Google className="me-2" />
                  Tiếp tục với Google
                </Button>

                <p className="d-flex justify-content-center gap-2 text-center mb-0">
                  {isLogin ? (
                    <>
                      Chưa có tài khoản?{" "}
                      <Button variant="link" className="p-0 border-0 toggle-mode" onClick={toggleMode}>
                        Đăng ký ngay
                      </Button>
                    </>
                  ) : (
                    <>
                      Đã có tài khoản?{" "}
                      <Button variant="link" className="p-0 border-0 toggle-mode" onClick={toggleMode}>
                        Đăng nhập
                      </Button>
                    </>
                  )}
                </p>
              </Form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AuthPage
