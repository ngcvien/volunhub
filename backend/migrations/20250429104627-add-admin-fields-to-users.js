'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin', 'verified_org'), // Định nghĩa các vai trò có thể có
      allowNull: false,
      defaultValue: 'user', // Mặc định là user thường
      after: 'password_hash' // Đặt sau cột password_hash (tùy chọn)
    });
    await queryInterface.addColumn('users', 'is_verified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Mặc định là chưa xác minh
      after: 'role' // Đặt sau cột role
    });
    await queryInterface.addColumn('users', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Mặc định là đang hoạt động
      after: 'is_verified' // Đặt sau cột is_verified
    });
    console.log('✅ Added columns role, is_verified, is_active to table users');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'is_active');
    await queryInterface.removeColumn('users', 'is_verified');
    await queryInterface.removeColumn('users', 'role');
    // Cần xóa ENUM type nếu dùng PostgreSQL, MySQL thường tự xử lý
    // await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    console.log('↩️ Removed columns role, is_verified, is_active from table users');
  }
};