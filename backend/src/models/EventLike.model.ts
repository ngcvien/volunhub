// backend/src/models/EventLike.model.ts
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.config'; // Import từ config

// Interface (optional, vì các trường đều là key)
export interface EventLikeAttributes {
  userId: number;
  eventId: number;
  createdAt?: Date;
}

// Model này không cần các phương thức phức tạp
class EventLike extends Model<EventLikeAttributes> implements EventLikeAttributes {
  public userId!: number;
  public eventId!: number;
  public readonly createdAt!: Date;
  // Không cần updatedAt cho bảng like
}

EventLike.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      field: 'user_id',
    },
    eventId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      field: 'event_id',
    },
    // createdAt sẽ được Sequelize quản lý
  },
  {
    tableName: 'event_likes',
    sequelize, // TRUYỀN INSTANCE SEQUELIZE
    timestamps: true, // Chỉ cần createdAt
    updatedAt: false, // Không cần updatedAt
    underscored: true,
  }
);

export default EventLike;