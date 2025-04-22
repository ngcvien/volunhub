import User, { UserAttributes } from '../models/User.model';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.util'; // Import hàm tạo token


// Kiểu dữ liệu đầu vào cho hàm register, bỏ qua id và password_hash, thêm password thường
type RegisterUserInput = Omit<UserAttributes, 'id' | 'password_hash' | 'createdAt' | 'updatedAt'> & { password?: string };
type LoginUserInput = Pick<UserAttributes, 'email'> & { password?: string };

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
  async loginUser(userData: LoginUserInput): Promise<{ token: string; user: Omit<UserAttributes, 'password_hash'> }> {
    // 1. Tìm user bằng email
    const user = await User.findOne({ where: { email: userData.email } });
    if (!user) {
      throw new Error('Email hoặc mật khẩu không chính xác.'); // Thông báo chung chung để bảo mật
    }

    // 2. Kiểm tra mật khẩu
    if (!userData.password) {
        throw new Error('Vui lòng nhập mật khẩu.');
    }
    const isPasswordMatch = await user.comparePassword(userData.password); // Dùng hàm trong Model
    if (!isPasswordMatch) {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }

    // 3. Tạo JWT token
    const token = signToken({ userId: user.id, email: user.email });

    // 4. Chuẩn bị thông tin user trả về (loại bỏ password_hash)
    const userResponse: Omit<UserAttributes, 'password_hash'> = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };

    return { token, user: userResponse };
  }

  // Các hàm khác như loginUser, getUserById... sẽ thêm sau
}

// Export một instance của class để sử dụng (Singleton pattern)
export default new UserService();