import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Tải các biến môi trường từ file .env

// Kiểm tra các biến môi trường cần thiết
const dbName = process.env.DB_DATABASE;
const dbUser = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT as 'mysql' | undefined; // Ép kiểu hoặc để undefined

if (dbName === undefined ||
    dbUser === undefined ||
    dbPassword === undefined || // Quan trọng: Chỉ kiểm tra xem key DB_PASSWORD có tồn tại không
    dbHost === undefined ||
    dbDialect === undefined)
{
    console.error('Lỗi: Các biến môi trường DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DIALECT phải được định nghĩa trong file .env (giá trị DB_PASSWORD có thể để trống).');
    process.exit(1);
}
// --- KẾT THÚC THAY ĐỔI ---

// Phần khởi tạo Sequelize giữ nguyên, nó sẽ nhận dbPassword là "" nếu bạn để trống trong .env
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: dbDialect,
    logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Database Connected: ${sequelize.config.database} on host ${sequelize.config.host}`);

    // Đồng bộ model - Chỉ dùng khi development, production nên dùng migration
    // await sequelize.sync({ alter: true }); // alter: true cố gắng cập nhật bảng không xóa dữ liệu
    // console.log("Models synchronized successfully.");

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Thoát tiến trình nếu không kết nối được DB
  }
};

// Export instance sequelize để dùng trong model và hàm connectDB để gọi khi khởi động app
export { sequelize, connectDB };