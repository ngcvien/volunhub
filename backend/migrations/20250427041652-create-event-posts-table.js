'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_posts', { // Tên bảng
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      event_id: { // Khóa ngoại đến events
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'events', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa bài viết nếu sự kiện bị xóa
      },
      user_id: { // Khóa ngoại đến users (người đăng bài)
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa bài viết nếu người dùng bị xóa
      },
      content: { // Nội dung bài viết
        type: Sequelize.TEXT,
        allowNull: false
      },
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
    // Thêm index để tăng tốc truy vấn bài viết theo sự kiện
    await queryInterface.addIndex('event_posts', ['event_id', 'created_at']);
    console.log('✅ Created table event_posts with index');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event_posts');
    console.log('↩️ Dropped table event_posts');
  }
};