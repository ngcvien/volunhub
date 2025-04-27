'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_post_comments', { // Tên bảng
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER.UNSIGNED },
      post_id: { // Khóa ngoại đến event_posts
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'event_posts', key: 'id' }, // Liên kết tới bảng bài viết sự kiện
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa bình luận nếu bài viết gốc bị xóa
      },
      user_id: { // Khóa ngoại đến users (người bình luận)
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Xóa bình luận nếu người dùng bị xóa
      },
      parent_comment_id: { // Để làm bình luận trả lời (nested)
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true, // Cho phép NULL (nghĩa là bình luận gốc)
        references: { model: 'event_post_comments', key: 'id' }, // Tự tham chiếu đến chính nó
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Nếu comment cha bị xóa, comment con cũng xóa theo
      },
      content: { // Nội dung bình luận
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
    // Thêm các index cần thiết
    await queryInterface.addIndex('event_post_comments', ['post_id', 'created_at']); // Index để lấy comment theo post và sắp xếp
    await queryInterface.addIndex('event_post_comments', ['user_id']); // Index để lấy comment theo user
    await queryInterface.addIndex('event_post_comments', ['parent_comment_id']); // Index cho comment trả lời
    console.log('✅ Created table event_post_comments with indexes');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event_post_comments');
    console.log('↩️ Dropped table event_post_comments');
  }
};