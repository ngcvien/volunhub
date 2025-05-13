'use strict';
// Các giá trị mới cho ENUM status
const newEventStatuses = ['pending_approval', 'upcoming', 'ongoing', 'completed', 'cancelled', 'rejected'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // MySQL không hỗ trợ thay đổi ENUM dễ dàng bằng cách thêm giá trị trực tiếp qua addColumn nếu đã có dữ liệu
    // Chúng ta sẽ thay đổi định nghĩa cột (CHANGE COLUMN)
    await queryInterface.changeColumn('events', 'status', {
      type: Sequelize.ENUM(...newEventStatuses),
      allowNull: false,
      defaultValue: 'pending_approval', // Sự kiện mới sẽ chờ duyệt
    });
    console.log('✅ Modified column status in table events with new ENUM values and default');
  },

  async down(queryInterface, Sequelize) {
    // Quay lại các giá trị ENUM cũ và default cũ
    const oldEventStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
    await queryInterface.changeColumn('events', 'status', {
      type: Sequelize.ENUM(...oldEventStatuses),
      allowNull: false,
      defaultValue: 'upcoming',
    });
    console.log('↩️ Reverted column status in table events');
  }
};