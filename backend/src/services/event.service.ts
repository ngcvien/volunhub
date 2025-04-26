// backend/src/services/event.service.ts
import Event, { EventAttributes } from '../models/Event.model';
import User from '../models/User.model'; // Import model User để tạo quan hệ
import Participation from '../models/Participation.model'; 
import EventLike from '../models/EventLike.model'; 


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
    async getAllEvents(userId?: number): Promise<any[]> {
        try {
            const events = await Event.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    { model: User, as: 'creator', attributes: ['id', 'username', 'avatarUrl'] }
                ],
                raw: true,
                nest: true
            });

            if (!userId) {
                // Nếu không đăng nhập, trả về kèm isParticipating/isLiked là false
                return events.map(event => ({ ...event, isParticipating: false, isLiked: false }));
            }

            // Nếu đã đăng nhập, lấy thông tin tham gia và thích
            const userParticipations = await Participation.findAll({
                where: { userId: userId },
                attributes: ['eventId'],
                raw: true
            });
            const participatingEventIds = new Set(userParticipations.map(p => p.eventId));

            // <<<--- THÊM LOGIC LẤY LIKE --- >>>
            const userLikes = await EventLike.findAll({
                where: { userId: userId },
                attributes: ['eventId'],
                raw: true
            });
            const likedEventIds = new Set(userLikes.map(like => like.eventId));
            // <<<--- KẾT THÚC LẤY LIKE --- >>>


            // Duyệt qua sự kiện và thêm cả hai cờ
            const eventsWithStatus = events.map(event => {
                return {
                    ...event,
                    isParticipating: participatingEventIds.has(event.id),
                    isLiked: likedEventIds.has(event.id) // <<<--- THÊM isLiked
                };
            });

            return eventsWithStatus;

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sự kiện:", error);
            throw new Error('Không thể tải danh sách sự kiện vào lúc này.');
        }
    }

    // Thêm các hàm khác sau: getAllEvents, getEventById...
}

export default new EventService();