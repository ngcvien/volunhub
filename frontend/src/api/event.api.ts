// frontend/src/api/event.api.ts
import api from './index';
import { GetAllEventsResponse, EventType } from '../types/event.types'; // Import kiểu dữ liệu response

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

export const getAllEventsApi = async (): Promise<GetAllEventsResponse> => {
    try {
        // Gọi đến GET /api/events của backend
        const response = await api.get<GetAllEventsResponse>('/events');
        console.log('API Response:', response.data); // Log để kiểm tra dữ liệu trả về
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
// --- KẾT THÚC PHẦN THÊM VÀO ---