// backend/src/models/Conversation.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config'; // Import từ config
import User, {UserAttributes } from './User.model'; // Sẽ dùng cho association
import Message, {MessageAttributes} from './Message.model'; // Sẽ dùng cho association

export enum ConversationType {
    PRIVATE = 'private',
    GROUP = 'group'
}

export interface ConversationAttributes {
    id: number;
    type: ConversationType;
    createdAt?: Date;
    updatedAt?: Date;

    // Thuộc tính ảo từ associations
    // participants?: User[];
    // messages?: Message[];
    // lastMessage?: Message; // Có thể thêm sau để tối ưu
}
export interface BasicUserForChat extends Pick<UserAttributes, 'id' | 'username' | 'avatarUrl' | 'fullName'> {}

export interface ConversationListItem extends ConversationAttributes {
    participants?: BasicUserForChat[]; // Danh sách đầy đủ người tham gia (đã rút gọn)
    otherParticipant?: BasicUserForChat; // Người tham gia còn lại (trong chat 1-1)
    lastMessage?: MessageAttributes; // Tin nhắn cuối cùng (sẽ làm sau)
}

interface ConversationCreationAttributes extends Optional<ConversationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Conversation extends Model<ConversationAttributes, ConversationCreationAttributes> implements ConversationAttributes {
    public id!: number;
    public type!: ConversationType;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations (sẽ được định nghĩa trong associations.ts)
    public readonly participants?: User[];
    public readonly messages?: Message[];
    public readonly lastMessage?: Message; 
    public readonly conversationParticipants?: any; 
}

Conversation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(ConversationType)),
            allowNull: false,
            defaultValue: ConversationType.PRIVATE,
        },
        // last_message_id có thể được thêm sau này
    },
    {
        tableName: 'conversations',
        sequelize, // Truyền instance sequelize
        timestamps: true,
        underscored: true,
    }
);

export default Conversation;