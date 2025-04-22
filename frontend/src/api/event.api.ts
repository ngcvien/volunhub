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
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Lấy danh sách sự kiện:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách sự kiện.');
    }
};

// TODO: Thêm các hàm gọi API khác cho event sau (getById, create, join...)