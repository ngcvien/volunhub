// backend/src/services/event.service.ts
import { Sequelize, Model, Op } from 'sequelize';
import Event, { EventAttributes } from '../models/Event.model';
import User from '../models/User.model';
import Participation from '../models/Participation.model';
import EventLike from '../models/EventLike.model';
import EventPost from '../models/EventPost.model';

interface EventWithCount extends EventAttributes {
    participantCount: number;
}
export enum EventStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    ABSENT = 'absent'
}
interface GetAllEventsOptions {
    userId?: number;         // ID người dùng đang đăng nhập (để check like/join)
    query?: string;          // Từ khóa tìm kiếm
    page?: number;           // Trang hiện tại (cho phân trang)
    limit?: number;          // Số lượng kết quả mỗi trang
    status?: EventStatus;
    // provinceCode?: number;
}

type EventWithDetails = EventAttributes & {
    creator: { id: number; username: string; avatarUrl?: string | null };
    isParticipating: boolean;
    isLiked: boolean;
    likeCount: number;
};

interface PaginatedEventsResult {
    events: EventWithDetails[]; t
    totalPages: number;
    currentPage: number;
    totalEvents: number;
}

type CreateEventInput = Omit<EventAttributes, 'id' | 'createdAt' | 'updatedAt' | 'status'>; // Chỉ định các thuộc tính cần thiết khi tạo mới

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
    async getAllEvents(options: GetAllEventsOptions): Promise<PaginatedEventsResult> {
        const { userId, query, page = 1, limit = 10 } = options; // Giá trị mặc định cho phân trang
        const offset = (page - 1) * limit; // Tính offset

        // Xây dựng mệnh đề WHERE dựa trên query và các filter khác
        const whereClause: any = {}; // Bắt đầu với object rỗng
        if (query) {
            // Tìm kiếm query trong title hoặc description
            // Dùng Op.like không phân biệt hoa thường (mặc định trong MySQL thường là vậy)
            whereClause[Op.or] = [
                { title: { [Op.like]: `%${query}%` } },
                { description: { [Op.like]: `%${query}%` } }
                // Có thể thêm tìm kiếm location ở đây nếu location là text
                // { location: { [Op.like]: `%${query}%` } }
            ];
        }
        // Thêm các điều kiện lọc khác vào whereClause nếu có (ví dụ: status, provinceCode...)
        if (options.status) {
            whereClause.status = options.status;
        }
        // if (options.provinceCode) {
        //     whereClause.provinceCode = options.provinceCode; // Giả sử có cột provinceCode
        // }


        try {
            // 1. Dùng findAndCountAll để lấy cả dữ liệu và tổng số bản ghi (cho phân trang)
            const { count, rows } = await Event.findAndCountAll({
                where: whereClause, // Áp dụng điều kiện lọc/tìm kiếm
                include: [{ // Vẫn include người tạo
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'avatarUrl', 'fullName']
                }],
                order: [['createdAt', 'DESC']], // Sắp xếp
                limit: limit, // Giới hạn số lượng
                offset: offset, // Bỏ qua bao nhiêu bản ghi
                distinct: true // Quan trọng khi có include và limit/offset
            });

            const events = rows; // rows chứa danh sách sự kiện của trang hiện tại
            const totalEvents = count; // count là tổng số sự kiện khớp điều kiện (chưa phân trang)
            const totalPages = Math.ceil(totalEvents / limit); // Tính tổng số trang

            // Nếu không có sự kiện nào khớp, trả về kết quả rỗng
            if (events.length === 0) {
                return { events: [], totalPages: 0, currentPage: 1, totalEvents: 0 };
            }

            // 2. Lấy thông tin Like Count, isLiked, isParticipating cho các sự kiện trên trang hiện tại
            const eventIds = events.map(e => e.id);
            let participatingEventIds = new Set<number>();
            let likedEventIds = new Set<number>();

            // Lấy count và trạng thái chỉ khi có events để query
            const likeCounts = await EventLike.count({ where: { eventId: eventIds }, group: ['eventId'], raw: true });
            const likeCountMap = new Map<number, number>();
            likeCounts.forEach((item: any) => { likeCountMap.set(item.eventId, parseInt(item.count, 10) || 0); });

            if (userId) {
                const [userParticipations, userLikes] = await Promise.all([
                    Participation.findAll({ where: { userId: userId, eventId: eventIds }, attributes: ['eventId'], raw: true }),
                    EventLike.findAll({ where: { userId: userId, eventId: eventIds }, attributes: ['eventId'], raw: true })
                ]);
                participatingEventIds = new Set(userParticipations.map(p => p.eventId));
                likedEventIds = new Set(userLikes.map(like => like.eventId));
            }

            // 3. Map kết quả cuối cùng
            const results: EventWithDetails[] = events.map(event => {
                const plainEvent = event.get({ plain: true }) as EventWithDetails;
                plainEvent.likeCount = likeCountMap.get(plainEvent.id) || 0;
                plainEvent.isLiked = likedEventIds.has(plainEvent.id);
                plainEvent.isParticipating = participatingEventIds.has(plainEvent.id);
                return plainEvent;
            });

            // 4. Trả về kết quả đã phân trang
            return {
                events: results,
                totalPages: totalPages,
                currentPage: page,
                totalEvents: totalEvents
            };

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sự kiện (có tìm kiếm/phân trang):", error);
            throw new Error('Không thể lấy danh sách sự kiện vào lúc này.');
        }
    }
    async getEventById(eventId: number, userId?: number): Promise<any | null> { // Nên tạo Type cụ thể sau
        try {
            const event = await Event.findByPk(eventId, {
                include: [
                    { // Lấy thông tin người tạo
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'username', 'fullName', 'avatarUrl'] // Lấy các trường cần thiết
                    },
                    { // Lấy danh sách người tham gia
                        model: User,
                        as: 'participants', // Dùng alias đã định nghĩa trong association
                        attributes: ['id', 'username', 'avatarUrl'], // Chỉ lấy thông tin công khai cần thiết
                        through: { attributes: [] } // Không cần lấy thông tin từ bảng nối (Participation)
                    },
                    {
                        model: EventPost,
                        as: 'posts', // Alias đã định nghĩa trong association
                        attributes: ['id', 'content', 'createdAt', 'userId', 'imageUrl'], // Lấy các trường cần thiết của post
                        limit: 10, // Giới hạn số lượng bài viết lấy kèm (ví dụ: 10 bài mới nhất)
                        order: [['createdAt', 'DESC']],
                        include: [{ // Lấy kèm thông tin người đăng bài viết
                            model: User,
                            as: 'author',
                            attributes: ['id', 'username', 'avatarUrl']
                        }]
                    }
                    // Có thể include thêm EventLike (as 'likers') nếu muốn lấy danh sách người like
                ]
                // Không dùng raw: true ở đây để giữ cấu trúc object với association
            });

            if (!event) {
                return null; // Trả về null nếu không tìm thấy
            }

            // Chuyển sang plain object để xử lý tiếp
            const plainEvent = event.get({ plain: true });

            plainEvent.isLiked = false;
            plainEvent.isParticipating = false;
            plainEvent.likeCount = await EventLike.count({ where: { eventId: eventId } }); // Đếm tổng số like

            if (userId) {
                const [userLike, userParticipation] = await Promise.all([
                    EventLike.findOne({ where: { userId, eventId } }),
                    Participation.findOne({ where: { userId, eventId } })
                ]);
                plainEvent.isLiked = !!userLike; // true nếu tìm thấy like
                plainEvent.isParticipating = !!userParticipation; // true nếu tìm thấy participation
            }

            plainEvent.participants = plainEvent.participants || [];

            return plainEvent;

        } catch (error) {
            console.error(`Lỗi khi lấy chi tiết sự kiện ${eventId}:`, error);
            throw new Error('Không thể lấy thông tin chi tiết sự kiện.');
        }
    }

    /**
     * Lấy danh sách sự kiện được tạo bởi một người dùng cụ thể, kèm số người tham gia
     * @param creatorId ID của người tạo
     */
    async getEventsByCreator(creatorId: number): Promise<EventWithCount[]> {
        try {
            const events = await Event.findAll({
                where: { creatorId: creatorId },
                attributes: [
                    // Lấy tất cả các thuộc tính của Event model
                    ...Object.keys(Event.getAttributes()),
                    // Thêm thuộc tính ảo 'participantCount' bằng cách đếm trong bảng Participation
                    [
                        Sequelize.fn('COUNT', Sequelize.col('participants.id')), // Đếm ID user tham gia
                        'participantCount'
                    ]
                ],
                include: [
                    // Include bảng nối Participation và User (nhưng không lấy attributes của User ở đây)
                    // để có thể COUNT và GROUP BY
                    {
                        model: User,
                        as: 'participants', // Dùng alias đã định nghĩa
                        attributes: [], // Không cần lấy trường nào từ User ở đây
                        through: { attributes: [] } // Không cần lấy trường nào từ bảng nối
                    }
                    // Lưu ý: Không include 'creator' ở đây để tránh group by phức tạp,
                    // thông tin creator đã biết là người đang request.
                ],
                group: ['Event.id'], // Group theo ID của Event để COUNT hoạt động đúng cho mỗi event
                order: [['eventTime', 'DESC']],
                // SubQuery=false có thể cần thiết tùy phiên bản Sequelize/MySQL để tránh lỗi group by
                // subQuery: false
            });

            // Do COUNT trả về kiểu string trong một số trường hợp, cần parse lại
            const eventsWithParsedCount = events.map(event => {
                const plainEvent = event.get({ plain: true }) as any; // Lấy plain object
                plainEvent.participantCount = parseInt(plainEvent.participantCount || '0', 10);
                return plainEvent as EventWithCount;
            });

            return eventsWithParsedCount;

        } catch (error) {
            console.error(`Lỗi khi lấy sự kiện cho creator ${creatorId}:`, error);
            throw new Error('Không thể lấy danh sách sự kiện đã tạo.');
        }
    }

    // Thêm các hàm khác sau: getAllEvents, getEventById...
}

export default new EventService();