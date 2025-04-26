// backend/src/controllers/like.controller.ts
import { Request, Response, NextFunction } from 'express';
import likeService from '../services/like.service';

class LikeController {

    async like(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const eventId = parseInt(req.params.eventId, 10);

            if (!userId) return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            if (isNaN(eventId)) return res.status(400).json({ message: 'Event ID không hợp lệ.' });

            await likeService.likeEvent(userId, eventId);
            res.status(201).json({ message: 'Thích sự kiện thành công!' });

        } catch (error) {
            next(error); // Chuyển lỗi về error middleware
        }
    }

    async unlike(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const eventId = parseInt(req.params.eventId, 10);

            if (!userId) return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            if (isNaN(eventId)) return res.status(400).json({ message: 'Event ID không hợp lệ.' });

            await likeService.unlikeEvent(userId, eventId);
            res.status(200).json({ message: 'Bỏ thích sự kiện thành công!' });

        } catch (error) {
            next(error);
        }
    }
}

export default new LikeController();