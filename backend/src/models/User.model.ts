import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.config';
import Event from './Event.model'; 
import Participation from './Participation.model';
import EventLike from './EventLike.model';
import EventPostComment from './EventPostComment.model';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password_hash: string; 
  fullName: string | null;  
  bio: string | null;        
  location: string | null;  
  avatarUrl: string | null; 
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface cho việc tạo User (id là optional)
// Omit dùng để loại bỏ các trường không cần thiết khi tạo mới từ UserAttributes
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'fullName' | 'bio' | 'location' | 'avatarUrl' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; // '!' khẳng định rằng thuộc tính này sẽ được Sequelize khởi tạo
  public username!: string;
  public email!: string;
  public password_hash!: string;
  public fullName!: string | null;    
  public bio!: string | null;       
  public location!: string | null;    
  public avatarUrl!: string | null; 

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
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'full_name' // Chỉ định rõ nếu muốn chắc chắn
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'avatar_url'
    }
    // Sequelize sẽ tự động thêm createdAt và updatedAt nếu không cấu hình timestamps: false
  },
  {
    tableName: 'users',       // Tên bảng trong database
    sequelize,              // Truyền instance sequelize vào
    timestamps: true,         // Bật timestamps tự động
    underscored: true 
  }
);


export default User;