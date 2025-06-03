// backend/src/models/ConversationParticipant.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
// Không cần import User, Conversation trực tiếp ở đây nếu chỉ là bảng nối thuần túy
// và association được định nghĩa ở file associations.ts

export interface ConversationParticipantAttributes {
    conversationId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    // Thêm các trường như lastReadMessageId, isAdmin (for group) sau nếu cần
}

// Các trường đều là khóa và có default timestamp, nên không cần CreationAttributes riêng
class ConversationParticipant extends Model<ConversationParticipantAttributes> implements ConversationParticipantAttributes {
    public conversationId!: number;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ConversationParticipant.init(
    {
        conversationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            field: 'conversation_id',
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            field: 'user_id',
        },
    },
    {
        tableName: 'conversation_participants',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default ConversationParticipant;