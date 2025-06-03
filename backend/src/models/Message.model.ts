// backend/src/models/Message.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
import User from './User.model'; // Sẽ dùng cho association sender
import Conversation from './Conversation.model'; // Sẽ dùng cho association conversation

export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    VIDEO = 'video'
}

export interface MessageAttributes {
    id: number;
    conversationId: number;
    senderId: number;
    content: string; // Sẽ là null nếu là tin nhắn media
    messageType: MessageType;
    mediaUrl: string | null; // URL cho ảnh/video
    createdAt?: Date;
    updatedAt?: Date;

    // Thuộc tính ảo từ associations
    sender?: User;
    conversation?: Conversation;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id' | 'mediaUrl' | 'createdAt' | 'updatedAt' | 'sender' | 'conversation'> {}

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: number;
    public conversationId!: number;
    public senderId!: number;
    public content!: string;
    public messageType!: MessageType;
    public mediaUrl!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations
    public readonly sender?: User;
    public readonly conversation?: Conversation;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'conversation_id',
        },
        senderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'sender_id',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false, // Giả định ban đầu text là bắt buộc
        },
        messageType: {
            type: DataTypes.ENUM(...Object.values(MessageType)),
            allowNull: false,
            defaultValue: MessageType.TEXT,
            field: 'message_type',
        },
        mediaUrl: {
            type: DataTypes.STRING(1024),
            allowNull: true,
            field: 'media_url',
        },
    },
    {
        tableName: 'messages',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default Message;