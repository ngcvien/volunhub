// backend/src/controllers/participation.controller.ts
import { Request, Response, NextFunction } from 'express';
import participationService from '../services/participation.service';

class ParticipationController {

    async join(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy userId từ middleware xác thực
            const userId = req.user?.userId;
            // Lấy eventId từ URL params
            const eventId = parseInt(req.params.eventId, 10); // Chuyển string thành number

            // Kiểm tra dữ liệu đầu vào cơ bản
            if (!userId) {
                 // Lỗi này không nên xảy ra nếu authenticateToken hoạt động đúng
                return res.status(401).json({ message: 'Lỗi: Yêu cầu xác thực không thành công.' });
            }
            if (isNaN(eventId)) {
                return res.status(400).json({ message: 'Event ID không hợp lệ.' });
            }

            // Gọi service để xử lý logic
            const participation = await participationService.joinEvent(userId, eventId);

            res.status(201).json({ message: 'Tham gia sự kiện thành công!', participation });

        } catch (error) {
            // Chuyển lỗi cho error middleware
            next(error);
        }
    }

    async leave(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;
            const eventId = parseInt(req.params.eventId, 10);

            if (!userId) {
                return res.status(401).json({ message: 'Lỗi: Yêu cầu xác thực không thành công.' });
            }
            if (isNaN(eventId)) {
                return res.status(400).json({ message: 'Event ID không hợp lệ.' });
            }

            // Gọi service để xử lý logic
            await participationService.leaveEvent(userId, eventId);

            // Trả về 200 OK hoặc 204 No Content đều được
            res.status(200).json({ message: 'Rời khỏi sự kiện thành công!' });

        } catch (error) {
            next(error);
        }
    }

    async confirmParticipant(req: Request, res: Response, next: NextFunction) {
        try {
            const eventId = parseInt(req.params.eventId, 10);
            const participantUserId = parseInt(req.params.participantUserId, 10); // Lấy ID TNV từ params
            const requestingUserId = req.user?.userId; // Lấy ID người yêu cầu (creator) từ token

            if (!requestingUserId) return res.status(401).json({ message: 'Yêu cầu xác thực.' });
            if (isNaN(eventId)) return res.status(400).json({ message: 'Event ID không hợp lệ.' });
            if (isNaN(participantUserId)) return res.status(400).json({ message: 'Participant User ID không hợp lệ.' });

            // Gọi service để xử lý
            await participationService.confirmParticipantCompletion(eventId, participantUserId, requestingUserId);

            res.status(200).json({ message: 'Xác nhận tình nguyện viên hoàn thành thành công!' });

        } catch (error) {
            next(error); // Chuyển lỗi cho middleware
        }
    }
}

export default new ParticipationController();