'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversation_participants', {
      conversation_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true, // Phần của Khóa chính kết hợp
        references: {
          model: 'conversations', // Tên bảng 'conversations' đã tạo ở bước trước
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu cuộc trò chuyện bị xóa, các bản ghi tham gia cũng bị xóa
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true, // Phần của Khóa chính kết hợp
        references: {
          model: 'users', // Tên bảng 'users'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu người dùng bị xóa, các bản ghi tham gia của họ cũng bị xóa
      },
      // Các trường khác có thể thêm sau này nếu cần cho chức năng nâng cao, ví dụ:
      // last_read_message_id: Sequelize.INTEGER.UNSIGNED,
      // unread_count: { type: Sequelize.INTEGER.UNSIGNED, defaultValue: 0 },
      // nickname_in_conversation: Sequelize.STRING,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    // Sequelize tự động hiểu primaryKey: true trên nhiều cột là composite primary key.
    // Không cần addConstraint riêng cho PK ở đây.
    // Thêm index nếu cần cho các truy vấn cụ thể không dùng PK, ví dụ:
    // await queryInterface.addIndex('conversation_participants', ['user_id']);
    console.log('✅ Created table conversation_participants');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversation_participants');
    console.log('↩️ Dropped table conversation_participants');
  }
};