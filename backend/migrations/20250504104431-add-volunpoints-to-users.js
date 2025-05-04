'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'volunpoints', {
      type: Sequelize.INTEGER.UNSIGNED, // Điểm là số nguyên dương
      allowNull: false,
      defaultValue: 0, // Mặc định điểm ban đầu là 0
      after: 'is_active' // Đặt sau cột is_active (tùy chọn)
    });
    console.log('✅ Added column volunpoints to table users');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'volunpoints');
    console.log('↩️ Removed column volunpoints from table users');
  }
};