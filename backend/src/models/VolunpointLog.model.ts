// backend/src/models/VolunpointLog.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
import User from './User.model';
import Event from './Event.model';

export interface VolunpointLogAttributes {
    id: number;
    userId: number;
    eventId: number | null;
    pointsAwarded: number;
    reason: string | null;
    createdAt?: Date;
}

interface LogCreationAttributes extends Optional<VolunpointLogAttributes, 'id' | 'eventId' | 'reason' | 'createdAt'> {}

class VolunpointLog extends Model<VolunpointLogAttributes, LogCreationAttributes> implements VolunpointLogAttributes {
    public id!: number;
    public userId!: number;
    public eventId!: number | null;
    public pointsAwarded!: number;
    public reason!: string | null;
    public readonly createdAt!: Date;

    public readonly user?: User;
    public readonly event?: Event;
}

VolunpointLog.init({
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
    eventId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'event_id' },
    pointsAwarded: { type: DataTypes.INTEGER, allowNull: false, field: 'points_awarded' },
    reason: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: 'volunpoint_logs',
    sequelize,
    timestamps: true,
    updatedAt: false, // Chỉ cần createdAt
    underscored: true,
});

export default VolunpointLog;