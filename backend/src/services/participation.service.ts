// backend/src/services/participation.service.ts
import Participation from '../models/Participation.model';
import Event from '../models/Event.model'; // Import Event để kiểm tra sự kiện tồn tại
import User from '../models/User.model'; // Import User (có thể cần sau này)
import { sequelize } from './database.service'; // Import sequelize nếu cần transaction

class ParticipationService {

    /**
     * Cho phép người dùng tham gia một sự kiện
     * @param userId ID của người dùng
     * @param eventId ID của sự kiện
     */
    async joinEvent(userId: number, eventId: number): Promise<Participation> {
        // Bắt đầu một transaction (tùy chọn nhưng tốt để đảm bảo toàn vẹn)
        // const t = await sequelize.transaction();
        try {
            // 1. Kiểm tra sự kiện có tồn tại không
            const event = await Event.findByPk(eventId/* , { transaction: t } */);
            if (!event) {
                throw new Error('Sự kiện không tồn tại.');
            }

            // 2. Kiểm tra xem người dùng đã tham gia sự kiện này chưa
            const existingParticipation = await Participation.findOne({
                where: { userId, eventId },
                // transaction: t
            });

            if (existingParticipation) {
                throw new Error('Bạn đã tham gia sự kiện này rồi.');
            }

            // 3. Tạo bản ghi mới trong bảng Participation
            const newParticipation = await Participation.create(
                { userId, eventId }
                /* ,{ transaction: t } */
            );

            // Nếu dùng transaction, commit ở đây
            // await t.commit();

            return newParticipation;

        } catch (error: any) {
            // Nếu dùng transaction, rollback ở đây
            // await t.rollback();

            console.error("Lỗi khi tham gia sự kiện:", error);
            // Ném lại lỗi để controller xử lý, có thể giữ nguyên message lỗi cũ
            throw new Error(error.message || 'Không thể tham gia sự kiện vào lúc này.');
        }
    }

    /**
     * Cho phép người dùng rời khỏi một sự kiện đã tham gia
     * @param userId ID của người dùng
     * @param eventId ID của sự kiện
     */
    async leaveEvent(userId: number, eventId: number): Promise<void> { // Không cần trả về gì nhiều, chỉ cần báo thành công
        // const t = await sequelize.transaction(); // Có thể dùng transaction
        try {
            // 1. Kiểm tra xem người dùng có thực sự đang tham gia sự kiện này không
            const participation = await Participation.findOne({
                where: { userId, eventId },
                // transaction: t
            });

            if (!participation) {
                throw new Error('Bạn chưa tham gia sự kiện này.');
            }

            // 2. Xóa bản ghi tham gia
            await participation.destroy(/* { transaction: t } */);

            // await t.commit(); // Commit transaction

        } catch (error: any) {
            // await t.rollback(); // Rollback transaction

            console.error("Lỗi khi rời sự kiện:", error);
            throw new Error(error.message || 'Không thể rời khỏi sự kiện vào lúc này.');
        }
    }

    // Có thể thêm các hàm khác: lấy danh sách sự kiện user tham gia, lấy danh sách user tham gia event...
}

export default new ParticipationService();