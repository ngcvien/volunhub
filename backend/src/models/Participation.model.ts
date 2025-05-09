// backend/src/models/Participation.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
// Không cần import User, Event ở đây nếu chỉ định nghĩa bảng nối
// Nhưng sẽ cần nếu muốn thêm các thuộc tính khác hoặc association phức tạp hơn

// Interface mô tả thuộc tính Participation (chỉ cần các khóa ngoại)
export interface ParticipationAttributes {
  userId: number;
  eventId: number;
  completionStatus?: string; 
  createdAt?: Date; 
  updatedAt?: Date;
}



// Không cần CreationAttributes vì các trường đều là bắt buộc khi tạo

class Participation extends Model<ParticipationAttributes> implements ParticipationAttributes {
  public userId!: number;
  public eventId!: number;
  public completionStatus?: string | undefined;

  // Timestamps (nếu bật)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Participation.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true, // Phần của khóa chính kết hợp
      allowNull: false,
      field: 'user_id', // Ánh xạ sang snake_case
      // Không cần references ở đây vì sẽ định nghĩa qua association belongsToMany
    },
    eventId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true, // Phần của khóa chính kết hợp
      allowNull: false,
      field: 'event_id', // Ánh xạ sang snake_case
      // Không cần references ở đây vì sẽ định nghĩa qua association belongsToMany
    },
    completionStatus: {
      type: DataTypes.ENUM('pending', 'confirmed', 'absent'), // Enum phải khớp migration
      allowNull: false,
      defaultValue: 'pending',
      field: 'completion_status'
    }
    // Sequelize tự động thêm createdAt và updatedAt nếu timestamps: true
  },
  {
    tableName: 'event_participants', // Tên bảng nối trong DB
    sequelize,
    timestamps: true, // Bật timestamps cho bảng nối (để biết khi nào tham gia)
    underscored: true, // Sử dụng snake_case cho created_at, updated_at
  }
);

export default Participation;