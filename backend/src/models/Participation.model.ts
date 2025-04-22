// backend/src/models/Participation.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../services/database.service';
// Không cần import User, Event ở đây nếu chỉ định nghĩa bảng nối
// Nhưng sẽ cần nếu muốn thêm các thuộc tính khác hoặc association phức tạp hơn

// Interface mô tả thuộc tính Participation (chỉ cần các khóa ngoại)
export interface ParticipationAttributes {
  userId: number;
  eventId: number;
  createdAt?: Date; // Sequelize sẽ tự quản lý nếu timestamps: true
  updatedAt?: Date; // Sequelize sẽ tự quản lý nếu timestamps: true
}

// Không cần CreationAttributes vì các trường đều là bắt buộc khi tạo

class Participation extends Model<ParticipationAttributes> implements ParticipationAttributes {
  public userId!: number;
  public eventId!: number;

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