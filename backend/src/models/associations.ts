// backend/src/models/associations.ts
import User from './User.model';
import Event from './Event.model';
import Participation from './Participation.model';

const setupAssociations = () => {
    console.log('Setting up database associations...'); // Thêm log để kiểm tra

    try {
        // --- User <-> Event (Quan hệ Người tạo - Sự kiện) ---
        // Một User có thể tạo nhiều Event
        User.hasMany(Event, {
            foreignKey: 'creatorId', // Khóa ngoại trong Event model trỏ về User
            sourceKey: 'id',       // Khóa chính trong User model
            as: 'createdEvents'    // Định danh khi lấy các event do user tạo
        });
        // Một Event thuộc về một User (người tạo)
        Event.belongsTo(User, {
            foreignKey: 'creatorId', // Khóa ngoại trong Event model
            targetKey: 'id',       // Khóa chính trong User model
            as: 'creator'          // Định danh khi lấy thông tin người tạo từ Event
        });

        // --- User <-> Event (Quan hệ Tham gia - Thông qua Participation) ---
        // Một User có thể tham gia nhiều Event
        User.belongsToMany(Event, {
            through: Participation,     // Thông qua model trung gian Participation
            foreignKey: 'userId',       // Tên cột trong Participation trỏ về User
            otherKey: 'eventId',        // Tên cột trong Participation trỏ về Event
            as: 'participatingEvents' // Định danh khi lấy các event user tham gia
        });
        // Một Event có nhiều User tham gia (participants)
        Event.belongsToMany(User, {
            through: Participation,     // Thông qua model trung gian Participation
            foreignKey: 'eventId',      // Tên cột trong Participation trỏ về Event
            otherKey: 'userId',         // Tên cột trong Participation trỏ về User
            as: 'participants'        // Định danh khi lấy danh sách người tham gia từ Event
        });

        // --- (Tùy chọn) Định nghĩa quan hệ rõ ràng cho bảng nối Participation ---
        // Điều này hữu ích nếu bạn muốn truy vấn trực tiếp bảng Participation
        // Hoặc muốn Sequelize tự động thêm các ràng buộc khóa ngoại nếu chưa có
        // Participation.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
        // Participation.belongsTo(Event, { foreignKey: 'eventId', targetKey: 'id' });
        // User.hasMany(Participation, { foreignKey: 'userId', sourceKey: 'id' });
        // Event.hasMany(Participation, { foreignKey: 'eventId', sourceKey: 'id' });

        console.log('✅ Database associations set up successfully.');

    } catch (error) {
        console.error('❌ Error setting up database associations:', error);
    }
};

export default setupAssociations;