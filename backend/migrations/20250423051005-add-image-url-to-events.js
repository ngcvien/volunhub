'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột image_url vào bảng events
    await queryInterface.addColumn('events', 'image_url', { // Tên bảng là 'events', tên cột là 'image_url' (snake_case)
      type: Sequelize.STRING, // Kiểu dữ liệu VARCHAR(255)
      allowNull: true,        // Cho phép NULL (không bắt buộc phải có ảnh)
      after: 'event_time'     // (Tùy chọn) Vị trí cột mới, đặt sau cột event_time cho gọn
    });
    console.log('✅ Added column image_url to table events');
  },

  async down(queryInterface, Sequelize) {
    // Xóa cột image_url khỏi bảng events (khi rollback migration)
    await queryInterface.removeColumn('events', 'image_url');
    console.log('↩️ Removed column image_url from table events');
  }
};