// backend/config/config.js
require('dotenv').config(); // Đọc file .env để lấy biến môi trường

// Kiểm tra các biến môi trường cần thiết cho CLI
const requiredEnvVars = ['DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_DIALECT'];
requiredEnvVars.forEach((varName) => {
  // Lưu ý: Vẫn cho phép DB_PASSWORD là chuỗi rỗng nhưng phải được định nghĩa
  if (process.env[varName] === undefined) {
    console.error(`Lỗi: Biến môi trường ${varName} chưa được định nghĩa trong file .env cho Sequelize CLI.`);
    process.exit(1);
  }
});

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, // Có thể là chuỗi rỗng nếu DB không có pass
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    // Thêm các tùy chọn khác nếu cần, ví dụ timezone
    // dialectOptions: {
    //   // bigNumberStrings: true
    // }
  },
  test: {
    // Cấu hình cho môi trường test (nếu có)
    username: process.env.TEST_DB_USERNAME || process.env.DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE || `${process.env.DB_DATABASE}_test`,
    host: process.env.TEST_DB_HOST || process.env.DB_HOST,
    port: Number(process.env.TEST_DB_PORT) || 3306,
    dialect: process.env.TEST_DB_DIALECT || 'mysql',
    logging: false, // Tắt log khi chạy test
  },
  production: {
    // Cấu hình cho môi trường production (rất quan trọng)
    // Nên dùng các biến môi trường riêng cho production
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    host: process.env.PROD_DB_HOST,
    port: Number(process.env.PROD_DB_PORT) || 3306,
    dialect: process.env.PROD_DB_DIALECT || 'mysql',
    logging: false, // Tắt log ở production
    // Thêm các tùy chọn production khác: ssl, pool...
  }
};