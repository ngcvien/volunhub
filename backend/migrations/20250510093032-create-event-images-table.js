'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_images', { // Tên bảng
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      event_id: { // Khóa ngoại đến bảng events
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'events', // Tên bảng events
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Nếu sự kiện bị xóa, các ảnh liên quan cũng bị xóa
      },
      image_url: { // Đường dẫn URL của ảnh (từ Cloudinary)
        type: Sequelize.STRING(1024), // Cho phép URL dài
        allowNull: false
      },
      // Có thể thêm cột 'order' (INTEGER) nếu bạn muốn sắp xếp thứ tự ảnh
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
    await queryInterface.addIndex('event_images', ['event_id']); // Index cho event_id để truy vấn nhanh
    console.log('✅ Created table event_images and its index');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event_images');
    console.log('↩️ Dropped table event_images');
  }
};