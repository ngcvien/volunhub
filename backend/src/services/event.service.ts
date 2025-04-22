// backend/src/services/event.service.ts
import Event, { EventAttributes } from '../models/Event.model';
import User from '../models/User.model'; // Import model User để tạo quan hệ
import Participation from '../models/Participation.model'; // <<<--- THÊM DÒNG NÀY


// Kiểu dữ liệu đầu vào để tạo event (loại bỏ các trường tự động)
type CreateEventInput = Omit<EventAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class EventService {

    async createEvent(eventData: CreateEventInput): Promise<Event> {
        try {
            // creatorId đã có sẵn trong eventData (sẽ được lấy từ req.user ở controller)
            const newEvent = await Event.create(eventData);
            return newEvent;
        } catch (error) {
            console.error("Lỗi khi tạo sự kiện:", error);
             // Xử lý lỗi validation từ Sequelize nếu có
            if (error instanceof Error && error.name === 'SequelizeValidationError') {
                throw new Error(`Lỗi validation: ${error.message}`);
            }
            throw new Error('Không thể tạo sự kiện vào lúc này.');
        }
    }
    async getAllEvents(userId?: number): Promise<any[]> { // Trả về any[] tạm thời hoặc định nghĩa kiểu mới
        try {
            // 1. Lấy danh sách sự kiện như cũ, bao gồm thông tin người tạo
            const events = await Event.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'username']
                    }
                ],
                raw: true, // Lấy dữ liệu dạng plain object để dễ thêm thuộc tính
                nest: true // Giúp object 'creator' được lồng đúng cách khi dùng raw:true
            });

            // 2. Nếu có userId (nghĩa là người dùng đã đăng nhập và xác thực thành công)
            if (userId) {
                // Lấy danh sách các eventId mà user này đã tham gia
                const userParticipations = await Participation.findAll({
                    where: { userId: userId },
                    attributes: ['eventId'], // Chỉ cần lấy eventId
                    raw: true
                });
                // Chuyển danh sách eventId thành một Set để tra cứu nhanh (O(1))
                const participatingEventIds = new Set(userParticipations.map(p => p.eventId));

                // 3. Duyệt qua danh sách sự kiện và thêm cờ isParticipating
                const eventsWithParticipation = events.map(event => {
                    return {
                        ...event, // Giữ lại các thuộc tính cũ của event
                        isParticipating: participatingEventIds.has(event.id) // Thêm thuộc tính mới
                    };
                });
                return eventsWithParticipation; // Trả về danh sách đã bổ sung
            }

            // Nếu không có userId, trả về danh sách sự kiện gốc
            return events;

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sự kiện:", error);
            throw new Error('Không thể lấy danh sách sự kiện vào lúc này.');
        }
    }

    // Thêm các hàm khác sau: getAllEvents, getEventById...
}

export default new EventService();