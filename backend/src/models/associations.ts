// backend/src/models/associations.ts
import User from './User.model';
import Event from './Event.model';
import Participation from './Participation.model';
import EventLike from './EventLike.model';
import EventPost from './EventPost.model';
import EventPostComment from './EventPostComment.model'; 

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

        User.belongsToMany(Event, {
            through: EventLike,         // Qua bảng EventLike
            foreignKey: 'userId',       // Khóa trong EventLike trỏ về User
            otherKey: 'eventId',        // Khóa trong EventLike trỏ về Event
            as: 'likedEvents',        // Lấy các Event đã like bởi User
            timestamps: false         // Không cần timestamps trong bảng nối khi định nghĩa qhệ
        });
        Event.belongsToMany(User, {
            through: EventLike,         // Qua bảng EventLike
            foreignKey: 'eventId',      // Khóa trong EventLike trỏ về Event
            otherKey: 'userId',         // Khóa trong EventLike trỏ về User
            as: 'likers',             // Lấy các User đã like Event
            timestamps: false
        });
        // Một Bài viết thuộc về một Sự kiện
        EventPost.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });
        Event.hasMany(EventPost, { foreignKey: 'eventId', as: 'posts' });

        // Một Bài viết thuộc về một Người dùng (tác giả)
        EventPost.belongsTo(User, { foreignKey: 'userId', as: 'author' });
        User.hasMany(EventPost, { foreignKey: 'userId', as: 'eventPosts' });

        // Một Comment thuộc về một Post
        EventPostComment.belongsTo(EventPost, { foreignKey: 'postId', as: 'post' });
        EventPost.hasMany(EventPostComment, { foreignKey: 'postId', as: 'comments' });

        // Một Comment thuộc về một User (tác giả)
        EventPostComment.belongsTo(User, { foreignKey: 'userId', as: 'author' });
        User.hasMany(EventPostComment, { foreignKey: 'userId', as: 'eventPostComments' });

        // Quan hệ tự tham chiếu cho comment trả lời (nested/threaded)
        // Một Comment có thể có nhiều Replies (là các Comment khác)
        EventPostComment.hasMany(EventPostComment, {
            foreignKey: 'parentId', // Cột trong bảng trỏ về comment cha
            as: 'replies',        // Lấy các comment con
            constraints: false    // Tắt ràng buộc tự động để tránh lỗi circular FK nếu có
        });
        // Một Comment (reply) thuộc về một Comment cha
        EventPostComment.belongsTo(EventPostComment, {
            foreignKey: 'parentId', // Cột trong bảng trỏ về comment cha
            as: 'parentComment',  // Lấy comment cha
            constraints: false
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