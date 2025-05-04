-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 04, 2025 lúc 07:38 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `volunhub_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `events`
--

CREATE TABLE `events` (
  `id` int(10) UNSIGNED NOT NULL,
  `creator_id` int(10) UNSIGNED NOT NULL COMMENT 'ID của người tạo sự kiện (tham chiếu users.id)',
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `event_time` datetime NOT NULL,
  `status` enum('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chứa thông tin các sự kiện tình nguyện';

--
-- Đang đổ dữ liệu cho bảng `events`
--

INSERT INTO `events` (`id`, `creator_id`, `title`, `description`, `location`, `event_time`, `status`, `image_url`, `created_at`, `updated_at`) VALUES
(2, 1, 'Thu gom rác bờ biển Mỹ Khê', 'Cùng nhau làm sạch bãi biển chuẩn bị cho mùa du lịch.', 'Bãi biển Mỹ Khê, Đà Nẵng', '2025-05-15 07:00:00', 'upcoming', 'https://cdn-i.vtcnews.vn/resize/ma/upload/2022/09/24/vi-cong-dong-23402335.jpg', '2025-04-22 11:00:22', '2025-04-22 11:00:22'),
(3, 1, 'Trồng cây xanh tại công viên Gia Định', 'Chung tay phủ xanh thành phố, giảm ô nhiễm không khí.', 'Công viên Gia Định, TP. Hồ Chí Minh', '2025-05-20 08:00:00', 'upcoming', 'https://dienbientv.vn/dataimages/202104/original/images3020506_cay_xanh.jpg', '2025-04-22 11:00:40', '2025-04-22 11:00:40'),
(4, 1, 'Phát cháo miễn phí tại Bệnh viện K', 'Chia sẻ yêu thương qua từng phần cháo nóng.', 'Bệnh viện K, Hà Nội', '2025-05-18 10:00:00', 'upcoming', 'https://bvdktinhbacgiang.vn/upload/2005838/fck/files/2ccf93fa-1eac-47a2-9a04-fa0ae1cfd76b_51ad3.jpg', '2025-04-22 11:00:50', '2025-04-22 11:00:50'),
(5, 1, 'Tặng quà cho trẻ em vùng cao', 'Mang đến niềm vui cho các em nhỏ vùng cao Tây Bắc.', 'Xã Tả Van, Lào Cai', '2025-05-25 03:00:00', 'upcoming', 'https://images2.thanhnien.vn/528068263637045248/2023/5/31/z4391746541643f29d8e7a6954bf26001388c653c4ec3d-16855196804471392689725.jpg', '2025-04-22 11:02:10', '2025-04-22 11:02:10'),
(6, 1, 'Hiến máu nhân đạo', 'Một giọt máu cho đi, một cuộc đời ở lại.', 'Trung tâm hiến máu Quốc gia, Hà Nội', '2025-05-22 06:30:00', 'upcoming', 'https://thacogroup.vn/storage/tin-tuc/a3202.jpg', '2025-04-22 11:02:20', '2025-04-22 11:02:20'),
(7, 1, 'Vẽ tranh tường cho trường mẫu giáo', 'Mang sắc màu đến với tuổi thơ.', 'Trường mẫu giáo Hoa Sen, Huế', '2025-05-19 02:00:00', 'upcoming', 'https://vietartdeco.com/wp-content/uploads/2022/06/z2824578415325_11b69d0bb38c523d2f5994c5ac387506.jpg', '2025-04-22 11:02:28', '2025-04-22 11:02:28'),
(9, 1, 'Lắp đèn năng lượng mặt trời cho xóm nghèo', 'Thắp sáng đường quê, lan tỏa hy vọng.', 'Xã Ia Rsai, Gia Lai', '2025-05-01 16:11:00', 'upcoming', 'https://cdnphoto.dantri.com.vn/5nlnZIFmoRfz0v4iZABVQII2aHU=/thumb_w/1020/2023/08/22/panasonic-solar-latern-pr1-v3-da-edit-1docx-1692674267538.jpeg', '2025-04-22 16:12:01', '2025-04-22 16:12:01'),
(10, 2, 'Chiến dịch \'Bữa cơm không rác\'', 'Ăn sạch, sống xanh, không rác thải nhựa.', 'KTX Đại học Quốc gia TP. HCM', '2025-05-09 16:13:00', 'upcoming', 'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2023/5/14/1192084/740DDFC2-B7BB-4E33-8.jpeg', '2025-04-22 16:14:01', '2025-04-22 16:14:01'),
(11, 1, 'Tổ chức hội chợ 0 đồng', 'Giúp đỡ người khó khăn có thêm quần áo và nhu yếu phẩm.', 'Phường An Khê, Đà Nẵng', '2025-05-28 04:00:00', 'upcoming', 'https://nld.mediacdn.vn/2021/1/30/img-3948-1612003061193657805867.jpg', '2025-04-22 18:00:09', '2025-04-22 18:00:09'),
(13, 1, 'Tập huấn phòng chống cháy rừng', 'Chủ động bảo vệ rừng trước mùa khô.', 'Hạt kiểm lâm Nam Đông, Thừa Thiên Huế', '2025-05-14 09:30:00', 'upcoming', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745386667/ql2qpcypcjebdaukt9k0.jpg', '2025-04-23 05:40:43', '2025-04-23 05:40:43'),
(14, 1, 'Làm sạch kênh Nhiêu Lộc', 'Vì một dòng kênh trong xanh trở lại.', 'Kênh Nhiêu Lộc - Thị Nghè, TP. Hồ Chí Minh', '2025-05-11 06:13:00', 'upcoming', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745388803/zw25veca7kdla7ppqk0u.jpg', '2025-04-23 06:13:58', '2025-04-23 06:13:58'),
(16, 1, 'Hành động cho tương lai', 'Chung thay vì một tương lại Xanh - Sạch - Đẹp\n', 'Thành phố Đà Nẵng', '2025-05-11 03:37:00', 'upcoming', 'https://a.cdn-hotels.com/gdcs/production55/d1377/d704ae3e-c6b8-4ef3-904d-15473e72e0e2.jpg', '2025-04-26 03:39:39', '2025-04-26 03:39:39'),
(17, 3, 'Tình nguyện hè', 'Các tình nguyện viên tổ chức tuyên truyền bảo vệ môi trường, phối hợp cùng nhân dân địa phương dọn vệ sinh, thu gom và xử lý rác thải, trồng thêm cây xanh. Có hơn 20km đường giao thông liên thôn được phát quang, dọn dẹp, thắp sáng 3,5km đường quê, tu sửa, làm mới, cải tạo các điểm trường, hỗ trợ các hộ gia đình xây dựng nhà vệ sinh đạt chuẩn nông thôn mới.', 'Thành phố Đà Nẵng', '2025-05-09 15:58:00', 'upcoming', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745683176/m9thkmmlutpzzahwwzqg.jpg', '2025-04-26 15:59:38', '2025-04-26 15:59:38'),
(23, 6, 'GIỮ DẤU CHÂN SAO LA – HÀNH TRÌNH KHÔNG DỪNG LẠI', 'Hành trình “Giữ dấu chân Sao la” là chặng đường tìm kiếm sự trở về của những dấu chân Sao la và đa dạng sinh học của rừng Trường Sơn. Trên chặng đường đó, chúng ta đã cùng nhìn lại “dấu chân” của chính mình để có cách ứng xử tốt hơn với thiên nhiên.', 'Thành phố Đà Nẵng', '2025-05-18 06:01:00', 'upcoming', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1746165740/q5zh0bwgbmydjd5biqum.jpg', '2025-05-02 06:02:25', '2025-05-02 06:02:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_likes`
--

CREATE TABLE `event_likes` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_likes`
--

INSERT INTO `event_likes` (`user_id`, `event_id`, `created_at`) VALUES
(1, 9, '2025-04-27 05:52:39'),
(1, 13, '2025-05-04 03:04:39'),
(1, 14, '2025-04-26 14:32:55'),
(1, 17, '2025-05-01 16:59:54'),
(2, 14, '2025-04-26 14:39:35'),
(2, 16, '2025-04-26 14:39:38'),
(2, 17, '2025-04-27 08:17:57'),
(3, 14, '2025-04-26 14:42:00'),
(3, 16, '2025-04-26 15:27:47'),
(3, 17, '2025-04-26 16:16:10'),
(4, 16, '2025-04-27 04:41:11'),
(4, 17, '2025-04-27 04:41:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_participants`
--

CREATE TABLE `event_participants` (
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người tham gia (tham chiếu users.id)',
  `event_id` int(10) UNSIGNED NOT NULL COMMENT 'ID sự kiện được tham gia (tham chiếu events.id)',
  `completion_status` enum('pending','confirmed','absent') NOT NULL DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ việc người dùng tham gia sự kiện';

--
-- Đang đổ dữ liệu cho bảng `event_participants`
--

INSERT INTO `event_participants` (`user_id`, `event_id`, `completion_status`, `created_at`, `updated_at`) VALUES
(1, 2, 'pending', '2025-04-26 04:36:38', '2025-04-26 04:36:38'),
(1, 5, 'pending', '2025-04-23 06:01:24', '2025-04-23 06:01:24'),
(1, 9, 'pending', '2025-04-23 17:12:38', '2025-04-23 17:12:38'),
(1, 13, 'pending', '2025-04-23 18:36:29', '2025-04-23 18:36:29'),
(1, 14, 'pending', '2025-04-27 09:38:54', '2025-04-27 09:38:54'),
(1, 17, 'pending', '2025-05-01 16:59:51', '2025-05-01 16:59:51'),
(2, 3, 'pending', '2025-04-23 01:32:52', '2025-04-23 01:32:52'),
(2, 11, 'confirmed', '2025-04-26 14:41:15', '2025-04-30 03:52:25'),
(2, 17, 'pending', '2025-04-27 05:54:37', '2025-04-27 05:54:37'),
(4, 17, 'pending', '2025-04-30 03:17:56', '2025-04-30 03:17:56');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_posts`
--

CREATE TABLE `event_posts` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_posts`
--

INSERT INTO `event_posts` (`id`, `event_id`, `user_id`, `content`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 17, 4, 'Cho em hỏi địa chỉ cụ thể là ở đâu vậy ạ?', NULL, '2025-04-27 05:45:32', '2025-04-27 05:45:32'),
(2, 9, 1, 'sắp tới ngày rồi mọi người đã sẵn sàng chưa?', NULL, '2025-04-27 05:53:32', '2025-04-27 05:53:32'),
(3, 17, 2, 'Quá ý nghĩa luôn 🥰', NULL, '2025-04-27 08:45:50', '2025-04-27 08:45:50'),
(4, 14, 2, 'Cùng nhau cố gắng nhé mọi người', NULL, '2025-04-27 08:56:21', '2025-04-27 08:56:21'),
(5, 14, 1, '🥰', NULL, '2025-04-27 09:39:09', '2025-04-27 09:39:09'),
(7, 17, 1, '🥰', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1746157077/rqtasf7pa5guz8qenfsm.webp', '2025-05-02 03:38:10', '2025-05-02 03:38:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `event_post_comments`
--

CREATE TABLE `event_post_comments` (
  `id` int(10) UNSIGNED NOT NULL,
  `post_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `parent_comment_id` int(10) UNSIGNED DEFAULT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `event_post_comments`
--

INSERT INTO `event_post_comments` (`id`, `post_id`, `user_id`, `parent_comment_id`, `content`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, 'Bình luận đầu tiên!', NULL, '2025-04-27 08:31:03', '2025-04-27 08:31:03'),
(2, 1, 1, 1, 'Trả lời bình luận đầu tiên!', NULL, '2025-04-27 08:34:49', '2025-04-27 08:34:49'),
(3, 1, 1, 1, 'Ở nhà tao á', NULL, '2025-04-27 10:08:23', '2025-04-27 10:08:23'),
(5, 3, 1, NULL, 'chứ sao', NULL, '2025-04-27 10:45:43', '2025-04-27 10:45:43'),
(6, 1, 1, NULL, 'ở nhà tao á', NULL, '2025-04-27 13:05:37', '2025-04-27 13:05:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250423051005-add-image-url-to-events.js'),
('20250423081351-add-profile-fields-to-users.js'),
('20250426120231-create-event-likes-table.js'),
('20250427041652-create-event-posts-table.js'),
('20250427081844-create-event-post-comments-table.js'),
('20250429104627-add-admin-fields-to-users.js'),
('20250429142842-add-status-to-events.js'),
('20250429185819-add-completion-status-to-event-participants.js'),
('20250502030644-add-image-url-to-event-posts.js'),
('20250502030758-add-image-url-to-event-post-comments.js');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(128) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin','verified_org') NOT NULL DEFAULT 'user',
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chứa thông tin người dùng';

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `is_verified`, `is_active`, `created_at`, `updated_at`, `full_name`, `bio`, `location`, `avatar_url`) VALUES
(1, 'viengoc234', 'ngocvien040906@gmail.com', '$2b$10$otGtF.DDKOr7ETCF6FDTbeuBfjVpfFqGVnyg9zNmyC.owh3wLp9S6', 'admin', 1, 1, '2025-04-22 01:53:28', '2025-05-04 04:15:17', 'Ngọc Viên', 'keo con 20 nam', 'Thành phố Đà Nẵng', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745399817/b43clmc4pzonseklsewo.jpg'),
(2, 'nhattan', 'tantdn.24ic@vku.udn.vn', '$2b$10$Jjrdha0OE6b8RiIUcexXA.EQIAJMWCT3JyE8V96gKZ72cYSADtc/a', 'user', 0, 1, '2025-04-22 03:17:11', '2025-05-04 04:12:00', 'Nhật Tân', 'Anh ở vùng quê khu nghèo khó đó', 'Thành phố Đà Nẵng', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745404162/k5cd9dwwuscfjen8ntgd.jpg'),
(3, 'thiennhan', 'nhannt.24ic@vku.udn.vn', '$2b$10$3xEVxRn6ZwcIDIkE9hbMSe3DMxZbP22nreQgDnw20uaku50fqOJe.', 'user', 0, 1, '2025-04-22 10:18:04', '2025-05-04 04:23:49', 'Thiện Nhân', NULL, 'Thành phố Đà Nẵng', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745678582/d2bes8eyrporssi1bim6.jpg'),
(4, 'china123', 'quoclt.24ic@vku.udn.vn', '$2b$10$EtEbeZusm1dVmB.AwkzfwOp.IpXolP62jZqk3R5unzlen.aWa5mG2', 'user', 0, 1, '2025-04-27 04:36:00', '2025-05-04 05:08:00', 'Trung Quốc', NULL, 'Thành phố Đà Nẵng', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745728858/tubexoz1cldg9nu6indj.jpg'),
(5, 'admin', 'vienhn.24ic@vku.udn.vn', '$2b$10$fQ8pshDI3PviZiv1e6vaG.hhcAeWRF.X557hUYy4JFjsUeYzTGIny', 'admin', 1, 1, '2025-04-29 11:29:47', '2025-05-04 05:06:01', NULL, NULL, NULL, 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1745926255/riuvy1u4ocfxc7fca1pg.jpg'),
(6, 'botgymdam', 'duyhm.24ic@vku.udn.vn', '$2b$10$hpZg5nUAbmfJZq.SnixrT.IXUGllicHX0WaxnOpovMW1c8FqqP6kW', 'user', 1, 0, '2025-05-04 04:58:03', '2025-05-04 05:35:49', 'Mạnh Duy', 'trưởng hội botgymdam Đà Nẵng', 'Thành phố Đà Nẵng', 'https://res.cloudinary.com/dlpw5ooot/image/upload/v1746334794/zlee7trsx6qvn41xd5lr.jpg');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_events_creator_id` (`creator_id`),
  ADD KEY `idx_events_event_time` (`event_time`);

--
-- Chỉ mục cho bảng `event_likes`
--
ALTER TABLE `event_likes`
  ADD PRIMARY KEY (`user_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Chỉ mục cho bảng `event_participants`
--
ALTER TABLE `event_participants`
  ADD PRIMARY KEY (`user_id`,`event_id`),
  ADD KEY `idx_event_participants_event_id` (`event_id`);

--
-- Chỉ mục cho bảng `event_posts`
--
ALTER TABLE `event_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_posts_event_id_created_at` (`event_id`,`created_at`);

--
-- Chỉ mục cho bảng `event_post_comments`
--
ALTER TABLE `event_post_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_post_comments_post_id_created_at` (`post_id`,`created_at`),
  ADD KEY `event_post_comments_user_id` (`user_id`),
  ADD KEY `event_post_comments_parent_comment_id` (`parent_comment_id`);

--
-- Chỉ mục cho bảng `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `username_20` (`username`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `username_21` (`username`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `username_22` (`username`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `username_23` (`username`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `username_24` (`username`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `username_25` (`username`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `username_26` (`username`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `username_27` (`username`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `username_28` (`username`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `username_29` (`username`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `username_30` (`username`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `username_31` (`username`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD KEY `idx_users_email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `events`
--
ALTER TABLE `events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT cho bảng `event_posts`
--
ALTER TABLE `event_posts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `event_post_comments`
--
ALTER TABLE `event_post_comments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `event_likes`
--
ALTER TABLE `event_likes`
  ADD CONSTRAINT `event_likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_likes_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `fk_participant_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_participant_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `event_posts`
--
ALTER TABLE `event_posts`
  ADD CONSTRAINT `event_posts_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_posts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `event_post_comments`
--
ALTER TABLE `event_post_comments`
  ADD CONSTRAINT `event_post_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `event_posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_post_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_post_comments_ibfk_3` FOREIGN KEY (`parent_comment_id`) REFERENCES `event_post_comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
