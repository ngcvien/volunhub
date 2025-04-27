// backend/src/controllers/event.controller.ts
import { Request, Response, NextFunction } from 'express';
import eventService from '../services/event.service';
// import { validationResult } from 'express-validator';

class EventController {

    async create(req: Request, res: Response, next: NextFunction) {
        const { title, description, location, eventTime, imageUrl } = req.body;
        const creatorId = req.user?.userId; 
        if (!creatorId) {
            return res.status(401).json({ message: 'Lỗi: Không tìm thấy thông tin người dùng đã xác thực.' });
        }

        try {
            const newEvent = await eventService.createEvent({
                creatorId,
                title,
                description,
                location,
                eventTime: new Date(eventTime),
                imageUrl: imageUrl || null 
            });
            res.status(201).json({ message: 'Tạo sự kiện thành công!', event: newEvent });
        } catch (error) {
            next(error); 
        }
    }

    // --- THÊM HÀM GET ALL ---
        async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const events = await eventService.getAllEvents(userId);
    
            res.status(200).json({ 
                message: 'Lấy danh sách sự kiện thành công!', 
                events 
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = parseInt(req.params.eventId, 10);
            const userId = req.user?.userId; // Lấy userId nếu có (từ token qua authenticateToken nếu route được bảo vệ)

            if (isNaN(eventId)) {
                return res.status(400).json({ message: 'Event ID không hợp lệ.' });
            }

            // Gọi service, truyền cả userId (optional) để lấy trạng thái like/join
            const eventDetail = await eventService.getEventById(eventId, userId);

            if (!eventDetail) {
                return res.status(404).json({ message: 'Sự kiện không tồn tại.' });
            }

            res.status(200).json({ message: 'Lấy chi tiết sự kiện thành công!', event: eventDetail });

        } catch (error) {
            next(error);
        }
    }

}

export default new EventController();