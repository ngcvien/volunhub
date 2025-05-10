// backend/src/models/EventImage.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
import Event from './Event.model'; // Sẽ dùng cho association

export interface EventImageAttributes {
    id: number;
    eventId: number;
    imageUrl: string; // camelCase trong code
    createdAt?: Date;
    updatedAt?: Date;
}

interface EventImageCreationAttributes extends Optional<EventImageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class EventImage extends Model<EventImageAttributes, EventImageCreationAttributes> implements EventImageAttributes {
    public id!: number;
    public eventId!: number;
    public imageUrl!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly event?: Event; // Association
}

EventImage.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        eventId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'event_id' },
        imageUrl: { type: DataTypes.STRING(1024), allowNull: false, field: 'image_url' },
    },
    {
        tableName: 'event_images',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default EventImage;