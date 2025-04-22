// frontend/src/api/event.api.ts
import api from './index';
import { GetAllEventsResponse } from '../types/event.types'; // Import kiểu dữ liệu response

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