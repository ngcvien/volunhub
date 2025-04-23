import User, { UserAttributes } from '../models/User.model';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.util'; // Import hàm tạo token


// Kiểu dữ liệu đầu vào cho hàm register, bỏ qua id và password_hash, thêm password thường
type RegisterUserInput = Omit<UserAttributes, 'id' | 'password_hash' | 'createdAt' | 'updatedAt'> & { password?: string };
type LoginUserInput = Pick<UserAttributes, 'email'> & { password?: string };
type UserProfileUpdateInput = Partial<Pick<UserAttributes, 'username' | 'fullName' | 'bio' | 'location' | 'avatarUrl'>>;

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

  async updateUserProfile(userId: number, updateData: UserProfileUpdateInput): Promise<Omit<UserAttributes, 'password_hash'>> {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('Người dùng không tồn tại.');
        }

        // Chỉ cập nhật các trường được phép (tránh cập nhật email, password ở đây)
        // Chúng ta có thể lọc các key không mong muốn hoặc chỉ lấy các key mong muốn
        const allowedUpdates: (keyof UserProfileUpdateInput)[] = ['username', 'fullName', 'bio', 'location', 'avatarUrl'];
        const dataToUpdate: Partial<UserAttributes> = {};

        for (const key of allowedUpdates) {
             // Chỉ cập nhật nếu key đó có trong updateData và khác giá trị hiện tại (tùy chọn)
             if (updateData[key] !== undefined /* && updateData[key] !== user[key] */) {
                // Gán trực tiếp giá trị vào đối tượng dataToUpdate
                 (dataToUpdate as any)[key] = updateData[key];
             }
        }

        // Kiểm tra xem có gì để cập nhật không
         if (Object.keys(dataToUpdate).length === 0) {
             // Có thể trả về user hiện tại hoặc báo không có gì thay đổi
             // return user.get({ plain: true }) as Omit<UserAttributes, 'password_hash'>;
         }

         // Cập nhật các trường đã lọc
        await user.update(dataToUpdate);

        // Lấy lại thông tin user đã cập nhật để trả về (loại bỏ password_hash)
        // dùng get({ plain: true }) để lấy object thường thay vì Sequelize instance
        const updatedUser = user.get({ plain: true }) as UserAttributes;
        delete updatedUser.password_hash; // Xóa trường nhạy cảm
        return updatedUser;

    } catch (error: any) {
        console.error(`Lỗi khi cập nhật profile cho user ${userId}:`, error);
        if (error instanceof Error && (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError')) {
             // Xử lý lỗi unique username nếu có
            throw new Error(`Lỗi validation khi cập nhật: ${error.message}`);
        }
        throw new Error('Không thể cập nhật hồ sơ người dùng vào lúc này.');
    }
}

  // Các hàm khác như loginUser, getUserById... sẽ thêm sau
}

// Export một instance của class để sử dụng (Singleton pattern)
export default new UserService();