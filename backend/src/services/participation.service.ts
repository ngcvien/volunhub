// backend/src/services/participation.service.ts
import Participation, {ParticipationAttributes} from '../models/Participation.model';
import Event from '../models/Event.model'; 
import User from '../models/User.model'; 
import pointService from './point.service';
import {CompletionStatus} from '../models/Participation.model'; 
import { sequelize } from './database.service'; 

enum CompletionStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    ABSENT = 'absent'
}
interface ParticipantDetailBE {
    userId: number;
    eventId: number;
    completionStatus: CompletionStatus;
    createdAt: Date; 
    user: {
        id: number;
        username: string;
        avatarUrl: string | null;
        fullName: string | null;
    };
}
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

    /**
     * Người tổ chức xác nhận tình nguyện viên đã hoàn thành sự kiện
     * @param eventId ID sự kiện
     * @param participantUserId ID của tình nguyện viên được xác nhận
     * @param requestingUserId ID của người thực hiện yêu cầu (phải là creator)
     */
    async confirmParticipantCompletion(eventId: number, participantUserId: number, requestingUserId: number): Promise<Participation> {
        const transaction = await sequelize.transaction(); // Bắt đầu transaction
        try {
            // 1. Lấy thông tin sự kiện VÀ người tạo sự kiện
            const event = await Event.findByPk(eventId, {
                include: [{ model: User, as: 'creator', attributes: ['id', 'isVerified'] }], // Lấy trạng thái verified của creator
                transaction
            });

            if (!event) {
                throw Object.assign(new Error('Sự kiện không tồn tại.'), { statusCode: 404 });
            }

            // 2. Kiểm tra quyền: Chỉ người tạo sự kiện mới được xác nhận
            if (event.creatorId !== requestingUserId) {
                throw Object.assign(new Error('Forbidden: Bạn không phải người tổ chức sự kiện này.'), { statusCode: 403 });
            }

            // 3. QUAN TRỌNG: Kiểm tra người tạo đã được xác minh (Verified) chưa
            if (!event.creator?.isVerified) { // Dùng optional chaining
                throw Object.assign(new Error('Forbidden: Chỉ người tổ chức đã được xác minh mới có thể xác nhận điểm.'), { statusCode: 403 });
            }

            // 4. (Tùy chọn) Kiểm tra trạng thái sự kiện: Chỉ xác nhận khi sự kiện đã hoàn thành?
            // if (event.status !== EventStatus.COMPLETED) {
            //     throw Object.assign(new Error('Chỉ có thể xác nhận sau khi sự kiện đã hoàn thành.'), { statusCode: 400 });
            // }

            // 5. Tìm bản ghi participation cụ thể
            const participation = await Participation.findOne({
                where: { eventId: eventId, userId: participantUserId },
                transaction
            });

            if (!participation) {
                throw Object.assign(new Error('Tình nguyện viên này không tham gia sự kiện.'), { statusCode: 404 });
            }

            // 6. Kiểm tra xem đã xác nhận trước đó chưa
            // Giả sử bạn đã thêm cột completion_status vào bảng event_participants
            // và vào model Participation.model.ts
            // if (participation.completionStatus === CompletionStatus.CONFIRMED) {
            //     throw Object.assign(new Error('Tình nguyện viên này đã được xác nhận trước đó.'), { statusCode: 409 }); // 409 Conflict
            // }

            // 7. Cập nhật trạng thái hoàn thành (Ví dụ: dùng cột completion_status)
            await participation.update({ completionStatus: CompletionStatus.CONFIRMED }, { transaction });
            // ---- HOẶC nếu chưa có cột status, bạn có thể trigger logic cộng điểm ngay ----

            // 8. Placeholder: Trigger logic cộng điểm VolunPoint
            // Sau này sẽ gọi PointService ở đây
            console.log(`POINTS_AWARDED: User ${participantUserId} completed Event ${eventId}. Confirmed by verified creator ${requestingUserId}.`);
            // await PointService.awardPointsForParticipation(participantUserId, eventId, transaction);
            const POINTS_PER_EVENT = 10;
            await pointService.awardPoints(
                participantUserId,
                POINTS_PER_EVENT,
                `Hoàn thành sự kiện: ${event.title}`, // Lý do
                eventId,
                transaction 
            );

            await transaction.commit(); // Commit transaction nếu mọi thứ thành công

            // Trả về bản ghi participation đã cập nhật (nếu có update status)
            // Hoặc chỉ cần trả về thành công
            return participation; // Hoặc return một object báo thành công

        } catch (error: any) {
            await transaction.rollback(); // Rollback transaction nếu có lỗi
            console.error("Lỗi khi xác nhận TNV hoàn thành:", error);
            // Ném lại lỗi để controller xử lý (giữ nguyên statusCode nếu có)
            if (error.statusCode) throw error;
            throw new Error('Không thể xác nhận hoàn thành cho tình nguyện viên.');
        }
    }

    /**
     * Lấy danh sách người tham gia chi tiết của một sự kiện để quản lý
     * @param eventId ID sự kiện
     * @param requestingUserId ID của người yêu cầu (phải là người tạo sự kiện)
     * @returns Danh sách chi tiết người tham gia
     */
    async getParticipantsForEventManagement(eventId: number, requestingUserId: number): Promise<ParticipantDetailBE[]> {
        try {
            // 1. Kiểm tra sự kiện tồn tại và người yêu cầu có phải là người tạo không
            const event = await Event.findByPk(eventId);
            if (!event) {
                throw Object.assign(new Error('Sự kiện không tồn tại.'), { statusCode: 404 });
            }
            if (event.creatorId !== requestingUserId) {
                 throw Object.assign(new Error('Forbidden: Bạn không có quyền quản lý người tham gia sự kiện này.'), { statusCode: 403 });
            }

            // 2. Lấy danh sách participation kèm thông tin user
            const participations = await Participation.findAll({
                where: { eventId: eventId },
                include: [
                    {
                        model: User,
                        as: 'user', // Dùng association đã định nghĩa ở associations.ts
                        attributes: ['id', 'username', 'avatarUrl', 'fullName'] // Lấy các trường cần thiết của User
                    }
                ],
                order: [['createdAt', 'ASC']] // Sắp xếp theo thời gian tham gia
            });

            // Map lại dữ liệu nếu cần để đúng định dạng ParticipantDetailBE
             return participations.map(p => p.get({ plain: true })) as ParticipantDetailBE[];
             // Lưu ý: Cần đảm bảo association 'user' được định nghĩa trong associations.ts
             // cho model Participation: Participation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

        } catch (error: any) {
            console.error(`Lỗi khi lấy participants cho event ${eventId}:`, error);
            throw new Error('Không thể lấy danh sách người tham gia.');
        }
    }

}

export default new ParticipationService();