// backend/src/services/event.service.ts
import Event, { EventAttributes } from '../models/Event.model';
import User from '../models/User.model'; // Import model User để tạo quan hệ
import Participation from '../models/Participation.model'; // <<<--- THÊM DÒNG NÀY


type CreateEventInput = Omit<EventAttributes, 'id' | 'createdAt' | 'updatedAt' >;

type EventWithParticipationAndCreator = EventAttributes & {
    isParticipating?: boolean;
    creator?: { id: number; username: string; };
};
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
    async getAllEvents(userId?: number) {
        const events = await Event.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'avatarUrl']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    
        let participatingEventIds: Set<number> = new Set();
        if (userId) {
            const participations = await Participation.findAll({
                where: { userId },
                attributes: ['eventId'],
                raw: true
            });
            participatingEventIds = new Set(participations.map(p => p.eventId));
        }
    
        return events.map(event => {
            const plain = event.get({ plain: true });
            return {
                ...plain,
                isParticipating: participatingEventIds.has(plain.id)
            };
        });
    }

    // Thêm các hàm khác sau: getAllEvents, getEventById...
}

export default new EventService();