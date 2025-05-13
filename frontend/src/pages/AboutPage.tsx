"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Link } from "react-router-dom"
import { FaHandsHelping, FaUsers, FaHeart, FaQuestionCircle, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import "./AboutPage.css"

// Đăng ký plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const AboutPage = () => {
    const headerRef = useRef(null)
    const missionRef = useRef(null)
    const valuesRef = useRef(null)
    const statsRef = useRef(null)
    const historyRef = useRef(null)
    const teamRef = useRef(null)
    const partnersRef = useRef(null)
    const testimonialsRef = useRef(null)
    const faqRef = useRef(null)
    const contactRef = useRef(null)
    const ctaRef = useRef(null)
    const footerRef = useRef(null)

    // State để theo dõi mission card đang được active
    const [activeMission, setActiveMission] = useState(0)

    useEffect(() => {
        // Animation cho header
        gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
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
            { opacity: 0, scale: 0.8 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
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
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
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
        }
    }, [])

    // Toggle FAQ
    const toggleFaq = (index) => {
        const faqItems = document.querySelectorAll(".faq-item")
        faqItems[index].classList.toggle("active")
    }

    // Dữ liệu cho phần sứ mệnh
    const missionData = [
        {
            id: 0,
            icon: <FaHandsHelping />,
            title: "Kết nối",
            shortDesc: "Kết nối tình nguyện viên với các tổ chức",
            description:
                "Chúng tôi kết nối những người có mong muốn giúp đỡ cộng đồng với các tổ chức và sự kiện thiện nguyện phù hợp. Thông qua nền tảng của chúng tôi, tình nguyện viên có thể dễ dàng tìm kiếm và tham gia các hoạt động phù hợp với sở thích, kỹ năng và thời gian của họ.",
            image: "assets/img/blog/blog-3.jpg?height=400&width=600",
            color: "#4154f1",
        },
        {
            id: 1,
            icon: <FaUsers />,
            title: "Xây dựng cộng đồng",
            shortDesc: "Tạo nên cộng đồng tình nguyện vững mạnh",
            description:
                "Chúng tôi xây dựng một cộng đồng những người có cùng tâm huyết, cùng nhau tạo nên những thay đổi tích cực. VolunHub không chỉ là nơi kết nối mà còn là không gian để chia sẻ, học hỏi và phát triển cùng nhau, tạo nên một mạng lưới hỗ trợ bền vững.",
            image: "assets/img/blog/blog-2.jpg?height=400&width=600",
            color: "#ff6b6b",
        },
        {
            id: 2,
            icon: <FaHeart />,
            title: "Lan tỏa yêu thương",
            shortDesc: "Mỗi hành động nhỏ tạo nên sự khác biệt lớn",
            description:
                "Chúng tôi tin rằng mỗi hành động nhỏ đều có thể tạo nên sự khác biệt lớn, và cùng nhau chúng ta có thể lan tỏa yêu thương đến mọi nơi. Thông qua các hoạt động tình nguyện, chúng tôi không chỉ giúp đỡ những người cần mà còn truyền cảm hứng cho nhiều người khác cùng tham gia.",
            image: "assets/img/blog/blog-4.jpg?height=400&width=600",
            color: "#20c997",
        },
    ]

    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="hero-section" ref={headerRef}>
                <div className="glass-container">
                    <h1 className="hero-title">Về VolunHub</h1>
                    <p className="hero-subtitle">Kết nối cộng đồng, lan tỏa yêu thương</p>
                    <div className="hero-decoration">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                    </div>
                </div>
            </div>

            {/* Mission Section - Thiết kế mới */}
            <section className="mission-section" ref={missionRef}>
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
                                className={`mission-card ${activeMission === index ? "active" : ""}`}
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

                    <div className="mission-detail">
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
                        <div className="mission-stat-item">
                            <div className="mission-stat-number">5,000+</div>
                            <div className="mission-stat-label">Tình nguyện viên</div>
                        </div>
                        <div className="mission-stat-item">
                            <div className="mission-stat-number">350+</div>
                            <div className="mission-stat-label">Sự kiện đã tổ chức</div>
                        </div>
                        <div className="mission-stat-item">
                            <div className="mission-stat-number">120+</div>
                            <div className="mission-stat-label">Tổ chức đối tác</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section" ref={valuesRef}>
                <div className="container">
                    <h2 className="section-title">Giá trị cốt lõi</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Tính minh bạch</h3>
                            <p>Chúng tôi cam kết minh bạch trong mọi hoạt động, từ quản lý sự kiện đến thông tin người dùng.</p>
                        </div>
                        <div className="value-card">
                            <h3>Tính cộng đồng</h3>
                            <p>
                                Chúng tôi tin vào sức mạnh của cộng đồng và khả năng tạo ra tác động tích cực khi chúng ta đoàn kết.
                            </p>
                        </div>
                        <div className="value-card">
                            <h3>Tính bền vững</h3>
                            <p>
                                Chúng tôi hướng đến các giải pháp bền vững, tạo ra tác động lâu dài thay vì chỉ giải quyết vấn đề tạm
                                thời.
                            </p>
                        </div>
                        <div className="value-card">
                            <h3>Tính đổi mới</h3>
                            <p>Chúng tôi luôn tìm kiếm những cách tiếp cận mới để giải quyết các thách thức xã hội.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" ref={statsRef}>
                <div className="container">
                    <h2 className="section-title">Thành tựu của chúng tôi</h2>
                    <div className="stats-container">
                        <div className="stat-item">
                            <div className="stat-number" data-count="5000">
                                5,000+
                            </div>
                            <div className="stat-label">Tình nguyện viên</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number" data-count="350">
                                350+
                            </div>
                            <div className="stat-label">Sự kiện đã tổ chức</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number" data-count="120">
                                120+
                            </div>
                            <div className="stat-label">Tổ chức đối tác</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number" data-count="50">
                                50+
                            </div>
                            <div className="stat-label">Tỉnh thành phủ sóng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History Section */}
            <section className="history-section" ref={historyRef}>
                <div className="container">
                    <h2 className="section-title">Lịch sử phát triển</h2>
                    <div className="timeline">
                        <div className="history-item">
                            <div className="history-date">2018</div>
                            <div className="history-content">
                                <h3>Khởi đầu</h3>
                                <p>VolunHub được thành lập với mục tiêu kết nối tình nguyện viên với các tổ chức phi lợi nhuận.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2019</div>
                            <div className="history-content">
                                <h3>Mở rộng</h3>
                                <p>Mở rộng hoạt động đến 10 tỉnh thành và kết nối với hơn 50 tổ chức đối tác.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2020</div>
                            <div className="history-content">
                                <h3>Đối mặt thách thức</h3>
                                <p>Chuyển đổi sang mô hình hoạt động trực tuyến trong bối cảnh đại dịch COVID-19.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2021</div>
                            <div className="history-content">
                                <h3>Phát triển nền tảng</h3>
                                <p>Ra mắt nền tảng kỹ thuật số mới với nhiều tính năng hiện đại và trải nghiệm người dùng tốt hơn.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2022</div>
                            <div className="history-content">
                                <h3>Đạt mốc 1000 sự kiện</h3>
                                <p>Tổ chức thành công hơn 1000 sự kiện thiện nguyện trên toàn quốc.</p>
                            </div>
                        </div>
                        <div className="history-item">
                            <div className="history-date">2023</div>
                            <div className="history-content">
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
            <section className="team-section" ref={teamRef}>
                <div className="container">
                    <h2 className="section-title">Đội ngũ của chúng tôi</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-image">
                                <img src="/assets/img/team/team-1.jpg?height=300&width=300" alt="Nguyễn Văn A" />
                                <div className="member-social">
                                    <a href="#">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Hồ Ngọc Viên</h3>
                                <p>Nhà sáng lập & CEO</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="/assets/img/team/team-4.jpg?height=300&width=300" alt="Trần Thị B" />
                                <div className="member-social">
                                    <a href="#">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Trần Thị B</h3>
                                <p>Giám đốc Điều hành</p>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="/assets/img/team/team-3.jpg?height=300&width=300" alt="Lê Văn C" />
                                <div className="member-social">
                                    <a href="#">
                                        <i className="fab fa-facebook"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-twitter"></i>
                                    </a>
                                    <a href="#">
                                        <i className="fab fa-linkedin"></i>
                                    </a>
                                </div>
                            </div>
                            <div className="member-info">
                                <h3>Lê Văn C</h3>
                                <p>Giám đốc Công nghệ</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="partners-section" ref={partnersRef}>
                <div className="container">
                    <h2 className="section-title">Đối tác của chúng tôi</h2>
                    <div className="partners-grid">
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-1.png?height=150&width=150" alt="Đối tác 1" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-2.png?height=150&width=150" alt="Đối tác 2" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-3.png" alt="Đối tác 3" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-4.png?height=150&width=150" alt="Đối tác 4" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-5.png?height=150&width=150" alt="Đối tác 5" />
                        </div>
                        <div className="partner-logo">
                            <img src="/assets/img/clients/client-6.png?height=150&width=150" alt="Đối tác 6" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section" ref={testimonialsRef}>
                <div className="container">
                    <h2 className="section-title">Người dùng nói gì về chúng tôi</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>
                                    "VolunHub đã giúp tôi tìm được những sự kiện thiện nguyện phù hợp với sở thích và thời gian của mình.
                                    Tôi đã tham gia nhiều hoạt động ý nghĩa và kết nối với những người tuyệt vời."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="assets\img\testimonials\testimonials-1.jpg?height=80&width=80" alt="Nguyễn Văn X" />
                                <div className="author-info">
                                    <h4>Sơn Tùng MPT</h4>
                                    <p>Tình nguyện viên</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>
                                    "Là một tổ chức phi lợi nhuận, chúng tôi đã tìm thấy rất nhiều tình nguyện viên tài năng và nhiệt
                                    huyết thông qua VolunHub. Nền tảng này thực sự đã giúp chúng tôi mở rộng tầm ảnh hưởng."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="assets\img\testimonials\testimonials-2.jpg?height=80&width=80" alt="Trần Thị Y" />
                                <div className="author-info">
                                    <h4>Vũ Đinh Trọng Thắng</h4>
                                    <p>Quản lý tổ chức phi lợi nhuận</p>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>
                                    "VolunHub không chỉ là một nền tảng kết nối, mà còn là một cộng đồng. Tôi đã học hỏi được rất nhiều từ
                                    những người cùng chí hướng và cảm thấy cuộc sống của mình ý nghĩa hơn."
                                </p>
                            </div>
                            <div className="testimonial-author">
                                <img src="assets\img\testimonials\testimonials-3.jpg?height=80&width=80" alt="Lê Văn Z" />
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
            <section className="faq-section" ref={faqRef}>
                <div className="container">
                    <h2 className="section-title">Câu hỏi thường gặp</h2>
                    <div className="faq-container">
                        <div className="faq-item" onClick={() => toggleFaq(0)}>
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
                        <div className="faq-item" onClick={() => toggleFaq(1)}>
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
                        <div className="faq-item" onClick={() => toggleFaq(2)}>
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
                        <div className="faq-item" onClick={() => toggleFaq(3)}>
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
                        <div className="faq-item" onClick={() => toggleFaq(4)}>
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
            <section className="contact-section" ref={contactRef}>
                <div className="container">
                    <h2 className="section-title">Liên hệ với chúng tôi</h2>
                    <div className="contact-container">
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <h3>Địa chỉ</h3>
                                    <p>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaEnvelope />
                                </div>
                                <div>
                                    <h3>Email</h3>
                                    <p>info@volunhub.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">
                                    <FaPhone />
                                </div>
                                <div>
                                    <h3>Điện thoại</h3>
                                    <p>+84 123 456 789</p>
                                </div>
                            </div>
                            <div className="contact-map">
                                {/* <iframe
                                    src="https://www.google.com/maps/place/94+Nguy%E1%BB%85n+Th%E1%BB%A9c+T%E1%BB%B1,+Ho%C3%A0+H%E1%BA%A3i,+Ng%C5%A9+H%C3%A0nh+S%C6%A1n,+%C4%90%C3%A0+N%E1%BA%B5ng+550000,+Vi%E1%BB%87t+Nam/@15.9804023,108.2467191,1025m/data=!3m2!1e3!4b1!4m6!3m5!1s0x314210856356bc53:0x7ec1e1b80754f803!8m2!3d15.9804023!4d108.249294!16s%2Fg%2F11fw9_pgkb?authuser=0&entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe> */}
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4464.919404923983!2d108.24671907575544!3d15.98040228468632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314210856356bc53%3A0x7ec1e1b80754f803!2zOTQgTmd1eeG7hW4gVGjhu6ljIFThu7EsIEhvw6AgSOG6o2ksIE5nxakgSMOgbmggU8ahbiwgxJDDoCBO4bq1bmcgNTUwMDAwLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1747111710792!5m2!1svi!2s"
                                    width="100%" height="300"
                                    allowfullscreen="" loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade"
                                    title="Google Maps"
                                    >


                                </iframe>
                            </div>
                        </div>
                        <div className="contact-form">
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
                                    <textarea placeholder="Nội dung" rows="5" required></textarea>
                                </div>
                                <button type="submit" className="btn-submit">
                                    Gửi tin nhắn
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" ref={ctaRef}>
                <div className="glass-container">
                    <h2>Sẵn sàng tham gia cùng chúng tôi?</h2>
                    <p>Hãy trở thành một phần của cộng đồng VolunHub và cùng nhau tạo nên những thay đổi tích cực.</p>
                    <div className="cta-buttons">
                        <Link to="/auth" className="btn btn-primary">
                            Đăng ký ngay
                        </Link>
                        <Link to="/" className="btn btn-secondary">
                            Khám phá sự kiện
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" ref={footerRef}>
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
                                    <span>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</span>
                                </li>
                                <li>
                                    <i className="fas fa-phone"></i>
                                    <span>+84 123 456 789</span>
                                </li>
                                <li>
                                    <i className="fas fa-envelope"></i>
                                    <span>info@volunhub.com</span>
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
