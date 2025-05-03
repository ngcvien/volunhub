'use strict';
// Định nghĩa các trạng thái có thể có
const completionStatuses = ['pending', 'confirmed', 'absent'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('event_participants', 'completion_status', { // Tên bảng và tên cột
      type: Sequelize.ENUM(...completionStatuses), // Kiểu ENUM với các giá trị cho phép
      allowNull: false, // Bắt buộc phải có trạng thái
      defaultValue: 'pending', // Mặc định là 'pending' khi mới tham gia
      after: 'event_id' // (Tùy chọn) Đặt sau cột event_id
    });
    console.log('✅ Added column completion_status to table event_participants');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('event_participants', 'completion_status');
    // Cần xóa ENUM type nếu dùng PostgreSQL, MySQL thường tự xử lý
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_event_participants_completion_status";');
    console.log('↩️ Removed column completion_status from table event_participants');
  }
};