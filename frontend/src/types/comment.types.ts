// frontend/src/types/comment.types.ts
import { BasicUser } from './event.types'; // Hoặc định nghĩa lại BasicUser nếu cần

// Kiểu dữ liệu cho một bình luận
export interface EventPostCommentType {
    id: number;
    postId: number;
    userId: number;
    parentId: number | null;
    content: string;
    createdAt: string; // ISO String
    updatedAt: string; // ISO String
    author: BasicUser; // Thông tin người bình luận
    replies?: EventPostCommentType[];
    commentCount?: number; // Số lượng bình luận con (nếu có)
}