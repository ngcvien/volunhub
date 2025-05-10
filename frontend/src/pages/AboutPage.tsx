// frontend/src/pages/AboutPage.tsx
import React, { useRef, useLayoutEffect, useEffect } from 'react'; // Import hook
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import styles from './AboutPage.module.css';
import { gsap } from 'gsap';
import AOS from 'aos';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import 'aos/dist/aos.css';
import 'react-bootstrap-icons';
import './AboutPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';




const AboutPage = () => {
    // Refs cho animation
    const pageRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    // useLayoutEffect(() => {
    //     const ctx = gsap.context(() => {
    //         // Timeline cho animation mượt hơn
    //         const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    //         tl.from(titleRef.current, { opacity: 0, y: 50, duration: 0.8, delay: 0.2 })
    //             // Animate các section lần lượt xuất hiện
    //             .from(`.${styles.section}`, { opacity: 0, y: 50, duration: 0.8, stagger: 0.3 }, "-=0.5") // Dùng class selector và stagger
    //             // Animate các đoạn text bên trong section
    //             .from(`.${styles.sectionContent} p`, { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, "-=0.6")
    //             // Animate nút CTA
    //             .from(`.${styles.ctaButton}`, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");

    //     }, pageRef); // Scope animation vào pageRef để cleanup

    //     return () => ctx.revert(); // Cleanup function khi component unmount
    // }, []);

    useEffect(() => {
        // Khởi tạo AOS
        AOS.init({ duration: 800, once: true });

        // Khởi tạo Swiper (nếu dùng)
        const swiper = new Swiper('.init-swiper', {
            loop: true,
            speed: 700,
            autoplay: { delay: 3000 },
            slidesPerView: 'auto',
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            },
            breakpoints: {
                320: { slidesPerView: 2, spaceBetween: 40 },
                480: { slidesPerView: 3, spaceBetween: 60 },
                640: { slidesPerView: 4, spaceBetween: 80 },
                992: { slidesPerView: 6, spaceBetween: 120 }
            }
        });

        // Cleanup nếu cần
        return () => {
            swiper.destroy?.();
        };
    }, []);



    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/assets/vendor/glightbox/js/glightbox.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            // @ts-ignore
            if (window.GLightbox) {
                // @ts-ignore
                window.GLightbox({ selector: '.glightbox' });
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (window.PureCounter) {
            // @ts-ignore
            new window.PureCounter();
        }
    }, []);

    //function to handle scroll to top
    

    return (
        <>
            <>
                <meta charSet="utf-8" />
                <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                <title>VolunHub</title>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                {/* Favicons */}
                {/* <link href="assets/img/favicon.png" rel="icon" /> */}
                <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon" />
                {/* Fonts */}
                <link href="https://fonts.googleapis.com" rel="preconnect" />
                <link href="https://fonts.gstatic.com" rel="preconnect" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                    rel="stylesheet"
                />
                <link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
                <link
                    href="assets/vendor/bootstrap-icons/bootstrap-icons.css"
                    rel="stylesheet"
                />
                <link href="assets/vendor/aos/aos.css" rel="stylesheet" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css"
                />
                <link href="assets/vendor/glightbox/css/glightbox.min.css" rel="stylesheet" />
                <link href="assets/vendor/swiper/swiper-bundle.min.css" rel="stylesheet" />
                <link href="assets/css/main.css" rel="stylesheet" />
                <header id="header" className="header d-flex align-items-center fixed-top">
                    <div className="container-fluid container-xl position-relative d-flex align-items-center">
                        <a href="index.html" className="logo d-flex align-items-center me-auto">
                            <img src="assets/img/logo.png" alt="" />
                            <h1 className="sitename">VolunHub</h1>
                        </a>
                        <nav id="navmenu" className="navmenu">
                            <ul>
                                <li>
                                    <a href="#home" className="active">
                                        Trang chủ
                                        <br />
                                    </a>
                                </li>
                                <li>
                                    <a href="#event">Sự kiện</a>
                                </li>
                                <li>
                                    <a href="#testimonials">Cảm nhận</a>
                                </li>
                                <li>
                                    <a href="#team">Đội ngũ</a>
                                </li>
                                <li>
                                    <a href="#contact">Liên hệ</a>
                                </li>
                            </ul>
                            <i className="mobile-nav-toggle d-xl-none bi bi-list" />
                        </nav>
                        <a className="btn-getstarted flex-md-shrink-0" href="index.html#about">
                            Đăng ký
                        </a>
                    </div>
                </header>
                <main className="main">
                    {/* Hero Section */}
                    <section id="home" className="hero section">
                        <div className="container">
                            <div className="row gy-4">
                                <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
                                    <h1 data-aos="fade-up">Cùng nhau lan tỏa yêu thương</h1>
                                    <p data-aos="fade-up" data-aos-delay={100}>
                                        Tham gia ngay cộng đồng tình nguyện lớn nhất, kết nối với hàng
                                        nghìn người chung chí hướng!
                                    </p>
                                    <div
                                        className="d-flex flex-column flex-md-row"
                                        data-aos="fade-up"
                                        data-aos-delay={200}
                                    >
                                        <a href="#about" className="btn-get-started">
                                            Bắt đầu ngay <i className="bi bi-arrow-right" />
                                        </a>
                                        <a
                                            href="https://www.youtube.com/watch?v=7YZCUpnaTfg"
                                            className="glightbox btn-watch-video d-flex align-items-center justify-content-center ms-0 ms-md-4 mt-4 mt-md-0"
                                        >
                                            <i className="bi bi-play-circle" />
                                            <span>Xem Video</span>
                                        </a>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-6 order-1 order-lg-2 hero-img"
                                    data-aos="zoom-out"
                                >
                                    <img
                                        src="https://img.vietcetera.com/wp-content/uploads/2019/09/BVMT-Featured-Image.jpg"
                                        className="img-fluid animated"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /Hero Section */}
                    {/* About Section */}
                    <section id="about" className="about section">
                        <div className="container" data-aos="fade-up">
                            <div className="row gx-0">
                                <div
                                    className="col-lg-6 d-flex flex-column justify-content-center"
                                    data-aos="fade-up"
                                    data-aos-delay={200}
                                >
                                    <div className="content">
                                        <h3>Who We Are</h3>
                                        <h2>
                                            Nền tảng kết nối hàng nghìn tình nguyện viên trên cả nước. Hãy
                                            cùng nhau tạo ra những giá trị tốt đẹp cho cộng đồng
                                        </h2>
                                        <p>
                                            Chúng tôi tạo ra không gian để mọi người có thể tổ chức sự kiện
                                            thiện nguyện, tham gia hoạt động ý nghĩa và lan tỏa yêu thương
                                            đến những hoàn cảnh khó khăn.
                                        </p>
                                        <div className="text-center text-lg-start">
                                            <a
                                                href="#"
                                                className="btn-read-more d-inline-flex align-items-center justify-content-center align-self-center"
                                            >
                                                <span>Đăng ký ngay</span>
                                                <i className="bi bi-arrow-right" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-6 d-flex align-items-center"
                                    data-aos="zoom-out"
                                    data-aos-delay={200}
                                >
                                    <img src="assets/img/about.jpg" className="img-fluid" alt="" />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /About Section */}
                    {/* Values Section */}
                    <section id="values" className="values section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Giá trị</h2>
                            <p>
                                GIÁ TRỊ CỐT LÕI CỦA CHÚNG TÔI
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div className="row gy-4">
                                <div className="col-lg-4" data-aos="fade-up" data-aos-delay={100}>
                                    <div className="card">
                                        <img src="assets/img/values-1.png" className="img-fluid" alt="" />
                                        <h3>Tinh thần sẻ chia</h3>
                                        <p>
                                            Chúng tôi tin rằng mỗi hành động nhỏ đều có thể tạo nên sự khác
                                            biệt. Khi bạn giúp đỡ người khác, bạn cũng đang làm cho thế giới
                                            tốt đẹp hơn.
                                        </p>
                                    </div>
                                </div>
                                {/* End Card Item */}
                                <div className="col-lg-4" data-aos="fade-up" data-aos-delay={200}>
                                    <div className="card">
                                        <img src="assets/img/values-2.jpg" className="img-fluid" alt="" />
                                        <h3>Kết nối những trái tim nhân ái</h3>
                                        <p>
                                            Không chỉ là nơi để tham gia thiện nguyện, đây còn là cộng đồng
                                            nơi bạn có thể kết bạn, học hỏi và cùng nhau lan tỏa yêu thương.
                                        </p>
                                    </div>
                                </div>
                                {/* End Card Item */}
                                <div className="col-lg-4" data-aos="fade-up" data-aos-delay={300}>
                                    <div className="card">
                                        <img src="assets/img/values-3.jpg" className="img-fluid" alt="" />
                                        <h3>Công nhận và truyền cảm hứng</h3>
                                        <p>
                                            Mọi đóng góp đều đáng trân trọng. Chúng tôi có hệ thống tích
                                            điểm và vinh danh những tình nguyện viên có nhiều đóng góp nhất.
                                        </p>
                                    </div>
                                </div>
                                {/* End Card Item */}
                            </div>
                        </div>
                    </section>
                    {/* /Values Section */}
                    {/* Stats Section */}
                    <section id="stats" className="stats section">
                        <div className="container" data-aos="fade-up" data-aos-delay={100}>
                            <div className="row gy-4">
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i className="bi bi-emoji-smile color-blue flex-shrink-0" />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={232}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Happy Clients</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i
                                            className="bi bi-journal-richtext color-orange flex-shrink-0"
                                            style={{ color: "#ee6c20" }}
                                        />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={521}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Hoạt động</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i
                                            className="bi bi-bookmark-check color-green flex-shrink-0"
                                            style={{ color: "#15be56" }}
                                        />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={20}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Tổ chức tài trợ</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                                <div className="col-lg-3 col-md-6">
                                    <div className="stats-item d-flex align-items-center w-100 h-100">
                                        <i
                                            className="bi bi-people color-pink flex-shrink-0"
                                            style={{ color: "#bb0852" }}
                                        />
                                        <div>
                                            <span
                                                data-purecounter-start={0}
                                                data-purecounter-end={1809}
                                                data-purecounter-duration={1}
                                                className="purecounter"
                                            />
                                            <p>Tình nguyện viên</p>
                                        </div>
                                    </div>
                                </div>
                                {/* End Stats Item */}
                            </div>
                        </div>
                    </section>
                    {/* /Stats Section */}
                    {/* Features Section */}
                    <section id="features" className="features section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Tính năng</h2>
                            <p>
                                Các tính năng nổi bật
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div className="row gy-5">
                                <div className="col-xl-6" data-aos="zoom-out" data-aos-delay={100}>
                                    <img src="assets/img/features.png" className="img-fluid" alt="" />
                                </div>
                                <div className="col-xl-6 d-flex">
                                    <div className="row align-self-center gy-4">
                                        <div className="col-md-6" data-aos="fade-up" data-aos-delay={200}>
                                            <div className="feature-box d-flex align-items-center">
                                                <i className="bi bi-check" />
                                                <h3>Tạo &amp; Quản Lý Sự Kiện Dễ Dàng</h3>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6" data-aos="fade-up" data-aos-delay={300}>
                                            <div className="feature-box d-flex align-items-center">
                                                <i className="bi bi-check" />
                                                <h3>Đăng Ký &amp; Quan Tâm Sự Kiện</h3>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6" data-aos="fade-up" data-aos-delay={400}>
                                            <div className="feature-box d-flex align-items-center">
                                                <i className="bi bi-check" />
                                                <h3>Tích Điểm &amp; Vinh Danh</h3>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6" data-aos="fade-up" data-aos-delay={500}>
                                            <div className="feature-box d-flex align-items-center">
                                                <i className="bi bi-check" />
                                                <h3>Tạo Nhóm &amp; Kết Nối Cộng Đồng</h3>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6" data-aos="fade-up" data-aos-delay={600}>
                                            <div className="feature-box d-flex align-items-center">
                                                <i className="bi bi-check" />
                                                <h3>Hệ Thống Nhắn Tin &amp; Tương Tác</h3>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6" data-aos="fade-up" data-aos-delay={700}>
                                            <div className="feature-box d-flex align-items-center">
                                                <i className="bi bi-check" />
                                                <h3>Bảng Xếp Hạng &amp; Huy Hiệu</h3>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /Features Section */}
                    {/* Alt Features Section */}
                    <section id="alt-features" className="alt-features section">
                        <div className="container">
                            <div className="row gy-5">
                                <div
                                    className="col-xl-7 d-flex order-2 order-xl-1"
                                    data-aos="fade-up"
                                    data-aos-delay={200}
                                >
                                    <div className="row align-self-center gy-5">
                                        <div className="col-md-6 icon-box">
                                            <i className="bi bi-people" />
                                            <div>
                                                <h4>Kết nối cộng đồng</h4>
                                                <p>
                                                    Gặp gỡ, giao lưu và kết nối với hàng nghìn tình nguyện viên
                                                    trên toàn quốc.
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6 icon-box">
                                            <i className="bi bi-calendar-event" />
                                            <div>
                                                <h4>Quản lý sự kiện dễ dàng</h4>
                                                <p>
                                                    Tạo sự kiện nhanh chóng, theo dõi tiến độ và mời bạn bè tham
                                                    gia.
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6 icon-box">
                                            <i className="bi bi-star" />
                                            <div>
                                                <h4>Tích lũy điểm &amp; vinh danh</h4>
                                                <p>
                                                    Mỗi đóng góp của bạn đều được ghi nhận thông qua hệ thống
                                                    tích điểm &amp; huy hiệu.
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6 icon-box">
                                            <i className="bi bi-chat-dots" />
                                            <div>
                                                <h4>Nhắn tin &amp; tạo nhóm</h4>
                                                <p>
                                                    Tương tác, thảo luận với bạn bè, hoặc tham gia nhóm để tổ
                                                    chức hoạt động dài hạn.
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6 icon-box">
                                            <i className="bi bi-bell" />
                                            <div>
                                                <h4>Thông báo sự kiện quan trọng</h4>
                                                <p>
                                                    Luôn cập nhật những sự kiện phù hợp nhất với bạn để không bỏ
                                                    lỡ cơ hội tham gia.
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                        <div className="col-md-6 icon-box">
                                            <i className="bi bi-patch-check" />
                                            <div>
                                                <h4>Hồ sơ thiện nguyện cá nhân</h4>
                                                <p>
                                                    Ghi lại và hiển thị những hoạt động thiện nguyện bạn đã tham
                                                    gia, giúp ích cho sự nghiệp &amp; cuộc sống.
                                                </p>
                                            </div>
                                        </div>
                                        {/* End Feature Item */}
                                    </div>
                                </div>
                                <div
                                    className="col-xl-5 d-flex align-items-center order-1 order-xl-2"
                                    data-aos="fade-up"
                                    data-aos-delay={100}
                                >
                                    <img
                                        src="assets/img/alt-features.png"
                                        className="img-fluid"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /Alt Features Section */}
                    {/* Services Section */}
                    <section id="services" className="services section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Services</h2>
                            <p>
                                Check Our Services
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div className="row gy-4">
                                <div
                                    className="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={100}
                                >
                                    <div className="service-item item-cyan position-relative">
                                        <i className="bi bi-activity icon" />
                                        <h3>Nesciunt Mete</h3>
                                        <p>
                                            Provident nihil minus qui consequatur non omnis maiores. Eos
                                            accusantium minus dolores iure perferendis tempore et
                                            consequatur.
                                        </p>
                                        <a href="#" className="read-more stretched-link">
                                            <span>Read More</span> <i className="bi bi-arrow-right" />
                                        </a>
                                    </div>
                                </div>
                                {/* End Service Item */}
                                <div
                                    className="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={200}
                                >
                                    <div className="service-item item-orange position-relative">
                                        <i className="bi bi-broadcast icon" />
                                        <h3>Eosle Commodi</h3>
                                        <p>
                                            Ut autem aut autem non a. Sint sint sit facilis nam iusto sint.
                                            Libero corrupti neque eum hic non ut nesciunt dolorem.
                                        </p>
                                        <a href="#" className="read-more stretched-link">
                                            <span>Read More</span> <i className="bi bi-arrow-right" />
                                        </a>
                                    </div>
                                </div>
                                {/* End Service Item */}
                                <div
                                    className="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={300}
                                >
                                    <div className="service-item item-teal position-relative">
                                        <i className="bi bi-easel icon" />
                                        <h3>Ledo Markt</h3>
                                        <p>
                                            Ut excepturi voluptatem nisi sed. Quidem fuga consequatur. Minus
                                            ea aut. Vel qui id voluptas adipisci eos earum corrupti.
                                        </p>
                                        <a href="#" className="read-more stretched-link">
                                            <span>Read More</span> <i className="bi bi-arrow-right" />
                                        </a>
                                    </div>
                                </div>
                                {/* End Service Item */}
                                <div
                                    className="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={400}
                                >
                                    <div className="service-item item-red position-relative">
                                        <i className="bi bi-bounding-box-circles icon" />
                                        <h3>Asperiores Commodi</h3>
                                        <p>
                                            Non et temporibus minus omnis sed dolor esse consequatur.
                                            Cupiditate sed error ea fuga sit provident adipisci neque.
                                        </p>
                                        <a href="#" className="read-more stretched-link">
                                            <span>Read More</span> <i className="bi bi-arrow-right" />
                                        </a>
                                    </div>
                                </div>
                                {/* End Service Item */}
                                <div
                                    className="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={500}
                                >
                                    <div className="service-item item-indigo position-relative">
                                        <i className="bi bi-calendar4-week icon" />
                                        <h3>Velit Doloremque.</h3>
                                        <p>
                                            Cumque et suscipit saepe. Est maiores autem enim facilis ut aut
                                            ipsam corporis aut. Sed animi at autem alias eius labore.
                                        </p>
                                        <a href="#" className="read-more stretched-link">
                                            <span>Read More</span> <i className="bi bi-arrow-right" />
                                        </a>
                                    </div>
                                </div>
                                {/* End Service Item */}
                                <div
                                    className="col-lg-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={600}
                                >
                                    <div className="service-item item-pink position-relative">
                                        <i className="bi bi-chat-square-text icon" />
                                        <h3>Dolori Architecto</h3>
                                        <p>
                                            Hic molestias ea quibusdam eos. Fugiat enim doloremque aut neque
                                            non et debitis iure. Corrupti recusandae ducimus enim.
                                        </p>
                                        <a href="#" className="read-more stretched-link">
                                            <span>Read More</span> <i className="bi bi-arrow-right" />
                                        </a>
                                    </div>
                                </div>
                                {/* End Service Item */}
                            </div>
                        </div>
                    </section>
                    {/* /Services Section */}
                    {/* Pricing Section */}
                    <section id="pricing" className="pricing section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Pricing</h2>
                            <p>
                                Check Our Affordable Pricing
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div className="row gy-4">
                                <div
                                    className="col-lg-3 col-md-6"
                                    data-aos="zoom-in"
                                    data-aos-delay={100}
                                >
                                    <div className="pricing-tem">
                                        <h3 style={{ color: "#20c997" }}>Free Plan</h3>
                                        <div className="price">
                                            <sup>$</sup>0<span> / mo</span>
                                        </div>
                                        <div className="icon">
                                            <i className="bi bi-box" style={{ color: "#20c997" }} />
                                        </div>
                                        <ul>
                                            <li>Aida dere</li>
                                            <li>Nec feugiat nisl</li>
                                            <li>Nulla at volutpat dola</li>
                                            <li className="na">Pharetra massa</li>
                                            <li className="na">Massa ultricies mi</li>
                                        </ul>
                                        <a href="#" className="btn-buy">
                                            Buy Now
                                        </a>
                                    </div>
                                </div>
                                {/* End Pricing Item */}
                                <div
                                    className="col-lg-3 col-md-6"
                                    data-aos="zoom-in"
                                    data-aos-delay={200}
                                >
                                    <div className="pricing-tem">
                                        <span className="featured">Featured</span>
                                        <h3 style={{ color: "#0dcaf0" }}>Starter Plan</h3>
                                        <div className="price">
                                            <sup>$</sup>19<span> / mo</span>
                                        </div>
                                        <div className="icon">
                                            <i className="bi bi-send" style={{ color: "#0dcaf0" }} />
                                        </div>
                                        <ul>
                                            <li>Aida dere</li>
                                            <li>Nec feugiat nisl</li>
                                            <li>Nulla at volutpat dola</li>
                                            <li>Pharetra massa</li>
                                            <li className="na">Massa ultricies mi</li>
                                        </ul>
                                        <a href="#" className="btn-buy">
                                            Buy Now
                                        </a>
                                    </div>
                                </div>
                                {/* End Pricing Item */}
                                <div
                                    className="col-lg-3 col-md-6"
                                    data-aos="zoom-in"
                                    data-aos-delay={300}
                                >
                                    <div className="pricing-tem">
                                        <h3 style={{ color: "#fd7e14" }}>Business Plan</h3>
                                        <div className="price">
                                            <sup>$</sup>29<span> / mo</span>
                                        </div>
                                        <div className="icon">
                                            <i className="bi bi-airplane" style={{ color: "#fd7e14" }} />
                                        </div>
                                        <ul>
                                            <li>Aida dere</li>
                                            <li>Nec feugiat nisl</li>
                                            <li>Nulla at volutpat dola</li>
                                            <li>Pharetra massa</li>
                                            <li>Massa ultricies mi</li>
                                        </ul>
                                        <a href="#" className="btn-buy">
                                            Buy Now
                                        </a>
                                    </div>
                                </div>
                                {/* End Pricing Item */}
                                <div
                                    className="col-lg-3 col-md-6"
                                    data-aos="zoom-in"
                                    data-aos-delay={400}
                                >
                                    <div className="pricing-tem">
                                        <h3 style={{ color: "#0d6efd" }}>Ultimate Plan</h3>
                                        <div className="price">
                                            <sup>$</sup>49<span> / mo</span>
                                        </div>
                                        <div className="icon">
                                            <i className="bi bi-rocket" style={{ color: "#0d6efd" }} />
                                        </div>
                                        <ul>
                                            <li>Aida dere</li>
                                            <li>Nec feugiat nisl</li>
                                            <li>Nulla at volutpat dola</li>
                                            <li>Pharetra massa</li>
                                            <li>Massa ultricies mi</li>
                                        </ul>
                                        <a href="#" className="btn-buy">
                                            Buy Now
                                        </a>
                                    </div>
                                </div>
                                {/* End Pricing Item */}
                            </div>
                            {/* End pricing row */}
                        </div>
                    </section>
                    {/* /Pricing Section */}
                    {/* Faq Section */}
                    <section id="faq" className="faq section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>F.A.Q</h2>
                            <p>Câu hỏi thường gặp</p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6" data-aos="fade-up" data-aos-delay={100}>
                                    <div className="faq-container">
                                        <div className="faq-item faq-active">
                                            <h3>Làm thế nào để tham gia một hoạt động thiện nguyện?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Bạn có thể duyệt qua danh sách các hoạt động và bấm "Quan
                                                    tâm" hoặc "Tôi sẽ tham gia". Người tổ chức sẽ liên hệ nếu
                                                    cần thêm thông tin.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                        <div className="faq-item">
                                            <h3>Tôi có thể tự tạo một hoạt động không?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Có! Sau khi đăng ký tài khoản, bạn có thể tạo hoạt động mới,
                                                    mô tả chi tiết và kêu gọi tình nguyện viên tham gia.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                        <div className="faq-item">
                                            <h3>Làm thế nào để tích lũy điểm tình nguyện?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Sau khi tham gia một hoạt động và hoàn thành, hệ thống sẽ
                                                    ghi nhận số điểm tương ứng. Điểm này có thể dùng để xếp hạng
                                                    hoặc nhận phần thưởng từ các đối tác.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                        <div className="faq-item">
                                            <h3>Làm sao để báo cáo một hoạt động không phù hợp?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Bạn có thể bấm vào "Báo cáo vi phạm" trong trang chi tiết
                                                    của hoạt động để đội ngũ kiểm duyệt xem xét.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                    </div>
                                </div>
                                {/* End Faq Column*/}
                                <div className="col-lg-6" data-aos="fade-up" data-aos-delay={200}>
                                    <div className="faq-container">
                                        <div className="faq-item">
                                            <h3>Làm sao để liên hệ với người tổ chức?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Bạn có thể nhắn tin trực tiếp thông qua hệ thống hoặc tham
                                                    gia nhóm liên quan đến hoạt động đó.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                        <div className="faq-item">
                                            <h3>
                                                Có thể tìm kiếm các hoạt động theo địa điểm hoặc lĩnh vực
                                                không?
                                            </h3>
                                            <div className="faq-content">
                                                <p>
                                                    Có thể! Bạn có thể lọc hoạt động theo tỉnh/thành phố, thời
                                                    gian hoặc loại hình thiện nguyện như cứu trợ, giáo dục, môi
                                                    trường...
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                        <div className="faq-item">
                                            <h3>Tôi có thể tham gia với tư cách tổ chức không?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Có, các tổ chức phi lợi nhuận có thể đăng ký và tạo hoạt
                                                    động để tìm kiếm tình nguyện viên phù hợp.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                        <div className="faq-item">
                                            <h3>Có phí khi sử dụng nền tảng này không?</h3>
                                            <div className="faq-content">
                                                <p>
                                                    Hoàn toàn không! Trang web hoàn toàn miễn phí cho cả tình
                                                    nguyện viên và tổ chức thiện nguyện.
                                                </p>
                                            </div>
                                            <i className="faq-toggle bi bi-chevron-right" />
                                        </div>
                                        {/* End Faq item*/}
                                    </div>
                                </div>
                                {/* End Faq Column*/}
                            </div>
                        </div>
                    </section>
                    {/* /Faq Section */}
                    {/* Portfolio Section */}
                    <section id="event" className="portfolio section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Hoạt động</h2>
                            <p>Xem các hoạt động nỗi bật của tôi</p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div
                                className="isotope-layout"
                                data-default-filter="*"
                                data-layout="masonry"
                                data-sort="original-order"
                            >
                                <ul
                                    className="portfolio-filters isotope-filters"
                                    data-aos="fade-up"
                                    data-aos-delay={100}
                                >
                                    <li data-filter="*" className="filter-active">
                                        All
                                    </li>
                                    <li data-filter=".filter-app">Môi trường</li>
                                    <li data-filter=".filter-product">Hỗ trợ cộng đồng</li>
                                    <li data-filter=".filter-branding">Giáo dục</li>
                                    <li data-filter=".filter-books">Từ thiện</li>
                                </ul>
                                {/* End Portfolio Filters */}
                                <div
                                    className="row gy-4 isotope-container"
                                    data-aos="fade-up"
                                    data-aos-delay={200}
                                >
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-app">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://imgchinhsachcuocsong.vnanet.vn/MediaUpload/Org/2023/07/23/175355-vna_potal_thanh_doan_thanh_pho_ho_chi_minh_ra_quan_ngay_chu_nhat_xanh_lan_thu_150_6846378.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Tình nguyện hè 2024</h4>
                                                <p>Phát huy sức trẻ vì môi trường xanh</p>
                                                <a
                                                    href="https://imgchinhsachcuocsong.vnanet.vn/MediaUpload/Org/2023/07/23/175355-vna_potal_thanh_doan_thanh_pho_ho_chi_minh_ra_quan_ngay_chu_nhat_xanh_lan_thu_150_6846378.jpg"
                                                    title="Tình nguyện hè 2024"
                                                    data-gallery="portfolio-gallery-app"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-product">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://doanthanhnien.vn/Content/uploads/images/133250036339003808_EEA1A55F-76B0-4B9C-ADBA-8B17F25DFC14.jpeg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Cần thơ</h4>
                                                <p>
                                                    ra mắt 09 tuyến đường “Văn minh – an toàn – xanh – sạch –
                                                    đẹp”
                                                </p>
                                                <a
                                                    href="https://doanthanhnien.vn/Content/uploads/images/133250036339003808_EEA1A55F-76B0-4B9C-ADBA-8B17F25DFC14.jpeg"
                                                    title="Cần thơ"
                                                    data-gallery="portfolio-gallery-product"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a
                                                    href=""
                                                    title="ra mắt 09 tuyến đường “Văn minh – an toàn – xanh – sạch – đẹp”"
                                                    className="details-link"
                                                >
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-branding">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.6435-9/81552257_686430335096250_6794594921757016064_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEoUFLzVFM82HYllLbuvol0ZL2AP_0FmclkvYA__QWZyQBoL9VGFzWUw-Fdy7ixN_6LbgRjH1Qyw0i0MMQtFrwZ&_nc_ohc=std1qaSLbYgQ7kNvgHwD30v&_nc_oc=AdkfyKDflJGREpD8n3-mPKsLH8h7Ft58UuNCi6fsgzalN3wQ0-I9oH0RDUB7dJ0ILJA&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=-jSBPZc9iMcElSzZSs7eGw&oh=00_AYG5sK9jpx3iF-awhquz7A0Mon7LWugZP3iEvD1O19WmvA&oe=68107939"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Lớp học cầu vồng</h4>
                                                <p>
                                                    mở các lớp học cho các trẻ em nghèo cũng như giúp đỡ các em
                                                    nhỏ bị chậm phát triển hay tự kỉ
                                                </p>
                                                <a
                                                    href="https://scontent.fdad2-1.fna.fbcdn.net/v/t1.6435-9/81552257_686430335096250_6794594921757016064_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEoUFLzVFM82HYllLbuvol0ZL2AP_0FmclkvYA__QWZyQBoL9VGFzWUw-Fdy7ixN_6LbgRjH1Qyw0i0MMQtFrwZ&_nc_ohc=std1qaSLbYgQ7kNvgHwD30v&_nc_oc=AdkfyKDflJGREpD8n3-mPKsLH8h7Ft58UuNCi6fsgzalN3wQ0-I9oH0RDUB7dJ0ILJA&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=-jSBPZc9iMcElSzZSs7eGw&oh=00_AYG5sK9jpx3iF-awhquz7A0Mon7LWugZP3iEvD1O19WmvA&oe=68107939"
                                                    title="Lớp học cầu vồng"
                                                    data-gallery="portfolio-gallery-branding"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a
                                                    href="portfolio-details.html"
                                                    title="More Details"
                                                    className="details-link"
                                                >
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-books">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/201907/original/images5371356_IMG_5516.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Ni cô Diệu Phúc</h4>
                                                <p>
                                                    Trưởng ban Từ thiện trao quà và học bổng cho học sinh có
                                                    hoàn cảnh khó khăn huyện Khánh Vĩnh.
                                                </p>
                                                <a
                                                    href="https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/dataimages/201907/original/images5371356_IMG_5516.jpg"
                                                    title="Ni cô Diệu Phúc"
                                                    data-gallery="portfolio-gallery-book"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a
                                                    href="portfolio-details.html"
                                                    title="More Details"
                                                    className="details-link"
                                                >
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-app">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://www.vienchuyentu.com/wp-content/uploads/2023/08/11_1_20230827205809.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Viện chuyên tu</h4>
                                                <p>Góp sức bảo vệ môi trường, hỗ trợ người nghèo</p>
                                                <a
                                                    href="https://www.vienchuyentu.com/wp-content/uploads/2023/08/11_1_20230827205809.jpg"
                                                    title="Viện chuyên tu"
                                                    data-gallery="portfolio-gallery-app"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-product">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://cdnmedia.baotintuc.vn/Upload/ekaE01yuAw3S4G2j0Rtmuw/files/2024/03/doiraclayqua140324.jpeg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Ngày FPT vì cộng đồng</h4>
                                                <p>Hoạt động đổi rác lấy quà</p>
                                                <a
                                                    href="https://cdnmedia.baotintuc.vn/Upload/ekaE01yuAw3S4G2j0Rtmuw/files/2024/03/doiraclayqua140324.jpeg"
                                                    title="Ngày FPT vì cộng đồng"
                                                    data-gallery="portfolio-gallery-product"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-branding">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://file3.qdnd.vn/data/images/0/2023/04/30/phucthang/lop%20hoc%20chua%20huong%20lan%20qdnd1.jpg?dpi=150&quality=100&w=870"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Lớp học tình thương tại chùa Hương Lan</h4>
                                                <p>
                                                    một lớp học dành cho những đứa trẻ “đặc biệt” hoàn toàn miễn
                                                    phí
                                                </p>
                                                <a
                                                    href="https://file3.qdnd.vn/data/images/0/2023/04/30/phucthang/lop%20hoc%20chua%20huong%20lan%20qdnd1.jpg?dpi=150&quality=100&w=870"
                                                    title="Branding 2"
                                                    data-gallery="portfolio-gallery-branding"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-books">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://hanoitourist.com.vn/upload_images/images/Tin%20HNT/IMG_9784.JPG"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Thanh niên Đà Nẵng</h4>
                                                <p>Ấm lòng những suất cơm từ thiện</p>
                                                <a
                                                    href="https://hanoitourist.com.vn/upload_images/images/Tin%20HNT/IMG_9784.JPG"
                                                    title="Thanh niên Đà Nẵng"
                                                    data-gallery="portfolio-gallery-book"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-app">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://cafefcdn.com/203337114487263232/2024/10/8/registration-1-1728038058-1728038058-1728368716684-17283687182781554254118-1728377012342-17283770128281272066221.jpeg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Sài gòn xanh</h4>
                                                <p>
                                                    không chỉ là một tổ chức, mà còn là sứ mệnh của tất cả chúng
                                                    ta
                                                </p>
                                                <a
                                                    href="https://cafefcdn.com/203337114487263232/2024/10/8/registration-1-1728038058-1728038058-1728368716684-17283687182781554254118-1728377012342-17283770128281272066221.jpeg"
                                                    title="Sài gòn xanh"
                                                    data-gallery="portfolio-gallery-app"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-product">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="http://images.baodantoc.vn/uploads/2020/Th%C3%A1ng%201/ngay%2014/anh%20bai%20tinh%20nguyen.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Quảng Nam</h4>
                                                <p>Dọn dẹp sau lũ tại vùng cao</p>
                                                <a
                                                    href="http://images.baodantoc.vn/uploads/2020/Th%C3%A1ng%201/ngay%2014/anh%20bai%20tinh%20nguyen.jpg"
                                                    title="Quảng Nam"
                                                    data-gallery="portfolio-gallery-product"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-branding">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://img.cand.com.vn/resize/800x800/NewFiles/Images/2023/05/23/Thang_5-1684843560371.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Lớp học tình thương của anh bảo vệ dân phố</h4>
                                                <p>
                                                    Trải qua gần 13 năm hoạt động, đến nay, với sự hỗ trợ của
                                                    chính quyền địa phương, Đoàn thanh niên, những nhà hảo tâm
                                                    và sinh viên tình nguyện, lớp học đã tiến thêm một bước mới
                                                    là “phổ cập tình thương”
                                                </p>
                                                <a
                                                    href="https://img.cand.com.vn/resize/800x800/NewFiles/Images/2023/05/23/Thang_5-1684843560371.jpg"
                                                    title="Lớp học tình thương của anh bảo vệ dân phố"
                                                    data-gallery="portfolio-gallery-branding"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a href="" title="More Details" className="details-link">
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                    <div className="col-lg-4 col-md-6 portfolio-item isotope-item filter-books">
                                        <div className="portfolio-content h-100">
                                            <img
                                                src="https://mediabhy.mediatech.vn/upload/image/202409/medium/75000_c6a92d33916160c79007bb253aab3663.webp"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="portfolio-info">
                                                <h4>Hướng về vùng lũ</h4>
                                                <p>
                                                    Tình nguyện viên nhiều nơi tiến về vùng lũ hỗ trợ công tác
                                                    sau lũ
                                                </p>
                                                <a
                                                    href="https://mediabhy.mediatech.vn/upload/image/202409/medium/75000_c6a92d33916160c79007bb253aab3663.webp"
                                                    title="Hướng về vùng lũ"
                                                    data-gallery="portfolio-gallery-book"
                                                    className="glightbox preview-link"
                                                >
                                                    <i className="bi bi-zoom-in" />
                                                </a>
                                                <a
                                                    href="portfolio-details.html"
                                                    title="More Details"
                                                    className="details-link"
                                                >
                                                    <i className="bi bi-link-45deg" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End Portfolio Item */}
                                </div>
                                {/* End Portfolio Container */}
                            </div>
                        </div>
                    </section>
                    {/* /Portfolio Section */}
                    {/* Testimonials Section */}
                    <section id="testimonials" className="testimonials section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Nhận xét</h2>
                            <p>
                                Những gì họ nói về chúng tôi
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div className="container" data-aos="fade-up" data-aos-delay={100}>
                            <div className="swiper init-swiper">
                                <div className="swiper-wrapper">
                                    <div className="swiper-slide">
                                        <div className="testimonial-item">
                                            <div className="stars">
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                            </div>
                                            <p>
                                                VolunHub thực sự là một nền tảng tuyệt vời! Nhờ có nó, tôi đã
                                                kết nối với rất nhiều người có chung chí hướng và cùng nhau
                                                giúp đỡ cộng đồng.
                                            </p>
                                            <div className="profile mt-auto">
                                                <img
                                                    src="assets/img/testimonials/testimonials-1.jpg"
                                                    className="testimonial-img"
                                                    alt=""
                                                />
                                                <h3>Nguyễn Minh Hoàng</h3>
                                                <h4>Nhà sáng lập tổ chức từ thiện</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End testimonial item */}
                                    <div className="swiper-slide">
                                        <div className="testimonial-item">
                                            <div className="stars">
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                            </div>
                                            <p>
                                                Giao diện dễ sử dụng, thông tin rõ ràng và hỗ trợ rất nhanh
                                                chóng. Tôi đã tìm thấy nhiều cơ hội tình nguyện phù hợp nhờ
                                                VolunHub.
                                            </p>
                                            <div className="profile mt-auto">
                                                <img
                                                    src="assets/img/testimonials/testimonials-5.jpg"
                                                    className="testimonial-img"
                                                    alt=""
                                                />
                                                <h3>Trần Thảo My</h3>
                                                <h4>Nhà thiết kế</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End testimonial item */}
                                    <div className="swiper-slide">
                                        <div className="testimonial-item">
                                            <div className="stars">
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                            </div>
                                            <p>
                                                Nhờ VolunHub, tôi đã có cơ hội giúp đỡ những người cao tuổi
                                                neo đơn trong khu vực. Đây thực sự là một sáng kiến có ý nghĩa
                                                lớn.
                                            </p>
                                            <div className="profile mt-auto">
                                                <img
                                                    src="assets/img/testimonials/testimonials-3.jpg"
                                                    className="testimonial-img"
                                                    alt=""
                                                />
                                                <h3>Phạm Hữu Nghĩa</h3>
                                                <h4>Chủ cửa hàng</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End testimonial item */}
                                    <div className="swiper-slide">
                                        <div className="testimonial-item">
                                            <div className="stars">
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                            </div>
                                            <p>
                                                Tôi thực sự ấn tượng với cách VolunHub sử dụng công nghệ để
                                                kết nối mọi người. Mọi thứ trở nên thuận tiện hơn rất nhiều!
                                            </p>
                                            <div className="profile mt-auto">
                                                <img
                                                    src="assets/img/testimonials/testimonials-4.jpg"
                                                    className="testimonial-img"
                                                    alt=""
                                                />
                                                <h3>Đỗ Tuấn Anh</h3>
                                                <h4>Freelancer</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End testimonial item */}
                                    <div className="swiper-slide">
                                        <div className="testimonial-item">
                                            <div className="stars">
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                                <i className="bi bi-star-fill" />
                                            </div>
                                            <p>
                                                Tôi chưa bao giờ nghĩ rằng việc tham gia tình nguyện lại dễ
                                                dàng đến thế. VolunHub thực sự đã thay đổi cách tôi tiếp cận
                                                việc giúp đỡ cộng đồng.
                                            </p>
                                            <div className="profile mt-auto">
                                                <img
                                                    src="assets/img/testimonials/testimonials-2.jpg"
                                                    className="testimonial-img"
                                                    alt=""
                                                />
                                                <h3>Ngô Hoàng Long</h3>
                                                <h4>Doanh nhân</h4>
                                            </div>
                                        </div>
                                    </div>
                                    {/* End testimonial item */}
                                </div>
                                <div className="swiper-pagination" />
                            </div>
                        </div>
                    </section>
                    {/* /Testimonials Section */}
                    {/* Team Section */}
                    <section id="team" className="team section">
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Đội ngũ</h2>
                            <p>Đội ngũ sáng lập của VolunHub</p>
                        </div>
                        <div className="container">
                            <div className="row gy-4">
                                <div
                                    className="col-lg-4 col-md-6 d-flex align-items-stretch"
                                    data-aos="fade-up"
                                    data-aos-delay={100}
                                >
                                    <div className="team-member">
                                        <div className="member-img">
                                            <img
                                                src="assets/img/team/team-1.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="social">
                                                <a href="">
                                                    <i className="bi bi-twitter-x" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-facebook" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-instagram" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-linkedin" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="member-info">
                                            <h4>Hồ Ngọc Viên</h4>
                                            <span>Người sáng lập</span>
                                            <p>
                                                Là người đặt nền móng cho VolunHub, Viên luôn tâm huyết với
                                                việc kết nối tình nguyện viên và các tổ chức từ thiện để giúp
                                                cuộc sống tốt đẹp hơn.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-4 col-md-6 d-flex align-items-stretch"
                                    data-aos="fade-up"
                                    data-aos-delay={300}
                                >
                                    <div className="team-member">
                                        <div className="member-img">
                                            <img
                                                src="assets/img/team/team-3.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="social">
                                                <a href="">
                                                    <i className="bi bi-twitter-x" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-facebook" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-instagram" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-linkedin" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="member-info">
                                            <h4>Mạnh Duy</h4>
                                            <span>CTO</span>
                                            <p>
                                                Chịu trách nhiệm về phát triển công nghệ cho VolunHub, Duy
                                                luôn mang đến những giải pháp kỹ thuật hiệu quả giúp nâng cao
                                                trải nghiệm người dùng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="col-lg-4 col-md-6 d-flex align-items-stretch"
                                    data-aos="fade-up"
                                    data-aos-delay={400}
                                >
                                    <div className="team-member">
                                        <div className="member-img">
                                            <img
                                                src="assets/img/team/team-4.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <div className="social">
                                                <a href="">
                                                    <i className="bi bi-twitter-x" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-facebook" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-instagram" />
                                                </a>
                                                <a href="">
                                                    <i className="bi bi-linkedin" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="member-info">
                                            <h4>Nhật Tân</h4>
                                            <span>Đồng sáng lập</span>
                                            <p>
                                                Tân phụ trách việc truyền thông và quảng bá cho VolunHub, đảm
                                                bảo thông điệp của chúng tôi lan tỏa ra rộng rãi đến cộng
                                                đồng.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* /Team Section */}
                    {/* Recent Posts Section */}
                    <section id="recent-posts" className="recent-posts section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Tin Tức &amp; Hoạt Động</h2>
                            <p>Cập nhật những hoạt động thiện nguyện mới nhất</p>
                        </div>
                        {/* End Section Title */}
                        <div className="container">
                            <div className="row gy-5">
                                <div className="col-xl-4 col-md-6">
                                    <div
                                        className="post-item position-relative h-100"
                                        data-aos="fade-up"
                                        data-aos-delay={100}
                                    >
                                        <div className="post-img position-relative overflow-hidden">
                                            <img
                                                src="https://phunuvietnam.mediacdn.vn/179072216278405120/2021/12/31/yola-1-16409497614121089453110.jpg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <span className="post-date">12 Tháng 12</span>
                                        </div>
                                        <div className="post-content d-flex flex-column">
                                            <h3 className="post-title">
                                                Chuyến thiện nguyện đến vùng cao – Trao yêu thương
                                            </h3>
                                            <div className="meta d-flex align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person" />
                                                    <span className="ps-2">Nguyễn Minh An</span>
                                                </div>
                                                <span className="px-3 text-black-50">/</span>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-folder2" />
                                                    <span className="ps-2">Hoạt động cộng đồng</span>
                                                </div>
                                            </div>
                                            <hr />
                                            <a href="" className="readmore stretched-link">
                                                <span>Đọc thêm</span>
                                                <i className="bi bi-arrow-right" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* End post item */}
                                <div className="col-xl-4 col-md-6">
                                    <div
                                        className="post-item position-relative h-100"
                                        data-aos="fade-up"
                                        data-aos-delay={200}
                                    >
                                        <div className="post-img position-relative overflow-hidden">
                                            <img
                                                src="https://cdn.thuvienphapluat.vn//uploads/tintuc/2023/03/23/hien-mau-nhan-dao.jpeg"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <span className="post-date">17 Tháng 7</span>
                                        </div>
                                        <div className="post-content d-flex flex-column">
                                            <h3 className="post-title">
                                                Kêu gọi hiến máu cứu người – Hành động nhỏ, ý nghĩa lớn
                                            </h3>
                                            <div className="meta d-flex align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person" />
                                                    <span className="ps-2">Trần Hải Nam</span>
                                                </div>
                                                <span className="px-3 text-black-50">/</span>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-folder2" />
                                                    <span className="ps-2">Sự kiện thiện nguyện</span>
                                                </div>
                                            </div>
                                            <hr />
                                            <a href="" className="readmore stretched-link">
                                                <span>Đọc thêm</span>
                                                <i className="bi bi-arrow-right" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* End post item */}
                                <div
                                    className="col-xl-4 col-md-6"
                                    data-aos="fade-up"
                                    data-aos-delay={300}
                                >
                                    <div className="post-item position-relative h-100">
                                        <div className="post-img position-relative overflow-hidden">
                                            <img
                                                src="https://intracom.com.vn/wp-content/uploads/2024/05/nguoi-gia-neo-don-la-gi-2.jpg.webp"
                                                className="img-fluid"
                                                alt=""
                                            />
                                            <span className="post-date">05 Tháng 9</span>
                                        </div>
                                        <div className="post-content d-flex flex-column">
                                            <h3 className="post-title">
                                                Chương trình hỗ trợ người già neo đơn tại TP.HCM
                                            </h3>
                                            <div className="meta d-flex align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-person" />
                                                    <span className="ps-2">Lê Thu Hà</span>
                                                </div>
                                                <span className="px-3 text-black-50">/</span>
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-folder2" />
                                                    <span className="ps-2">Hỗ trợ cộng đồng</span>
                                                </div>
                                            </div>
                                            <hr />
                                            <a href="" className="readmore stretched-link">
                                                <span>Đọc thêm</span>
                                                <i className="bi bi-arrow-right" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/* End post item */}
                            </div>
                        </div>
                    </section>
                    {/* /Recent Posts Section */}
                    {/* Contact Section */}
                    <section id="contact" className="contact section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Liên Hệ</h2>
                            <p>Kết nối với chúng tôi để cùng lan tỏa yêu thương!</p>
                        </div>
                        {/* End Section Title */}
                        <div className="container" data-aos="fade-up" data-aos-delay={100}>
                            <div className="row gy-4">
                                <div className="col-lg-6">
                                    <div className="row gy-4">
                                        <div className="col-md-6">
                                            <div className="info-item" data-aos="fade" data-aos-delay={200}>
                                                <i className="bi bi-geo-alt" />
                                                <h3>Địa chỉ</h3>
                                                <p>470 Trần Đại Nghĩa</p>
                                                <p>Đà Nẵng, Việt Nam</p>
                                            </div>
                                        </div>
                                        {/* End Info Item */}
                                        <div className="col-md-6">
                                            <div className="info-item" data-aos="fade" data-aos-delay={300}>
                                                <i className="bi bi-telephone" />
                                                <h3>Hotline:</h3>
                                                <p>0905100200</p>
                                                <p>0905103212</p>
                                            </div>
                                        </div>
                                        {/* End Info Item */}
                                        <div className="col-md-6">
                                            <div className="info-item" data-aos="fade" data-aos-delay={400}>
                                                <i className="bi bi-envelope" />
                                                <h3>Email</h3>
                                                <p>volunhub.contact@net.vn</p>
                                            </div>
                                        </div>
                                        {/* End Info Item */}
                                        <div className="col-md-6">
                                            <div className="info-item" data-aos="fade" data-aos-delay={500}>
                                                <i className="bi bi-clock" />
                                                <h3>Giờ làm việc</h3>
                                                <p>Thứ Hai - Thứ Sáu</p>
                                                <p>9:00AM - 05:00PM</p>
                                            </div>
                                        </div>
                                        {/* End Info Item */}
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <form
                                        action="forms/contact.php"
                                        method="post"
                                        className="php-email-form"
                                        data-aos="fade-up"
                                        data-aos-delay={200}
                                    >
                                        <div className="row gy-4">
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    placeholder="Họ và tên của bạn"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    placeholder="Email của bạn"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="subject"
                                                    placeholder="Chủ đề liên hệ"
                                                    required
                                                />
                                            </div>
                                            <div className="col-12">
                                                <textarea
                                                    className="form-control"
                                                    name="message"
                                                    rows={6}
                                                    placeholder="Nội dung tin nhắn"
                                                    required
                                                    defaultValue={""}
                                                />
                                            </div>
                                            <div className="col-12 text-center">
                                                <div className="loading">Đang gửi...</div>
                                                <div className="error-message" />
                                                <div className="sent-message">
                                                    Tin nhắn của bạn đã được gửi. Cảm ơn bạn đã liên hệ!
                                                </div>
                                                <button type="submit">Gửi Tin Nhắn</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                {/* End Contact Form */}
                            </div>
                        </div>
                    </section>
                    {/* /Contact Section */}
                    {/* Clients Section */}
                    <section id="clients" className="clients section">
                        {/* Section Title */}
                        <div className="container section-title" data-aos="fade-up">
                            <h2>Đối Tác Nhân Ái</h2>
                            <p>
                                Hợp tác cùng các tổ chức từ thiện để tạo ra tác động tích cực
                                <br />
                            </p>
                        </div>
                        {/* End Section Title */}
                        <div className="container" data-aos="fade-up" data-aos-delay={100}>
                            <div className="swiper init-swiper">
                                <div className="swiper-wrapper align-items-center">
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-1.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-2.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-3.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-4.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-5.svg"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-6.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-7.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                    <div className="swiper-slide">
                                        <img
                                            src="assets/img/clients/client-8.png"
                                            className="img-fluid"
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="swiper-pagination" />
                            </div>
                        </div>
                    </section>
                    {/* /Clients Section */}
                </main>
                <footer id="footer" className="footer">
                    <div className="footer-newsletter">
                        <div className="container">
                            <div className="row justify-content-center text-center">
                                <div className="col-lg-6">
                                    <h4>Đăng Ký</h4>
                                    <p>Đăng ký ngay để gia nhập cùng chúng tôi!</p>
                                    <form
                                        action="forms/register.php"
                                        method="post"
                                        className="php-email-form"
                                    >
                                        <div className="newsletter-form">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Nhập email của bạn"
                                                required=""
                                            />
                                            <input type="submit" defaultValue="Đăng Ký" />
                                        </div>
                                        <div className="loading">Đang gửi...</div>
                                        <div className="error-message" />
                                        <div className="sent-message">
                                            Bạn đã đăng ký thành công. Cảm ơn bạn!
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container footer-top">
                        <div className="row gy-4">
                            <div className="col-lg-4 col-md-6 footer-about">
                                <a href="index.html" className="d-flex align-items-center">
                                    <span className="sitename">VolunHub</span>
                                </a>
                                <div className="footer-contact pt-3">
                                    <p>470 Trần Đại Nghĩa</p>
                                    <p>Đà Nẵng, Việt Nam</p>
                                    <p className="mt-3">
                                        <strong>Hotline:</strong> <span>0905100200</span>
                                    </p>
                                    <p>
                                        <strong>Email:</strong> <span>volunhub.contact@net.vn</span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-3 footer-links">
                                <h4>Liên Kết Hữu Ích</h4>
                                <ul>
                                    <li>
                                        <i className="bi bi-chevron-right" /> <a href="#">Trang chủ</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" /> <a href="#">Về chúng tôi</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" /> <a href="#">Dịch vụ</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" /> <a href="#">Điều khoản</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-3 footer-links">
                                <h4>Dịch Vụ Của Chúng Tôi</h4>
                                <ul>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Kết nối thiện nguyện</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Hỗ trợ người già</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Gây quỹ từ thiện</a>
                                    </li>
                                    <li>
                                        <i className="bi bi-chevron-right" />{" "}
                                        <a href="#">Hỗ trợ cộng đồng</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-lg-4 col-md-12">
                                <h4>Theo Dõi Chúng Tôi</h4>
                                <p>
                                    Kết nối với chúng tôi trên mạng xã hội để không bỏ lỡ bất kỳ hoạt
                                    động nào.
                                </p>
                                <div className="social-links d-flex">
                                    <a href="#">
                                        <i className="bi bi-twitter" />
                                    </a>
                                    <a href="#">
                                        <i className="bi bi-facebook" />
                                    </a>
                                    <a href="#">
                                        <i className="bi bi-instagram" />
                                    </a>
                                    <a href="#">
                                        <i className="bi bi-linkedin" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container copyright text-center mt-4">
                        <p>
                            ©{" "}
                            <span>
                                Bản quyền
                                <strong className="px-1 sitename">VolunHub</strong>
                                2025
                            </span>
                        </p>
                        <div className="credits">
                            Thiết kế bởi<a href="https://volunhub.vn"> VolunHub Team</a>
                        </div>
                    </div>
                </footer>
                {/* Scroll Top */}
                <a
                    href="#"
                    id="scroll-top"
                    className="scroll-top d-flex align-items-center justify-content-center"
                >
                    <i className="bi bi-arrow-up-short" />
                </a>
                {/* Vendor JS Files */}
                {/* Main JS File */}
            </>

        </>
    );
};

export default AboutPage;
