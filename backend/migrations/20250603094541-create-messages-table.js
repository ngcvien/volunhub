'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      conversation_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'conversations', // Tên bảng 'conversations'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu cuộc trò chuyện bị xóa, tất cả tin nhắn cũng bị xóa
      },
      sender_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users', // Tên bảng 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu người gửi bị xóa, tin nhắn của họ cũng bị xóa (Cân nhắc SET NULL nếu muốn giữ tin nhắn ẩn danh)
      },
      content: { // Nội dung tin nhắn dạng text
        type: Sequelize.TEXT,
        allowNull: false // Sẽ là TRUE nếu cho phép gửi chỉ ảnh/video
      },
      message_type: { // Để sau này mở rộng gửi ảnh/video
        type: Sequelize.ENUM('text', 'image', 'video'),
        allowNull: false,
        defaultValue: 'text'
      },
      media_url: { // URL của ảnh/video nếu message_type không phải là 'text'
        type: Sequelize.STRING(1024), // Cho phép URL dài
        allowNull: true
      },
      // Các trường như 'read_at' (để đánh dấu đã đọc) có thể thêm sau
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: { // Có thể không cần thiết cho tin nhắn, nhưng cứ để cho nhất quán
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Thêm index để tối ưu việc lấy tin nhắn trong một cuộc trò chuyện và sắp xếp theo thời gian
    await queryInterface.addIndex('messages', ['conversation_id', 'created_at']);
    // Thêm index cho sender_id nếu thường xuyên tìm tin nhắn theo người gửi
    await queryInterface.addIndex('messages', ['sender_id']);

    console.log('✅ Created table messages and its indexes');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
    // MySQL tự xóa ENUM, PostgreSQL có thể cần:
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_messages_message_type";');
    console.log('↩️ Dropped table messages');
  }
};