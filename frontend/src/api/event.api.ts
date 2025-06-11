// frontend/src/api/event.api.ts
import api from './index';
import { GetAllEventsResponse, EventType, GetEventByIdResponse,EventPostType, EventImageInfo   } from '../types/event.types'; // Import kiểu dữ liệu response

type CreateEventInputApi = Omit<EventType, 'id' | 'creatorId' | 'creator' | 'createdAt' | 'updatedAt' | 'images' | 'isParticipating' | 'isLiked' | 'likeCount' | 'participantCount' | 'posts' | 'status'> & {
    imageUrls?: string[]; 
};
// Kiểu dữ liệu response khi tạo event thành công (giả sử trả về event mới)
interface CreateEventResponse {
    message: string;
    event: EventType;
}

export const createEventApi = async (eventData: CreateEventInputApi): Promise<CreateEventResponse> => {
    try {
        // Request POST đến /api/events
        // Axios interceptor sẽ tự động thêm header Authorization
        const response = await api.post<CreateEventResponse>('/events', eventData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Tạo sự kiện:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tạo sự kiện.');
    }
};

// Hàm mới: nhận object filter
export const getAllEventsApi = async (filters: Record<string, any> = {}): Promise<GetAllEventsResponse> => {
    try {
        // Build query string từ object filters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, value);
            }
        });
        const apiUrl = `/events${params.toString() ? `?${params.toString()}` : ""}`;
        const response = await api.get<GetAllEventsResponse>(apiUrl);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Lấy danh sách sự kiện:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách sự kiện.');
    }
};

// TODO: Thêm các hàm gọi API khác cho event sau (getById, create, join...)
// --- THÊM ĐOẠN CODE NÀY VÀO CUỐI FILE event.api.ts ---

// Hàm gọi API để tham gia sự kiện
export const joinEventApi = async (eventId: number): Promise<{ message: string }> => { // Giả sử backend trả về message
    try {
        // Request POST đến /api/events/:eventId/join
        // Axios interceptor sẽ tự động thêm header Authorization
        const response = await api.post<{ message: string }>(`/events/${eventId}/join`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Tham gia sự kiện (ID: ${eventId}):`, error.response?.data || error.message);
        // Trả về message lỗi từ backend nếu có
        throw new Error(error.response?.data?.message || 'Không thể tham gia sự kiện.');
    }
};

// Hàm gọi API để rời khỏi sự kiện
export const leaveEventApi = async (eventId: number): Promise<{ message: string }> => { // Giả sử backend trả về message
    try {
        // Request DELETE đến /api/events/:eventId/leave
        // Axios interceptor sẽ tự động thêm header Authorization
        const response = await api.delete<{ message: string }>(`/events/${eventId}/leave`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Rời sự kiện (ID: ${eventId}):`, error.response?.data || error.message);
        // Trả về message lỗi từ backend nếu có
        throw new Error(error.response?.data?.message || 'Không thể rời khỏi sự kiện.');
    }
};

// --- THÊM HÀM LIKE/UNLIKE EVENT API ---

/**
 * Gọi API để Thích một sự kiện
 * @param eventId ID của sự kiện cần thích
 * @returns Promise chứa message từ server
 */
export const likeEventApi = async (eventId: number): Promise<{ message: string }> => {
    try {
        // Request POST đến /api/events/:eventId/like
        // Token được tự động thêm bởi interceptor
        const response = await api.post<{ message: string }>(`/events/${eventId}/like`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Thích sự kiện (ID: ${eventId}):`, error.response?.data || error.message);
        // Ném lại lỗi để component xử lý UI
        throw new Error(error.response?.data?.message || 'Không thể thích sự kiện này.');
    }
};

/**
 * Gọi API để Bỏ thích một sự kiện
 * @param eventId ID của sự kiện cần bỏ thích
 * @returns Promise chứa message từ server
 */
export const unlikeEventApi = async (eventId: number): Promise<{ message: string }> => {
    try {
        // Request DELETE đến /api/events/:eventId/like
        // Token được tự động thêm bởi interceptor
        const response = await api.delete<{ message: string }>(`/events/${eventId}/like`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Bỏ thích sự kiện (ID: ${eventId}):`, error.response?.data || error.message);
         // Ném lại lỗi để component xử lý UI
        throw new Error(error.response?.data?.message || 'Không thể bỏ thích sự kiện này.');
    }
};

export const getEventByIdApi = async (eventId: string | number): Promise<GetEventByIdResponse> => {
    try {
        // Request GET đến /api/events/:eventId
        // Token sẽ tự được thêm nếu có (nhờ interceptor), giúp backend trả về isLiked/isParticipating
        const response = await api.get<GetEventByIdResponse>(`/events/${eventId}`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Get Event By ID (${eventId}):`, error.response?.data || error.message);
        if (error.response?.status === 404) {
            throw new Error('Sự kiện không tồn tại.');
        }
        throw new Error(error.response?.data?.message || 'Không thể tải chi tiết sự kiện.');
    }
};


// Kiểu dữ liệu cho data gửi lên API khi tạo post
interface CreateEventPostInput {
    content: string;
}

// Kiểu dữ liệu cho response trả về từ API tạo post
// Giả sử backend trả về bài post mới kèm thông tin author đã được include
interface CreateEventPostResponse {
    message: string;
    post: EventPostType;
}

/**
 * Gọi API để tạo bài viết mới trong một sự kiện
 * @param eventId ID của sự kiện (kiểu string hoặc number từ URL)
 * @param postData Dữ liệu bài viết (chỉ có content)
 * @returns Promise chứa thông tin bài viết mới đã tạo
 */
export const createEventPostApi = async (
    eventId: string | number,
    postData: {content: string} 
): Promise<CreateEventPostResponse> => {
    try {
        return api.post(`/events/${eventId}/posts`, postData);

    } catch (error: any) {
        console.error(`Lỗi API Tạo bài viết sự kiện (ID: ${eventId}):`, error.response?.data || error.message);
        // Ném lỗi để component frontend (EventDetailPage) có thể bắt và xử lý
        throw new Error(error.response?.data?.message || 'Không thể đăng bài viết của bạn vào lúc này.');
    }
};

interface CreatedEvent extends Omit<EventType, 'participants' | 'posts' | 'isLiked' | 'isParticipating' | 'creator'> { // Loại bỏ các trường không cần thiết cho list này
    participantCount: number;
}

interface GetMyCreatedEventsResponse {
    message: string;
    events: CreatedEvent[];
}

/**
 * Lấy danh sách sự kiện do người dùng hiện tại tạo
 */
export const getMyCreatedEventsApi = async (): Promise<GetMyCreatedEventsResponse> => {
    try {
        // GET /api/users/me/events/created
        // Token được tự động thêm bởi interceptor
        const response = await api.get<GetMyCreatedEventsResponse>('/users/me/events/created');
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Get My Created Events:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách sự kiện đã tạo.');
    }
};


/**
 * Lấy danh sách người tham gia cho một sự kiện (dùng cho trang quản lý của creator)
 * @param eventId ID của sự kiện
 * @returns Promise chứa danh sách người tham gia chi tiết
 */
export const getParticipantsForEventManagementApi = async (eventId: number | string): Promise<GetParticipantsResponse> => {
    try {
        // GET /api/events/:eventId/participants/manage
        // Token được tự động thêm bởi interceptor
        const response = await api.get<GetParticipantsResponse>(`/events/${eventId}/participants/manage`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Get Participants for Management (Event ID: ${eventId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách người tham gia.');
    }
};

/**
 * Người tổ chức xác nhận tình nguyện viên đã hoàn thành sự kiện
 * @param eventId ID của sự kiện
 * @param participantUserId ID của tình nguyện viên được xác nhận
 * @returns Promise chứa thông báo thành công
 */
export const confirmParticipantApi = async (eventId: number | string, participantUserId: number | string): Promise<ConfirmParticipantResponse> => {
    try {
        // POST /api/events/:eventId/participants/:participantUserId/confirm
        // Token được tự động thêm bởi interceptor
        // Không cần gửi body
        const response = await api.post<ConfirmParticipantResponse>(`/events/${eventId}/participants/${participantUserId}/confirm`);
        return response.data;
    } catch (error: any) {
        console.error(`Lỗi API Confirm Participant (Event: ${eventId}, User: ${participantUserId}):`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể xác nhận tình nguyện viên.');
    }
};
