// frontend/src/api/event.api.ts
import api from './index';
import { GetAllEventsResponse, EventType, GetEventByIdResponse,EventPostType   } from '../types/event.types'; // Import kiểu dữ liệu response

type CreateEventInputApi = Omit<EventType, 'id' | 'creatorId' | 'creator' | 'createdAt' | 'updatedAt'>;

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

export const getAllEventsApi = async (triggerParam?: string | number): Promise<GetAllEventsResponse> => {
    try {
        // Thêm query parameter vào URL nếu có triggerParam
        const apiUrl = triggerParam ? `/events?_t=${triggerParam}` : '/events';
        // _t là tên query param tùy chọn, bạn có thể đặt tên khác
        console.log(`Calling API: ${apiUrl}`); // Log URL để kiểm tra
        const response = await api.get<GetAllEventsResponse>(apiUrl);
        console.log('API Response in getAllEventsApi:', response.data);
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