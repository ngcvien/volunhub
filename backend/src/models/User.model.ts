import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../services/database.service'; // Import instance sequelize
import Event from './Event.model'; // Import Event
import Participation from './Participation.model';
// Interface mô tả các thuộc tính của User (cho TypeScript)
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string; // Sẽ lưu mật khẩu đã được băm
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface cho việc tạo User (id là optional)
// Omit dùng để loại bỏ các trường không cần thiết khi tạo mới từ UserAttributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; // '!' khẳng định rằng thuộc tính này sẽ được Sequelize khởi tạo
  public username!: string;
  public email!: string;
  public password_hash!: string;

  // Timestamps tự động
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Hàm instance để so sánh mật khẩu (sẽ dùng khi làm login)
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true, // Tên đăng nhập là duy nhất
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true, // Email là duy nhất
      validate: {
        isEmail: true, // Sequelize tự động kiểm tra định dạng email
      },
    },
    password_hash: {
      type: new DataTypes.STRING(255), // Lưu trữ chuỗi hash
      allowNull: false,
    },
    // Sequelize sẽ tự động thêm createdAt và updatedAt nếu không cấu hình timestamps: false
  },
  {
    tableName: 'users',       // Tên bảng trong database
    sequelize,              // Truyền instance sequelize vào
    timestamps: true,         // Bật timestamps tự động
    underscored: true 
  }
);

User.belongsToMany(Event, {
  through: Participation, // Thông qua bảng trung gian Participation
  foreignKey: 'userId', // Khóa ngoại trong bảng Participation tham chiếu đến User
  otherKey: 'eventId', // Khóa ngoại trong bảng Participation tham chiếu đến Event
  as: 'participatingEvents' // Tên định danh để lấy các event user tham gia (vd: user.getParticipatingEvents())
});

export default User;