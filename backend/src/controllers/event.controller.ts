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
                imageUrl: imageUrl || null,

            });
            res.status(201).json({ message: 'Tạo sự kiện thành công!', event: newEvent });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy userId từ req.user nếu có (cho việc check like/join)
            const userId = req.user?.userId;

            // Lấy các query parameters từ URL (?q=..., &page=..., &limit=...)
            const query = req.query.q as string | undefined; // Từ khóa tìm kiếm
            const page = parseInt(req.query.page as string) || 1; // Trang hiện tại, mặc định là 1
            const limit = parseInt(req.query.limit as string) || 10; // Số item/trang, mặc định 10
            // Lấy các filter khác sau này: const status = req.query.status as string | undefined;

            // Gọi service với object options
            const result = await eventService.getAllEvents({
                userId,
                query,
                page,
                limit,
                // status
            });

            // Trả về kết quả đã phân trang
            res.status(200).json({ message: 'Lấy danh sách sự kiện thành công!', ...result });

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

    async getMyCreatedEvents(req: Request, res: Response, next: NextFunction) {
        const userId = req.user?.userId; // Lấy từ authenticateToken

        if (!userId) {
            return res.status(401).json({ message: 'Yêu cầu xác thực không thành công.' });
        }
        try {
            const events = await eventService.getEventsByCreator(userId);
            res.status(200).json({ message: 'Lấy danh sách sự kiện đã tạo thành công!', events });
        } catch (error) {
            next(error);
        }
    }

}

export default new EventController();