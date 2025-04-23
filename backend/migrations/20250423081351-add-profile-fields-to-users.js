// backend/migrations/YYYYMMDDHHMMSS-add-profile-fields-to-users.js
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'full_name', { // Tên đầy đủ
      type: Sequelize.STRING, // VARCHAR(255)
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'bio', {       // Tiểu sử
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'location', { // Địa điểm
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'avatar_url', { // URL ảnh đại diện
      type: Sequelize.STRING, // Hoặc TEXT nếu URL có thể rất dài
      allowNull: true,
    });
    console.log('✅ Added columns full_name, bio, location, avatar_url to table users');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar_url');
    await queryInterface.removeColumn('users', 'location');
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'full_name');
    console.log('↩️ Removed columns full_name, bio, location, avatar_url from table users');
  }
};