"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../pages/NotFoundPage.css"

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [count, setCount] = useState(30)

  // Handle mouse movement for the parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX / window.innerWidth - 0.5,
      y: e.clientY / window.innerHeight - 0.5,
    })
  }

  // Countdown timer for auto-redirect
  useEffect(() => {
    const timer = count > 0 && setInterval(() => setCount(count - 1), 1000)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [count])

  // Auto-redirect after countdown
  useEffect(() => {
    if (count === 0) {
      window.location.href = "/"
    }
  }, [count])

  return (
    <div className="not-found-container" onMouseMove={handleMouseMove}>
      <div className="stars-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div
        className="parallax-bg"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        }}
      />

      <div className="content-wrapper">
        <div className="error-code">
          <span className="digit">4</span>
          <div className="planet">
            <div className="ring"></div>
            <div className="cover-ring"></div>
            <div className="planet-surface"></div>
          </div>
          <span className="digit">4</span>
        </div>

        <h1 className="error-title">Oops! Trang không tìm thấy</h1>

        <p className="error-message">
          Có vẻ như bạn đã đi lạc vào vũ trụ VolunHub. Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div className="action-buttons">
          <Link to="/" className="home-button">
            <span className="button-icon">🏠</span>
            <span className="button-text">Về trang chủ</span>
          </Link>

          <Link to="/about" className="events-button">
            <span className="button-icon">🔍</span>
            <span className="button-text">Khám phá volunhub</span>
          </Link>
        </div>

        <div className="redirect-message">
          Tự động chuyển hướng về trang chủ sau <span className="countdown">{count}</span> giây
        </div>

        <div className="astronaut">
          <div className="astronaut-helmet"></div>
          <div className="astronaut-body"></div>
          <div className="astronaut-arm left"></div>
          <div className="astronaut-arm right"></div>
          <div className="astronaut-leg left"></div>
          <div className="astronaut-leg right"></div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
