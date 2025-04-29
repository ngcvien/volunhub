'use strict';
// Định nghĩa các trạng thái có thể có
const eventStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'status', {
      type: Sequelize.ENUM(...eventStatuses), // Dùng ENUM để giới hạn giá trị
      allowNull: false,
      defaultValue: 'upcoming', // Mặc định là sắp diễn ra
      after: 'event_time' // Đặt sau cột event_time (tùy chọn)
    });
     console.log('✅ Added column status to table events');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('events', 'status');
     // Cần xóa ENUM type nếu dùng PostgreSQL, MySQL thường tự xử lý
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_events_status";');
    console.log('↩️ Removed column status from table events');
  }
};