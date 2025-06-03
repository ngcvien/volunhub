'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      type: {
        type: Sequelize.ENUM('private', 'group'), // 'private' cho chat 1-1, 'group' cho chat nhóm
        allowNull: false,
        defaultValue: 'private' // Mặc định là chat 1-1
      },
      // Các trường như 'last_message_id' hoặc 'last_message_at' có thể thêm sau để tối ưu
      // việc hiển thị tin nhắn mới nhất mà không cần join phức tạp.
      // Tạm thời chúng ta giữ đơn giản.
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
    console.log('✅ Created table conversations');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('conversations');
    // MySQL tự xóa ENUM, PostgreSQL có thể cần:
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_conversations_type";');
    console.log('↩️ Dropped table conversations');
  }
};
