// frontend/src/api/comment.api.ts
import api from './index';
import { EventPostCommentType } from '../types/comment.types';

// Kiểu dữ liệu cho response lấy danh sách comments
interface GetCommentsResponse {
    message: string;
    comments: EventPostCommentType[];
}

// Kiểu dữ liệu cho data gửi lên khi tạo comment
interface CreateCommentInput {
    content: string;
    parentId?: number | null; // Cho phép trả lời (sẽ dùng sau)
}

// Kiểu dữ liệu cho response tạo comment
interface CreateCommentResponse {
    message: string;
    comment: EventPostCommentType; // Trả về comment mới tạo
}

/**
 * Lấy danh sách bình luận gốc cho một bài viết
 * @param postId ID của bài viết
 */
export const getCommentsForPostApi = async (postId: number | string): Promise<GetCommentsResponse> => {
    try {
        // GET /api/posts/:postId/comments
        const response = await api.get<GetCommentsResponse>(`/posts/${postId}/comments`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Get Comments (Post ID: ${postId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải bình luận.');
    }
};

/**
 * Tạo bình luận mới cho một bài viết
 * @param postId ID của bài viết
 * @param commentData Dữ liệu bình luận { content, parentId? }
 */
export const createCommentApi = async (postId: number | string, commentData: CreateCommentInput): Promise<CreateCommentResponse> => {
    try {
        // POST /api/posts/:postId/comments
        // Token được tự động thêm bởi interceptor
        const response = await api.post<CreateCommentResponse>(`/posts/${postId}/comments`, commentData);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Create Comment (Post ID: ${postId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể gửi bình luận.');
    }
};