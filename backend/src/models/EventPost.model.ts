// backend/src/models/EventPost.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
import User from './User.model'; // Sẽ cần để include author
import Event from './Event.model'; // Sẽ cần để include event (nếu cần)

export interface EventPostAttributes {
    id: number;
    eventId: number;
    userId: number;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;

    // Có thể thêm các thuộc tính ảo hoặc association sau
    author?: User; // Để include thông tin người đăng
}

interface EventPostCreationAttributes extends Optional<EventPostAttributes, 'id' | 'createdAt' | 'updatedAt' | 'author'> {}

class EventPost extends Model<EventPostAttributes, EventPostCreationAttributes> implements EventPostAttributes {
    public id!: number;
    public eventId!: number;
    public userId!: number;
    public content!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations (sẽ được định nghĩa trong associations.ts)
    public readonly author?: User;
    public readonly event?: Event;
}

EventPost.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'event_id',
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'user_id',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        // createdAt, updatedAt sẽ được underscored: true xử lý
    },
    {
        tableName: 'event_posts',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default EventPost;