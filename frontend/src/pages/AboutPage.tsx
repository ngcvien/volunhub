"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link } from "react-router-dom"
import {
    FaUsers,
    FaHeart,
    FaQuestionCircle,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaRocket,
    FaSatellite,
    FaGlobeAsia,
    FaSpaceShuttle,
    FaFacebookF, 
    FaTwitter,
    FaInstagram, 
    FaLinkedinIn,
    FaGithub 
} from "react-icons/fa"
import "./AboutPage.css"

// Đăng ký plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const AboutPage = () => {
    const headerRef = useRef<HTMLDivElement>(null)
    const missionRef = useRef<HTMLDivElement>(null)
    const valuesRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)
    const historyRef = useRef<HTMLDivElement>(null)
    const teamRef = useRef<HTMLDivElement>(null)
    const partnersRef = useRef<HTMLDivElement>(null)
    const testimonialsRef = useRef<HTMLDivElement>(null)
    const faqRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)
    const footerRef = useRef<HTMLDivElement>(null)
    const starsCanvasRef = useRef<HTMLCanvasElement>(null)

    // State để theo dõi mission card đang được active
    const [activeMission, setActiveMission] = useState(0)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Xử lý parallax effect
    const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({
            x: e.clientX / window.innerWidth - 0.5,
            y: e.clientY / window.innerHeight - 0.5,
        })
    }

    useEffect(() => {
        // Tạo hiệu ứng ngôi sao
        const createStarryBackground = () => {
            const canvas = starsCanvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext("2d")
            if (!ctx) return

            // Thiết lập kích thước canvas
            const setCanvasSize = () => {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight * 3 // Cao hơn để bao phủ toàn bộ trang
            }

            setCanvasSize()
            window.addEventListener("resize", setCanvasSize)

            // Tạo các ngôi sao
            const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = []
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2,
                    opacity: Math.random(),
                    speed: 0.05 + Math.random() * 0.1,
                })
            }

            // Vẽ và animation các ngôi sao
            const drawStars = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // Vẽ gradient nền
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
                gradient.addColorStop(0, "rgba(10, 10, 40, 1)")
                gradient.addColorStop(0.5, "rgba(20, 20, 60, 1)")
                gradient.addColorStop(1, "rgba(5, 5, 20, 1)")

                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Vẽ các ngôi sao
                stars.forEach((star) => {
                    ctx.beginPath()
                    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
                    ctx.fill()

                    // Cập nhật opacity để tạo hiệu ứng nhấp nháy
                    star.opacity += Math.random() * 0.01 - 0.005
                    if (star.opacity < 0.1) star.opacity = 0.1
                    if (star.opacity > 1) star.opacity = 1

                    // Di chuyển ngôi sao
                    star.y -= star.speed
                    if (star.y < 0) {
                        star.y = canvas.height
                        star.x = Math.random() * canvas.width
                    }
                })

                requestAnimationFrame(drawStars)
            }

            drawStars()

            return () => {
                window.removeEventListener("resize", setCanvasSize)
            }
        }

        createStarryBackground()

        // Thêm event listener cho hiệu ứng parallax
        window.addEventListener("mousemove", handleMouseMove)

        // Animation cho header
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
            },
        )

        // Animation cho mission section
        gsap.fromTo(
            missionRef.current?.querySelector(".mission-intro"),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: "top 80%",
                },
            },
        )

        gsap.fromTo(
            missionRef.current?.querySelectorAll(".mission-card"),
            { opacity: 0, y: 50, scale: 0.9 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: "top 70%",
                },
            },
        )

        // Animation cho mission detail
        gsap.fromTo(
            missionRef.current?.querySelector(".mission-detail"),
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: missionRef.current,
                    start: "top 60%",
                },
            },
        )

        // Animation cho values section
        gsap.fromTo(
            valuesRef.current?.querySelectorAll(".value-card"),
            { opacity: 0, scale: 0.8, rotation: -5 },
            {
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: valuesRef.current,
                    start: "top 75%",
                },
            },
        )

        // Animation cho stats section
        gsap.fromTo(
            statsRef.current?.querySelectorAll(".stat-item"),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 80%",
                },
            },
        )

        // Animation cho history section
        gsap.fromTo(
            historyRef.current?.querySelectorAll(".history-item"),
            { opacity: 0, x: (index) => (index % 2 === 0 ? -50 : 50) },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: historyRef.current,
                    start: "top 75%",
                },
            },
        )

        // Animation cho team section
        gsap.fromTo(
            teamRef.current?.querySelectorAll(".team-member"),
            { opacity: 0, y: 50, rotation: -3 },
            {
                opacity: 1,
                y: 0,
                rotation: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: teamRef.current,
                    start: "top 75%",
                },
            },
        )

        // Animation cho partners section
        gsap.fromTo(
            partnersRef.current?.querySelectorAll(".partner-logo"),
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: partnersRef.current,
                    start: "top 80%",
                },
            },
        )

        // Animation cho testimonials section
        gsap.fromTo(
            testimonialsRef.current?.querySelectorAll(".testimonial-card"),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: testimonialsRef.current,
                    start: "top 80%",
                },
            },
        )

        // Animation cho FAQ section
        gsap.fromTo(
            faqRef.current?.querySelectorAll(".faq-item"),
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: faqRef.current,
                    start: "top 80%",
                },
            },
        )

        // Animation cho contact section
        gsap.fromTo(
            contactRef.current?.querySelectorAll(".contact-info, .contact-form"),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: contactRef.current,
                    start: "top 80%",
                },
            },
        )

        // Animation cho CTA section
        gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 85%",
                },
            },
        )

        // Animation cho footer
        gsap.fromTo(
            footerRef.current?.querySelectorAll(".footer-column"),
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top 95%",
                },
            },
        )

        // Thiết lập interval để tự động chuyển đổi mission card
        const interval = setInterval(() => {
            setActiveMission((prev) => (prev + 1) % 3)
        }, 5000)

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
            clearInterval(interval)
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    // Toggle FAQ
    const toggleFaq = (index: number) => {
        const faqItems = document.querySelectorAll(".faq-item")
        faqItems[index].classList.toggle("active")
    }

    // Dữ liệu cho phần sứ mệnh
    const missionData = [
        {
            id: 0,
            icon: <FaRocket />,
            title: "Kết nối",
            shortDesc: "Kết nối tình nguyện viên với các tổ chức",
            description:
                "Chúng tôi kết nối những người có mong muốn giúp đỡ cộng đồng với các tổ chức và sự kiện thiện nguyện phù hợp. Thông qua nền tảng của chúng tôi, tình nguyện viên có thể dễ dàng tìm kiếm và tham gia các hoạt động phù hợp với sở thích, kỹ năng và thời gian của họ.",
            image: "/assets/img/blog/blog-3.jpg",
            color: "#4154f1",
        },
        {
            id: 1,
            icon: <FaUsers />,
            title: "Xây dựng cộng đồng",
            shortDesc: "Tạo nên cộng đồng tình nguyện vững mạnh",
            description:
                "Chúng tôi xây dựng một cộng đồng những người có cùng tâm huyết, cùng nhau tạo nên những thay đổi tích cực. VolunHub không chỉ là nơi kết nối mà còn là không gian để chia sẻ, học hỏi và phát triển cùng nhau, tạo nên một mạng lưới hỗ trợ bền vững.",
            image: "/assets/img/blog/blog-2.jpg",
            color: "#ff6b6b",
        },
        {
            id: 2,
            icon: <FaHeart />,
            title: "Lan tỏa yêu thương",
            shortDesc: "Mỗi hành động nhỏ tạo nên sự khác biệt lớn",
            description:
                "Chúng tôi tin rằng mỗi hành động nhỏ đều có thể tạo nên sự khác biệt lớn, và cùng nhau chúng ta có thể lan tỏa yêu thương đến mọi nơi. Thông qua các hoạt động tình nguyện, chúng tôi không chỉ giúp đỡ những người cần mà còn truyền cảm hứng cho nhiều người khác cùng tham gia.",
            image: "/assets/img/blog/blog-4.jpg",
            color: "#20c997",
        },
    ]

    return (
        <div className="about-page space-theme">
            {/* Canvas cho nền ngôi sao */}
            <canvas ref={starsCanvasRef} className="stars-canvas"></canvas>

            {/* Các hành tinh trang trí */}
            <div
                className="planet planet-1"
                style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)` }}
            ></div>
            <div
                className="planet planet-2"
                style={{ transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * -30}px)` }}
            ></div>
            <div
                className="planet planet-3"
                style={{ transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)` }}
            ></div>

            {/* Phi thuyền bay lơ lửng */}
            <div className="spaceship">
                <FaSpaceShuttle />
            </div>

            {/* Hero Section */}
            <div className="hero-section space-hero" ref={headerRef}>
                <div className="space-container">
                    <h1 className="hero-title">Về VolunHub</h1>
                    <p className="hero-subtitle">Kết nối cộng đồng, lan tỏa yêu thương</p>
                    <div className="hero-decoration">
                        <div className="orbit orbit-1"></div>
                        <div className="orbit orbit-2"></div>
                        <div className="orbit orbit-3"></div>
                    </div>
                </div>
            </div>

            {/* Mission Section - Thiết kế không gian */}
            <section className="mission-section space-section" ref={missionRef}>
                <div className="container">
                    <div className="mission-intro">
                        <h2 className="section-title">Sứ mệnh của chúng tôi</h2>
                        <p className="mission-subtitle">
                            VolunHub ra đời với sứ mệnh kết nối những trái tim nhiệt huyết, xây dựng cộng đồng tình nguyện vững mạnh
                            và lan tỏa những giá trị tích cực đến toàn xã hội.
                        </p>
                    </div>

                    <div className="mission-cards">
                        {missionData.map((mission, index) => (
                            <div
                                key={mission.id}
                                className={`mission-card space-card ${activeMission === index ? "active" : ""}`}
                                onClick={() => setActiveMission(index)}
                                style={{ "--mission-color": mission.color } as React.CSSProperties}
                            >
                                <div className="mission-card-icon">{mission.icon}</div>
                                <h3>{mission.title}</h3>
                                <p>{mission.shortDesc}</p>
                                <div className="mission-card-indicator"></div>
                            </div>
                        ))}
                    </div>

                    <div className="mission-detail space-detail">
                        <div className="mission-detail-content">
                            <h3 style={{ color: missionData[activeMission].color }}>{missionData[activeMission].title}</h3>
                            <p>{missionData[activeMission].description}</p>
                            <Link to="/events" className="btn-mission">
                                Khám phá ngay
                            </Link>
                        </div>
                        <div className="mission-detail-image">
                            <img
                                src={missionData[activeMission].image || "/placeholder.svg"}
                                alt={missionData[activeMission].title}
                            />
                            <div className="image-decoration" style={{ background: missionData[activeMission].color }}></div>
                        </div>
                    </div>

                    <div className="mission-stats">
                        <div className="mission-stat-item space-stat">
                            <div className="mission-stat-number">5,000+</div>
                            <div className="mission-stat-label">Tình nguyện viên</div>
                        </div>
                        <div className="mission-stat-item space-stat">
                            <div className="mission-stat-number">350+</div>
                            <div className="mission-stat-label">Sự kiện đã tổ chức</div>
                        </div>
                        <div className="mission-stat-item space-stat">
                            <div className="mission-stat-number">120+</div>
                            <div className="mission-stat-label">Tổ chức đối tác</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section space-section" ref={valuesRef}>
                <div className="container">
                    <h2 className="section-title">Giá trị cốt lõi</h2>
                    <div className="values-grid">
                        <div className="value-card space-card">
                            <div className="value-icon">
                                <FaSatellite />
                            </div>
                            <h3>Tính minh bạch</h3>
                            <p>Chúng tôi cam kết minh bạch trong mọi hoạt động, từ quản lý sự kiện đến thông tin người dùng.</p>
                        </div>
                        <div className="value-card space-card">
                            <div className="value-icon">
                                <FaUsers />
                            </div>
                            <h3>Tính cộng đồng</h3>
                            <p>
                                Chúng tôi tin vào sức mạnh của cộng đồng và khả năng tạo ra tác động tích cực khi chúng ta đoàn kết.
                            </p>
                        </div>
                        <div className="value-card space-card">
                            <div className="value-icon">
                                <FaGlobeAsia />
                            </div>
                            <h3>Tính bền vững</h3>
                            <p>
                                Chúng tôi hướng đến các giải pháp bền vững, tạo ra tác động lâu dài thay vì chỉ giải quyết vấn đề tạm
                                thời.
                            </p>
                        </div>
                        <div className="value-card space-card">
                            <div className="value-icon">
                                <FaRocket />
                            </div>
                            <h3>Tính đổi mới</h3>
                            <p>Chúng tôi luôn tìm kiếm những cách tiếp cận mới để giải quyết các thách thức xã hội.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section space-section" ref={statsRef}>
                <div className="container">
                    <h2 className="section-title">Thành tựu của chúng tôi</h2>
                    <div className="stats-container">
                        <div className="stat-item space-stat">
                            <div className="stat-number" data-count="5000">
                                5,000+
                            </div>
                            <div className="stat-label">Tình nguyện viên</div>
                        </div>
                        <div className="stat-item space-stat">
                            <div className="stat-number" data-count="350">
                                350+
                            </div>
                            <div className="stat-label">Sự kiện đã tổ chức</div>
                        </div>
                        <div className="stat-item space-stat">
                            <div className="stat-number" data-count="120">
                                120+
                            </div>
                            <div className="stat-label">Tổ chức đối tác</div>
                        </div>
                        <div className="stat-item space-stat">
                            <div className="stat-number" data-count="50">
                                50+
                            </div>
                            <div className="stat-label">Tỉnh thành phủ sóng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="history-section space-section" ref={historyRef}>
                <div className="container">
                    <h2 className="section-title">Lịch sử phát triển</h2>
                    <div className="timeline space-timeline">
                        <div className="history-item">
                            <div className="history-date">2018</div>
                            <div className="history-content space-card">
                                <h3>Khởi đầu</h3>
                                <p>VolunHub được thành lập với mục tiêu kết nối tình nguyện viên với các tổ chức phi lợi nhuận.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2019</div>
                            <div className="history-content space-card">
                                <h3>Mở rộng</h3>
                                <p>Mở rộng hoạt động đến 10 tỉnh thành và kết nối với hơn 50 tổ chức đối tác.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2020</div>
                            <div className="history-content space-card">
                                <h3>Đối mặt thách thức</h3>
                                <p>Chuyển đổi sang mô hình hoạt động trực tuyến trong bối cảnh đại dịch COVID-19.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2021</div>
                            <div className="history-content space-card">
                                <h3>Phát triển nền tảng</h3>
                                <p>Ra mắt nền tảng kỹ thuật số mới với nhiều tính năng hiện đại và trải nghiệm người dùng tốt hơn.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2022</div>
                            <div className="history-content space-card">
                                <h3>Đạt mốc 1000 sự kiện</h3>
                                <p>Tổ chức thành công hơn 1000 sự kiện thiện nguyện trên toàn quốc.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2023</div>
                            <div className="history-content space-card">
                                <h3>Hiện tại</h3>
                                <p>
                                    Tiếp tục mở rộng và phát triển, với mục tiêu trở thành nền tảng kết nối tình nguyện viên lớn nhất Việt
                                    Nam.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section space-section" ref={teamRef}>
                <div className="container">
                    <h2 className="section-title">Đội ngũ của chúng tôi</h2>
                    <div className="team-grid">
                        <div className="team-member space-card">
                            <div className="member-image">
                                <img src="/assets/img/team/team-1.jpg" alt="Hồ Ngọc Viên" />
                                <div className="member-social">
                                    <a href="#" className="facebook" aria-label="Facebook">
                                        <FaFacebookF />
                                    </a>
                                    <a href="#" className="twitter" aria-label="Github">
                                        <FaGithub />
                                    </a>
                                    <a href="#" className="instagram" aria-label="Instagram">
                                        <FaInstagram />   
                                    </a>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Hồ Ngọc Viên</h3>
                                <p>Nhà sáng lập & CEO</p>
                            </div>
                        </div>
                        <div className="team-member space-card">
                            <div className="member-image">
                                <img src="/assets/img/team/team-4.jpg" alt="Trần Đặng Nhật Tân" />
                                <div className="member-social">
                                    <a href="#" className="facebook" aria-label="Facebook">
                                        <FaFacebookF />
                                    </a>
                                    <a href="#" className="twitter" aria-label="Github">
                                        <FaGithub />
                                    </a>
                                    <a href="#" className="instagram" aria-label="Instagram">
                                        <FaInstagram />   
                                    </a>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Trần Đặng Nhật Tân</h3>
                                <p>Giám đốc Điều hành</p>
                            </div>
                        </div>
                        <div className="team-member space-card">
                            <div className="member-image">
                                <img src="/assets/img/team/team-3.jpg" alt="Hoàng Mạnh Duy" />
                                <div className="member-social">
                                    <a href="#" className="facebook" aria-label="Facebook">
                                        <FaFacebookF />
                                    </a>
                                    <a href="#" className="twitter" aria-label="Github">
                                        <FaGithub />
                                    </a>
                                    <a href="#" className="instagram" aria-label="Instagram">
                                        <FaInstagram />   
                                    </a>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Hoàng Mạnh Duy</h3>
                                <p>Giám đốc Công nghệ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="partners-section space-section" ref={partnersRef}>
                <div className="container">
                    <h2 className="section-title">Đối tác của chúng tôi</h2>
                    <div className="partners-grid">
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-1.png" alt="Đối tác 1" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-2.png" alt="Đối tác 2" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-3.png" alt="Đối tác 3" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-4.png" alt="Đối tác 4" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-5.png" alt="Đối tác 5" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-6.png" alt="Đối tác 6" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section space-section" ref={testimonialsRef}>
                <div className="container">
                    <h2 className="section-title">Người dùng nói gì về chúng tôi</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card space-card">
                            <div className="testimonial-content">
                                <p>
                                    "VolunHub đã giúp tôi tìm được những sự kiện thiện nguyện phù hợp với sở thích và thời gian của mình.
                                    Tôi đã tham gia nhiều hoạt động ý nghĩa và kết nối với những người tuyệt vời."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/assets/img/testimonials/testimonials-1.jpg" alt="Nguyễn Văn X" />
                                <div className="author-info">
                                    <h4>Sơn Tùng MPT</h4>
                                    <p>Tình nguyện viên</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card space-card">
                            <div className="testimonial-content">
                                <p>
                                    "Là một tổ chức phi lợi nhuận, chúng tôi đã tìm thấy rất nhiều tình nguyện viên tài năng và nhiệt
                                    huyết thông qua VolunHub. Nền tảng này thực sự đã giúp chúng tôi mở rộng tầm ảnh hưởng."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/assets/img/testimonials/testimonials-2.jpg" alt="Trần Thị Y" />
                                <div className="author-info">
                                    <h4>Vũ Đinh Trọng Thắng</h4>
                                    <p>Quản lý tổ chức phi lợi nhuận</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card space-card">
                            <div className="testimonial-content">
                                <p>
                                    "VolunHub không chỉ là một nền tảng kết nối, mà còn là một cộng đồng. Tôi đã học hỏi được rất nhiều từ
                                    những người cùng chí hướng và cảm thấy cuộc sống của mình ý nghĩa hơn."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="/assets/img/testimonials/testimonials-3.jpg" alt="Lê Văn Z" />
                                <div className="author-info">
                                    <h4>Tùng Dương</h4>
                                    <p>Tình nguyện viên thường xuyên</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section space-section" ref={faqRef}>
                <div className="container">
                    <h2 className="section-title">Câu hỏi thường gặp</h2>
                    <div className="faq-container">
                        <div className="faq-item space-card" onClick={() => toggleFaq(0)}>
                            <div className="faq-question">
                                <FaQuestionCircle className="faq-icon" />
                                <h3>Làm thế nào để tôi có thể tham gia một sự kiện?</h3>
                                <span className="faq-toggle">+</span>
                            </div>
                            <div className="faq-answer">
                                <p>
                                    Để tham gia một sự kiện, bạn cần đăng ký tài khoản trên VolunHub, sau đó tìm kiếm sự kiện phù hợp và
                                    nhấn nút "Tham gia". Bạn sẽ nhận được thông tin chi tiết về sự kiện qua email hoặc thông báo trên nền
                                    tảng.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item space-card" onClick={() => toggleFaq(1)}>
                            <div className="faq-question">
                                <FaQuestionCircle className="faq-icon" />
                                <h3>Làm thế nào để tôi có thể tạo một sự kiện?</h3>
                                <span className="faq-toggle">+</span>
                            </div>
                            <div className="faq-answer">
                                <p>
                                    Để tạo một sự kiện, bạn cần đăng nhập vào tài khoản của mình, nhấn vào nút "Tạo sự kiện" trên trang
                                    chủ, và điền đầy đủ thông tin về sự kiện của bạn. Sau khi gửi, sự kiện của bạn sẽ được xem xét và phê
                                    duyệt trong vòng 24 giờ.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item space-card" onClick={() => toggleFaq(2)}>
                            <div className="faq-question">
                                <FaQuestionCircle className="faq-icon" />
                                <h3>VolunHub có tính phí không?</h3>
                                <span className="faq-toggle">+</span>
                            </div>
                            <div className="faq-answer">
                                <p>
                                    Không, VolunHub hoàn toàn miễn phí cho cả tình nguyện viên và tổ chức phi lợi nhuận. Chúng tôi tin
                                    rằng việc kết nối những người muốn giúp đỡ với những người cần giúp đỡ không nên bị cản trở bởi rào
                                    cản tài chính.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item space-card" onClick={() => toggleFaq(3)}>
                            <div className="faq-question">
                                <FaQuestionCircle className="faq-icon" />
                                <h3>Làm thế nào để tôi có thể liên hệ với VolunHub?</h3>
                                <span className="faq-toggle">+</span>
                            </div>
                            <div className="faq-answer">
                                <p>
                                    Bạn có thể liên hệ với chúng tôi qua email support@volunhub.com, số điện thoại 1900-1234, hoặc thông
                                    qua mẫu liên hệ trên trang web của chúng tôi. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                                </p>
                            </div>
                        </div>
                        <div className="faq-item space-card" onClick={() => toggleFaq(4)}>
                            <div className="faq-question">
                                <FaQuestionCircle className="faq-icon" />
                                <h3>Tôi có thể hủy đăng ký tham gia sự kiện không?</h3>
                                <span className="faq-toggle">+</span>
                            </div>
                            <div className="faq-answer">
                                <p>
                                    Có, bạn có thể hủy đăng ký tham gia sự kiện bất cứ lúc nào trước khi sự kiện diễn ra. Tuy nhiên, chúng
                                    tôi khuyến khích bạn hủy càng sớm càng tốt để tổ chức có thể tìm người thay thế.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section space-section" ref={contactRef}>
                <div className="container">
                    <h2 className="section-title">Liên hệ với chúng tôi</h2>
                    <div className="contact-container">
                        <div className="contact-info">
                            <div className="contact-item space-card">
                                <div className="contact-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3>Địa chỉ</h3>
                                    <p>70 đường Trần Đại Nghĩa, TP Đà Nẵng</p>
                                </div>
                            </div>
                            <div className="contact-item space-card">
                                <div className="contact-icon">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3>Email</h3>
                                    <p>contact@volunhub.vku.com</p>
                                </div>
                            </div>
                            <div className="contact-item space-card">
                                <div className="contact-icon">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h3>Điện thoại</h3>
                                    <p>+84 905 100 200</p>
                                </div>
                            </div>
                            <div className="contact-map space-card">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4464.919404923983!2d108.24671907575544!3d15.98040228468632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314210856356bc53%3A0x7ec1e1b80754f803!2zOTQgTmd1eeG7hW4gVGjhu6ljIFThu7EsIEhvw6AgSOG6o2ksIE5nxakgSMOgbmggU8ahbiwgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1747111710792!5m2!1svi!2s"
                                    width="100%"
                                    height="300"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Maps"
                                ></iframe>
                            </div>
                        </div>
                        <div className="contact-form space-card">
                            <form>
                                <div className="form-group">
                                    <input type="text" placeholder="Họ và tên" required />
                                </div>
                                <div className="form-group">
                                    <input type="email" placeholder="Email" required />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="Tiêu đề" required />
                                </div>
                                <div className="form-group">
                                    <textarea placeholder="Nội dung" rows={5} required></textarea>
                                </div>
                                <button type="submit" className="btn-submit no-border home-button">
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section space-cta" ref={ctaRef}>
                <div className="space-container">
                    <h2>Sẵn sàng tham gia cùng chúng tôi?</h2>
                    <p>Hãy trở thành một phần của cộng đồng VolunHub và cùng nhau tạo nên những thay đổi tích cực.</p>
                    <div className="cta-buttons">
                        <Link to="/auth" className="btn btn-primary no-border ">
                            Đăng ký ngay
                        </Link>
                        <Link to="/" className="btn btn-secondary no-border home-button">
                            Khám phá sự kiện
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer space-footer" ref={footerRef}>
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-column">
                            <div className="footer-logo">
                                <h3>VolunHub</h3>
                            </div>
                            <p className="footer-description">
                                Nền tảng kết nối tình nguyện viên với các tổ chức phi lợi nhuận, tạo nên những tác động tích cực đến
                                cộng đồng.
                            </p>
                            <div className="footer-social">
                                <a href="#" className="social-icon">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                        <div className="footer-column">
                            <h4 className="footer-title">Liên kết nhanh</h4>
                            <ul className="footer-links">
                                <li>
                                    <Link to="/">Trang chủ</Link>
                                </li>
                                <li>
                                    <Link to="/about">Về chúng tôi</Link>
                                </li>
                                <li>
                                    <Link to="/events">Sự kiện</Link>
                                </li>
                                <li>
                                    <Link to="/blog">Blog</Link>
                                </li>
                                <li>
                                    <Link to="/contact">Liên hệ</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4 className="footer-title">Dịch vụ</h4>
                            <ul className="footer-links">
                                <li>
                                    <Link to="/volunteer">Tình nguyện viên</Link>
                                </li>
                                <li>
                                    <Link to="/organizations">Tổ chức</Link>
                                </li>
                                <li>
                                    <Link to="/events/create">Tạo sự kiện</Link>
                                </li>
                                <li>
                                    <Link to="/donate">Quyên góp</Link>
                                </li>
                                <li>
                                    <Link to="/support">Hỗ trợ</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4 className="footer-title">Liên hệ</h4>
                            <ul className="footer-contact">
                                <li>
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>70 đường Trần Đại Nghĩa, TP Đà Nẵng</span>
                                </li>
                                <li>
                                    <i className="fas fa-phone"></i>
                                    <span>+84 905 100 200</span>
                                </li>
                                <li>
                                    <i className="fas fa-envelope"></i>
                                    <span>contact@volunhub.vku.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} VolunHub. Tất cả các quyền được bảo lưu.</p>
                        <div className="footer-bottom-links">
                            <Link to="/terms">Điều khoản sử dụng</Link>
                            <Link to="/privacy">Chính sách bảo mật</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AboutPage
