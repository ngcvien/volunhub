// backend/src/services/event.service.ts
import Event, { EventAttributes } from '../models/Event.model';

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

    // Thêm các hàm khác sau: getAllEvents, getEventById...
}

export default new EventService();