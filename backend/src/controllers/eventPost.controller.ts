// backend/src/controllers/eventPost.controller.ts
import { Request, Response, NextFunction } from 'express';
import eventPostService from '../services/eventPost.service';

class EventPostController {
    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = parseInt(req.params.eventId, 10);
            const userId = req.user?.userId; // Lấy từ authenticateToken
            const { content } = req.body;

            if (!userId) return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            if (isNaN(eventId)) return res.status(400).json({ message: 'Event ID không hợp lệ.' });
            // Validation cho content sẽ được middleware xử lý trước đó

            const postData = { eventId, userId, content };
            const newPost = await eventPostService.createPost(postData);

            res.status(201).json({ message: 'Đăng bài viết thành công!', post: newPost });

        } catch (error) {
            next(error);
        }
    }

    async getPostsForEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = parseInt(req.params.eventId, 10);
            if (isNaN(eventId)) return res.status(400).json({ message: 'Event ID không hợp lệ.' });

            const posts = await eventPostService.getPostsForEvent(eventId);
            res.status(200).json({ message: 'Lấy bài viết thành công!', posts });

        } catch (error) {
            next(error);
        }
    }
}

export default new EventPostController();