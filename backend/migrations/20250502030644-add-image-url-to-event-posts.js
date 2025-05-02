'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('event_posts', 'image_url', {
      type: Sequelize.STRING, // Hoặc TEXT
      allowNull: true,
      after: 'content' // Đặt sau cột content
    });
    console.log('✅ Added column image_url to table event_posts');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('event_posts', 'image_url');
    console.log('↩️ Removed column image_url from table event_posts');
  }
};