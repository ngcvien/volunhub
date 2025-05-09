// backend/src/models/Event.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
import User from './User.model'; // Import User model để tạo quan hệ
import Participation from './Participation.model';
import EventPost from './EventPost.model'; // Import EventPost model để tạo quan hệ
// Interface mô tả thuộc tính Event
export interface EventAttributes {
  id: number;
  creatorId: number; // Khóa ngoại liên kết với User
  title: string;
  description: string | null;
  location: string | null;
  eventTime: Date; 
  imageUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  status: EventStatus;
  creator?: User;
  participants?: User[];
  posts?: EventPost[];
  isParticipating?: boolean;
  isLiked?: boolean;
  likeCount?: number;
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'description' | 'location' | 'imageUrl' | 'createdAt' | 'updatedAt'> {}

class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: number;
  public creatorId!: number;
  public title!: string;
  public description!: string | null;
  public location!: string | null;
  public eventTime!: Date;
  public imageUrl!: string | null;
  public status!: EventStatus;
  public likeCount!: number; // Số lượng người thích sự kiện (tính toán từ EventLike)
  public posts?: EventPost[] | undefined;
  public creator?: User | undefined;
  public participants?: User[] | undefined;
  public isLiked?: boolean | undefined;
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Khai báo quan hệ (tùy chọn, nhưng hữu ích cho các truy vấn sau này)
  // public readonly user?: User; // Định nghĩa sau khi setup association
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    // Sequelize tự động tạo khóa ngoại dựa trên association hoặc dùng field: 'creator_id'
    creatorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'creator_id', // Chỉ rõ tên cột trong DB là snake_case
      // references: { // Có thể định nghĩa reference ở đây hoặc dùng association bên dưới
      //   model: User,
      //   key: 'id'
      // }
    },
    title: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: new DataTypes.STRING(255),
      allowNull: true,
    },
    eventTime: {
      type: DataTypes.DATE, 
      field: 'event_time', 
    },
    imageUrl: {
      type: DataTypes.STRING, 
      allowNull: true,
      field: 'image_url' 
    },
    status: {
      type: DataTypes.ENUM(...Object.values(EventStatus)),
      allowNull: false,
      defaultValue: EventStatus.UPCOMING
    }
    // createdAt và updatedAt Sequelize tự quản lý nếu timestamps: true
    // và underscored: true sẽ tự ánh xạ sang created_at, updated_at
  },
  {
    tableName: 'events',
    sequelize,
    timestamps: true,
    underscored: true, // QUAN TRỌNG: Áp dụng quy tắc snake_case cho cột DB
  }
);

// --- Định nghĩa mối quan hệ: Một Event thuộc về một User (Creator) ---
// Điều này sẽ tự động thêm phương thức như event.getUser(), user.getEvents() sau này
// Và cũng đảm bảo foreign key 'creator_id' tồn tại


export default Event;