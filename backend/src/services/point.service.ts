// backend/src/services/point.service.ts
import User from '../models/User.model';
import VolunpointLog from '../models/VolunpointLog.model'; // Import nếu dùng log
import { sequelize } from '../config/database.config'; // Import sequelize để dùng transaction
import { Transaction } from 'sequelize'; // Import Transaction type

class PointService {

    /**
     * Cộng điểm VolunPoint cho người dùng và ghi log (nếu có)
     * @param userId ID người dùng nhận điểm
     * @param pointsToAward Số điểm cộng (nên là số dương)
     * @param reason Lý do cộng điểm
     * @param eventId ID sự kiện liên quan (nếu có)
     * @param transaction Transaction đang chạy (quan trọng để đảm bảo tính nguyên tử)
     */
    async awardPoints(
        userId: number,
        pointsToAward: number,
        reason: string | null = null,
        eventId: number | null = null,
        transaction?: Transaction // Nhận transaction từ service gọi nó
    ): Promise<void> {
        if (pointsToAward <= 0) {
            console.warn(`Attempted to award non-positive points (${pointsToAward}) to user ${userId}`);
            return; // Không cộng điểm âm hoặc 0 ở đây
        }

        try {
            // 1. Cộng điểm cho User sử dụng increment để tránh race condition
            await User.increment(
                { volunpoints: pointsToAward },
                { where: { id: userId }, transaction } // Thực hiện trong transaction
            );

            // 2. Ghi log giao dịch điểm (nếu có bảng log)
            if (VolunpointLog) {
                await VolunpointLog.create(
                    {
                        userId,
                        eventId,
                        pointsAwarded,
                        reason
                    },
                    { transaction } // Thực hiện trong transaction
                );
            }
            console.log(`Awarded ${pointsToAward} points to user ${userId} for event ${eventId || 'N/A'}`);

        } catch (error) {
            console.error(`Lỗi khi cộng ${pointsToAward} điểm cho user ${userId}:`, error);
            // Ném lại lỗi để transaction bên ngoài có thể rollback
            throw new Error('Lỗi trong quá trình cộng điểm.');
        }
    }
}

export default new PointService();