'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('volunpoint_logs', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER.UNSIGNED },
      user_id: { // Người dùng nhận điểm
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Giữ lại log nếu user bị xóa? Hoặc CASCADE
      },
      event_id: { // Sự kiện mang lại điểm (có thể NULL nếu điểm từ nguồn khác)
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true, // Cho phép null nếu điểm không từ event
        references: { model: 'events', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Giữ lại log nếu event bị xóa?
      },
      points_awarded: { // Số điểm được cộng
        type: Sequelize.INTEGER, // Có thể là số âm nếu có trừ điểm? Nên là UNSIGNED nếu chỉ cộng
        allowNull: false,
        defaultValue: 0
      },
      reason: { // Lý do cộng điểm (vd: 'Hoàn thành sự kiện X')
        type: Sequelize.STRING,
        allowNull: true
      },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
      // Không cần updated_at cho log
    });
    await queryInterface.addIndex('volunpoint_logs', ['user_id']); // Index theo user
    await queryInterface.addIndex('volunpoint_logs', ['event_id']); // Index theo event
    console.log('✅ Created table volunpoint_logs with indexes');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('volunpoint_logs');
    console.log('↩️ Dropped table volunpoint_logs');
  }
};