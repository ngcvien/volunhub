// backend/src/services/event.service.ts
import {Sequelize} from 'sequelize';
import Event, { EventAttributes } from '../models/Event.model';
import User from '../models/User.model'; // Import model User để tạo quan hệ
import Participation from '../models/Participation.model'; 
import EventLike from '../models/EventLike.model'; 


type CreateEventInput = Omit<EventAttributes, 'id' | 'createdAt' | 'updatedAt' >;

type EventWithParticipationAndCreator = EventAttributes & {
    creator?: { id: number; username: string; };
    isParticipating?: boolean;
    isLiked?: boolean;
    likeCount?: number;
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
    async getAllEvents(userId?: number): Promise<EventWithDetails[]> {
        try {
            // 1. Lấy danh sách sự kiện gốc, bao gồm creator (bỏ raw/nest)
            const events = await Event.findAll({
                order: [['createdAt', 'DESC']],
                include: [{
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'avatarUrl'] // Lấy đủ thông tin creator cần thiết
                }]
                // Không dùng raw: true ở đây để dễ làm việc với instance
            });

            // Nếu không có sự kiện nào, trả về mảng rỗng
            if (events.length === 0) {
                return [];
            }

            // Lấy danh sách ID của các sự kiện đã lấy được
            const eventIds = events.map(e => e.id);

            // 2. Lấy số lượt thích cho các sự kiện này
            const likeCounts = await EventLike.count({
                where: { eventId: eventIds }, // Đếm trong danh sách event ID này
                group: ['eventId'],          // Nhóm theo eventId để đếm riêng cho từng event
                raw: true                    // Kết quả count thường đơn giản hơn với raw
            });
            // Chuyển đổi kết quả count thành Map { eventId: count } để dễ tra cứu
            const likeCountMap = new Map<number, number>();
            likeCounts.forEach((item: any) => {
                likeCountMap.set(item.eventId, parseInt(item.count, 10) || 0);
            });

            // 3. Lấy trạng thái tham gia và thích của user hiện tại (nếu có)
            let participatingEventIds = new Set<number>();
            let likedEventIds = new Set<number>();

            if (userId) {
                // Chạy song song 2 truy vấn lấy ID sự kiện đã tham gia và đã thích
                const [userParticipations, userLikes] = await Promise.all([
                    Participation.findAll({
                        where: { userId: userId, eventId: eventIds }, // Chỉ cần check trong các event đang hiển thị
                        attributes: ['eventId'],
                        raw: true
                    }),
                    EventLike.findAll({
                        where: { userId: userId, eventId: eventIds }, // Chỉ cần check trong các event đang hiển thị
                        attributes: ['eventId'],
                        raw: true
                    })
                ]);
                participatingEventIds = new Set(userParticipations.map(p => p.eventId));
                likedEventIds = new Set(userLikes.map(like => like.eventId));
            }

            // 4. Tạo kết quả cuối cùng: duyệt qua các event instances, lấy plain object,
            //    thêm likeCount, isLiked, isParticipating
            const results: EventWithDetails[] = events.map(event => {
                const plainEvent = event.get({ plain: true }) as EventWithDetails; // Lấy object thường

                plainEvent.likeCount = likeCountMap.get(plainEvent.id) || 0; // Lấy count từ Map (mặc định 0)
                plainEvent.isLiked = likedEventIds.has(plainEvent.id);       // Kiểm tra từ Set (mặc định false nếu không đăng nhập)
                plainEvent.isParticipating = participatingEventIds.has(plainEvent.id); // Kiểm tra từ Set (mặc định false nếu không đăng nhập)

                return plainEvent;
            });

            return results;

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sự kiện:", error);
            throw new Error('Không thể lấy danh sách sự kiện vào lúc này.');
        }
    }

    // Thêm các hàm khác sau: getAllEvents, getEventById...
}

export default new EventService();