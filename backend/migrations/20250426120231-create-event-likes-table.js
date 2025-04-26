// backend/migrations/YYYYMMDDHHMMSS-create-event-likes-table.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_likes', { // Tên bảng snake_case
      user_id: { // Khóa ngoại trỏ đến users
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true, // Phần của khóa chính kết hợp
        references: {
          model: 'users', // Tên bảng users
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu user bị xóa, lượt thích của họ cũng mất
      },
      event_id: { // Khóa ngoại trỏ đến events
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true, // Phần của khóa chính kết hợp
        references: {
          model: 'events', // Tên bảng events
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Nếu event bị xóa, lượt thích cũng mất
      },
      created_at: { // Timestamp
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
      // Bảng này không cần updatedAt
    });
    console.log('✅ Created table event_likes');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event_likes');
    console.log('↩️ Dropped table event_likes');
  }
};