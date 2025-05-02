// backend/src/models/EventPostComment.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';
import User from './User.model';
import EventPost from './EventPost.model';

export interface EventPostCommentAttributes {
    id: number;
    postId: number;
    userId: number;
    parentId: number | null; // Đổi tên thành parentId cho camelCase
    content: string;
    imageUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;

    // Associations (optional)
    author?: User;
    replies?: EventPostComment[];
    parentComment?: EventPostComment;
}

interface CommentCreationAttributes extends Optional<EventPostCommentAttributes, 'id' | 'parentId' | 'createdAt' | 'updatedAt' | 'author' | 'replies' | 'parentComment'> {}

class EventPostComment extends Model<EventPostCommentAttributes, CommentCreationAttributes> implements EventPostCommentAttributes {
    public id!: number;
    public postId!: number;
    public userId!: number;
    public parentId!: number | null;
    public content!: string;
    public imageUrl!: string | null; 

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Associations
    public readonly author?: User;
    public readonly post?: EventPost; // Quan hệ với EventPost
    public readonly replies?: EventPostComment[];
    public readonly parentComment?: EventPostComment;

    // Hàm để lấy replies (nếu không dùng eager loading)
    // public getReplies!: HasManyGetAssociationsMixin<EventPostComment>;
}

EventPostComment.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        postId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'post_id' },
        userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
        parentId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'parent_comment_id' },
        content: { type: DataTypes.TEXT, allowNull: false },
        imageUrl: { type: DataTypes.STRING, allowNull: true, field: 'image_url' },
    },
    {
        tableName: 'event_post_comments',
        sequelize,
        timestamps: true,
        underscored: true,
    }
);

export default EventPostComment;