// backend/src/services/like.service.ts
import EventLike from '../models/EventLike.model';
import Event from '../models/Event.model';

class LikeService {

    async likeEvent(userId: number, eventId: number): Promise<EventLike> {
        // 1. Kiểm tra sự kiện có tồn tại không
        const event = await Event.findByPk(eventId);
        if (!event) {
            throw Object.assign(new Error('Sự kiện không tồn tại.'), { statusCode: 404 });
        }

        // 2. Thử tìm hoặc tạo mới bản ghi like
        // findOrCreate trả về [instance, created]
        // created là true nếu bản ghi mới được tạo, false nếu đã tồn tại
        const [like, created] = await EventLike.findOrCreate({
            where: { userId, eventId },
            defaults: { userId, eventId } // Dữ liệu để tạo nếu chưa có
        });

        if (!created) {
            // Nếu không phải mới tạo -> nghĩa là đã like rồi
            throw Object.assign(new Error('Bạn đã thích sự kiện này rồi.'), { statusCode: 409 }); // 409 Conflict
        }

        return like; // Trả về bản ghi like vừa tạo
    }

    async unlikeEvent(userId: number, eventId: number): Promise<void> {
         // 1. Kiểm tra sự kiện có tồn tại không (tùy chọn, nhưng nên có)
         const event = await Event.findByPk(eventId);
         if (!event) {
             throw Object.assign(new Error('Sự kiện không tồn tại.'), { statusCode: 404 });
         }

        // 2. Tìm bản ghi like
        const like = await EventLike.findOne({
            where: { userId, eventId }
        });

        if (!like) {
            // Nếu không tìm thấy -> user chưa like sự kiện này
            throw Object.assign(new Error('Bạn chưa thích sự kiện này.'), { statusCode: 404 }); // 404 Not Found
        }

        // 3. Xóa bản ghi like
        await like.destroy();
    }
}

export default new LikeService();