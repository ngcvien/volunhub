"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card, Table, Badge, Container } from "react-bootstrap"
import { getLeaderboardApi } from "../api/user.api"
import type { User } from "../types/user.types"
import "../styles/LeaderboardPage.css"

interface LeaderboardUser extends Pick<User, "id" | "username" | "avatarUrl" | "volunpoints" | "fullName"> {}

const LeaderboardPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch data
  useEffect(() => {
    let mounted = true

    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboardApi(20)
        if (mounted) {
          setVolunteers(data.leaderboard || [])
          setError(null)
        }
      } catch (err: any) {
        if (mounted) {
          setError("Không thể tải bảng xếp hạng tình nguyện viên.")
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchLeaderboard()

    return () => {
      mounted = false
    }
  }, [])

  // Tạo hiệu ứng sao trên canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Tạo các ngôi sao
    const stars: Array<{ x: number; y: number; size: number; opacity: number; twinkleSpeed: number }> = []
    const numStars = 150

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.3 + 0.7
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  // Tạo shooting stars
  useEffect(() => {
    const createShootingStar = () => {
      const star = document.createElement("div")
      star.className = "shooting-star"
      star.style.left = Math.random() * window.innerWidth + "px"
      star.style.top = Math.random() * window.innerHeight + "px"
      document.body.appendChild(star)

      setTimeout(() => {
        document.body.removeChild(star)
      }, 3000)
    }

    const interval = setInterval(createShootingStar, 5000)
    return () => clearInterval(interval)
  }, [])

  const renderPodium = () => {
    const topThree = volunteers.slice(0, 3)
    if (topThree.length === 0) return null

    return (
      <div className="podium-section">
        <div className="podium-container">
          {/* Vị trí thứ 2 */}
          {topThree[1] && (
            <div className="podium-item second">
              <img
                src={topThree[1].avatarUrl || "/default-avatar.png"}
                alt={topThree[1].fullName || topThree[1].username}
                className="podium-avatar"
              />
              <div className="podium-info">
                <div className="podium-rank">🥈 2</div>
                <div className="podium-name">{topThree[1].fullName || topThree[1].username}</div>
                <div className="podium-username">@{topThree[1].username}</div>
                <div className="podium-points">{topThree[1].volunpoints} điểm</div>
              </div>
            </div>
          )}

          {/* Vị trí thứ 1 */}
          {topThree[0] && (
            <div className="podium-item first">
              <div className="crown">👑</div>
              <img
                src={topThree[0].avatarUrl || "/default-avatar.png"}
                alt={topThree[0].fullName || topThree[0].username}
                className="podium-avatar"
              />
              <div className="podium-info">
                <div className="podium-rank">🏆 1</div>
                <div className="podium-name">{topThree[0].fullName || topThree[0].username}</div>
                <div className="podium-username">@{topThree[0].username}</div>
                <div className="podium-points">{topThree[0].volunpoints} điểm</div>
              </div>
            </div>
          )}

          {/* Vị trí thứ 3 */}
          {topThree[2] && (
            <div className="podium-item third">
              <img
                src={topThree[2].avatarUrl || "/default-avatar.png"}
                alt={topThree[2].fullName || topThree[2].username}
                className="podium-avatar"
              />
              <div className="podium-info">
                <div className="podium-rank">🥉 3</div>
                <div className="podium-name">{topThree[2].fullName || topThree[2].username}</div>
                <div className="podium-username">@{topThree[2].username}</div>
                <div className="podium-points">{topThree[2].volunpoints} điểm</div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="leaderboard-page">
      {/* Canvas cho hiệu ứng sao */}
      <canvas ref={canvasRef} className="stars-canvas" />

      {/* Các hành tinh trang trí */}
      <div className="space-planet planet-1"></div>
      <div className="space-planet planet-2"></div>
      <div className="space-planet planet-3"></div>

      <Container className="leaderboard-container">
        <h1 className="leaderboard-title">🌟 Bảng Vinh Danh Tình Nguyện Viên 🌟</h1>
        <p className="leaderboard-subtitle">Những người hùng thầm lặng đang thay đổi thế giới bằng trái tim nhân ái</p>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Đang tải bảng xếp hạng...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h3>❌ Oops! Có lỗi xảy ra</h3>
            <p>{error}</p>
          </div>
        ) : volunteers.length > 0 ? (
          <>
            {/* Podium cho top 3 */}
            {renderPodium()}

            {/* Bảng xếp hạng đầy đủ */}
            <Card className="leaderboard-card">
              <Table responsive hover className="align-middle leaderboard-table">
                <thead>
                  <tr>
                    <th>🏅 Hạng</th>
                    <th>👤 Avatar</th>
                    <th>📝 Họ tên</th>
                    <th>🔖 Tên đăng nhập</th>
                    <th>⭐ VolunPoint</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((user, idx) => (
                    <tr
                      key={user.id}
                      className={idx < 3 ? `top-${idx + 1}-row` : ""}
                    >
                      <td>
                        <span className={`rank-badge rank-${idx + 1}`}>{idx + 1}</span>
                      </td>
                      <td>
                        <img
                          src={user.avatarUrl || "/default-avatar.png"}
                          alt={user.fullName || user.username}
                          className={`leaderboard-avatar ${idx < 3 ? "top-avatar glow-effect" : ""}`}
                        />
                      </td>
                      <td>
                        <span className="leaderboard-fullname">{user.fullName || "(Chưa cập nhật)"}</span>
                      </td>
                      <td>
                        <span className="leaderboard-username">@{user.username}</span>
                      </td>
                      <td>
                        <Badge className="volunpoint-badge">⭐ {user.volunpoints}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </>
        ) : (
          <div className="text-center mt-4">
            <p>Chưa có dữ liệu bảng xếp hạng</p>
          </div>
        )}
      </Container>
    </div>
  )
}

export default LeaderboardPage
