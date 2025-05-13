import User, { UserAttributes, UserRole } from '../models/User.model';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.util'; // Import hàm tạo token


// Kiểu dữ liệu đầu vào cho hàm register, bỏ qua id và password_hash, thêm password thường
type RegisterUserInput = Omit<UserAttributes, 'id' | 'password_hash' | 'createdAt' | 'updatedAt'> & { password?: string };
type LoginUserInput = Pick<UserAttributes, 'email'> & { password?: string };
type UserProfileUpdateInput = Partial<Pick<UserAttributes, 'username' | 'fullName' | 'bio' | 'location' | 'avatarUrl'>>;
type PublicUserProfile = Omit<UserAttributes, 'password_hash' | 'email' | 'updatedAt'>;
type AdminUserUpdateInput = Partial<Pick<UserAttributes, 'role' | 'isVerified' | 'isActive'>>;
type LeaderboardUser = Pick<UserAttributes, 'id' | 'username' | 'avatarUrl' | 'volunpoints' | 'fullName'>;


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
  async getUserProfileById(userId: number): Promise<PublicUserProfile | null> {
    try {
      const user = await User.findByPk(userId, {
        // Chỉ định rõ các thuộc tính công khai muốn lấy
        attributes: [
          'id',
          'username',
          'fullName',
          'bio',
          'location',
          'avatarUrl',
          'volunpoints', 
          'isVerified',
          'createdAt', 
          'isActive'
        ]
      });

      if (!user) {
        // Trả về null nếu không tìm thấy user
        return null;
      }

      // Trả về dữ liệu dạng plain object
      return user.get({ plain: true });

    } catch (error) {
      console.error(`Lỗi khi lấy profile cho user ${userId}:`, error);
      throw new Error('Không thể lấy thông tin hồ sơ người dùng vào lúc này.');
    }
  }

  async getUserProfileByUsername(username: string): Promise<PublicUserProfile | null> {
    try {
      const user = await User.findOne({
        where: { username },
        attributes: [
          'id',
          'username',
          'fullName',
          'bio',
          'location',
          'avatarUrl',
          'createdAt'
        ] 
      });

      if (!user) {
        // Trả về null nếu không tìm thấy user
        return null;
      }

      // Trả về dữ liệu dạng plain object
      return user.get({ plain: true });

    } catch (error) {
      console.error(`Lỗi khi lấy profile cho user ${username}:`, error);
      throw new Error('Không thể lấy thông tin hồ sơ người dùng vào lúc này.');
    }
  }
  
  async getAllUsers(): Promise<Omit<UserAttributes, 'password_hash'>[]> {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password_hash'] }, // Loại bỏ password hash
        order: [['createdAt', 'DESC']]
      });
      return users.map(user => user.get({ plain: true }));
    } catch (error) {
      console.error("Lỗi khi lấy danh sách user:", error);
      throw new Error('Không thể lấy danh sách người dùng.');
    }
  }

  /**
  * Admin: Cập nhật trạng thái (role, isVerified, isActive) cho người dùng
  * @param targetUserId ID của người dùng cần cập nhật
  * @param statusData Dữ liệu cần cập nhật
  */
  async updateUserStatusByAdmin(targetUserId: number, statusData: AdminUserUpdateInput): Promise<Omit<UserAttributes, 'password_hash'>> {
    try {
      const userToUpdate = await User.findByPk(targetUserId);
      if (!userToUpdate) {
        throw Object.assign(new Error('Người dùng không tồn tại.'), { statusCode: 404 });
      }

      // Chỉ cho phép cập nhật các trường trạng thái này
      const allowedStatusUpdates: (keyof AdminUserUpdateInput)[] = ['role', 'isVerified', 'isActive'];
      const dataToUpdate: Partial<UserAttributes> = {};

      for (const key of allowedStatusUpdates) {
        if (statusData[key] !== undefined) {
          (dataToUpdate as any)[key] = statusData[key];
        }
      }

      if (Object.keys(dataToUpdate).length === 0) {
        // Không có gì để cập nhật
        const currentUserData = userToUpdate.get({ plain: true }) as UserAttributes;
        delete currentUserData.password_hash;
        return currentUserData;
      }

      await userToUpdate.update(dataToUpdate);

      // Lấy lại thông tin đã cập nhật
      const updatedUser = userToUpdate.get({ plain: true }) as UserAttributes;
      delete updatedUser.password_hash;
      return updatedUser;

    } catch (error: any) {
      console.error(`Lỗi khi Admin cập nhật trạng thái cho user ${targetUserId}:`, error);
      if (error.name === 'SequelizeValidationError') {
        throw Object.assign(new Error(`Validation Error: ${error.message}`), { statusCode: 400 });
      }
      throw new Error('Không thể cập nhật trạng thái người dùng.');
    }
  }

  async getTopVolunteers(limit: number = 5): Promise<LeaderboardUser[]> {
        try {
            const topUsers = await User.findAll({
                attributes: ['id', 'username', 'avatarUrl', 'volunpoints', 'fullName'], // Chỉ lấy các trường cần thiết
                order: [['volunpoints', 'DESC']], // Sắp xếp theo điểm giảm dần
                limit: limit, // Giới hạn số lượng kết quả
                where: {
                    isActive: true // Chỉ lấy các user đang hoạt động (tùy chọn)
                }
            });
            // Không cần map qua get({plain:true}) nếu attributes được chỉ định rõ và không có include phức tạp
            return topUsers as LeaderboardUser[];
        } catch (error) {
            console.error("Lỗi khi lấy top tình nguyện viên:", error);
            throw new Error('Không thể lấy danh sách top tình nguyện viên.');
        }
    }
}

// Export một instance của class để sử dụng (Singleton pattern)
export default new UserService();