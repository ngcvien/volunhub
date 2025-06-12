import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';
import User from './User.model';
import Event from './Event.model';

export enum ReportType {
    INAPPROPRIATE_CONTENT = 'inappropriate_content',
    SPAM = 'spam',
    HARASSMENT = 'harassment',
    FAKE_EVENT = 'fake_event',
    OTHER = 'other'
}

export enum ReportStatus {
    PENDING = 'pending',
    REVIEWING = 'reviewing',
    RESOLVED = 'resolved',
    REJECTED = 'rejected'
}

export interface ReportAttributes {
    id: number;
    reporterId: number;
    reportedEventId: number;
    type: ReportType;
    description: string;
    status: ReportStatus;
    adminNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class Report extends Model<ReportAttributes> implements ReportAttributes {
    public id!: number;
    public reporterId!: number;
    public reportedEventId!: number;
    public type!: ReportType;
    public description!: string;
    public status!: ReportStatus;
    public adminNote?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Report.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        reporterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        reportedEventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Event,
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ReportType)),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ReportStatus)),
            allowNull: false,
            defaultValue: ReportStatus.PENDING
        },
        adminNote: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'Report',
        tableName: 'reports',
        timestamps: true
    }
);

// Associations
Report.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
Report.belongsTo(Event, { foreignKey: 'reportedEventId', as: 'reportedEvent' });

export default Report; 