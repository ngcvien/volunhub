import User, { UserAttributes } from '../models/User.model';
import bcrypt from 'bcryptjs';

// Kiểu dữ liệu đầu vào cho hàm register, bỏ qua id và password_hash, thêm password thường
type RegisterUserInput = Omit<UserAttributes, 'id' | 'password_hash' | 'createdAt' | 'updatedAt'> & { password?: string };

class UserService {
  async registerUser(userData: RegisterUserInput): Promise<User> {
    // 1. Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({
      where: {
        // Sequelize.or không cần thiết nếu bạn muốn báo lỗi riêng cho từng trường
        [Symbol.for('or')]: [{ email: userData.email }, { username: userData.username }]
      }
    });

    if (existingUser) {
      if (existingUser.email === userData.email) {
        throw new Error('Email đã tồn tại.'); // Nên dùng custom error class sau này
      }
      if (existingUser.username === userData.username) {
         throw new Error('Tên đăng nhập đã tồn tại.');
      }
    }

    // 2. Băm mật khẩu
    if (!userData.password) {
      throw new Error('Mật khẩu là bắt buộc.');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 là số vòng salt

    // 3. Tạo người dùng mới trong database
    try {
      const newUser = await User.create({
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword, // Lưu mật khẩu đã băm
      });
      return newUser;
    } catch (error) {
      console.error("Lỗi khi tạo user:", error);
      // Xử lý lỗi validation từ Sequelize nếu có
      if (error instanceof Error && error.name === 'SequelizeValidationError') {
          throw new Error(`Lỗi validation: ${error.message}`);
      }
      throw new Error('Không thể tạo người dùng vào lúc này.');
    }
  }

  // Các hàm khác như loginUser, getUserById... sẽ thêm sau
}

// Export một instance của class để sử dụng (Singleton pattern)
export default new UserService();