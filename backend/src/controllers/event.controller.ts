// backend/src/controllers/event.controller.ts
import { Request, Response, NextFunction } from 'express';
import eventService from '../services/event.service';
// import { validationResult } from 'express-validator';

class EventController {

    async create(req: Request, res: Response, next: NextFunction) {
        // Validation đã được xử lý bởi middleware eventValidator

        // Lấy thông tin từ request body
        const { title, description, location, eventTime } = req.body;

        // Lấy creatorId từ thông tin user đã được middleware xác thực gắn vào req
        const creatorId = req.user?.userId; // Nhớ thêm "?" để kiểm tra req.user có tồn tại không

        // Kiểm tra xem creatorId có tồn tại không (dù middleware đã kiểm tra)
        if (!creatorId) {
             // Lỗi này không nên xảy ra nếu authenticateToken hoạt động đúng
            return res.status(401).json({ message: 'Lỗi: Không tìm thấy thông tin người dùng đã xác thực.' });
        }

        try {
            const newEvent = await eventService.createEvent({
                creatorId, // Gán ID người dùng hiện tại làm người tạo
                title,
                description,
                location,
                eventTime: new Date(eventTime) // Đảm bảo eventTime là đối tượng Date
            });
            res.status(201).json({ message: 'Tạo sự kiện thành công!', event: newEvent });
        } catch (error) {
            next(error); // Chuyển lỗi cho error middleware
        }
    }

    // --- THÊM HÀM GET ALL ---
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy userId từ req.user nếu người dùng đã đăng nhập và được xác thực
            // Nếu không đăng nhập, req.user sẽ là undefined, và userId cũng vậy
            const userId = req.user?.userId;

            // Gọi service và truyền userId (có thể là undefined)
            const events = await eventService.getAllEvents(userId);

            res.status(200).json({ message: 'Lấy danh sách sự kiện thành công!', events });
        } catch (error) {
            next(error);
        }
    }

    // Thêm các hàm khác sau:  getById...
}

export default new EventController();