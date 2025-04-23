// frontend/src/api/location.api.ts
import axios from 'axios'; // Dùng axios instance riêng hoặc axios gốc đều được
import { Province } from '../types/location.types'; // Import kiểu Province

const OPEN_API_BASE_URL = 'https://provinces.open-api.vn/api';

/**
 * Lấy danh sách Tỉnh/Thành phố từ Open API
 * @returns Promise chứa mảng các Province
 */
export const getProvincesApi = async (): Promise<Province[]> => {
    try {
        const response = await axios.get<Province[]>(`${OPEN_API_BASE_URL}/p/`);
        // API này trả về trực tiếp một mảng các tỉnh/thành
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
        throw new Error('Không thể tải danh sách tỉnh/thành phố.');
    }
};

/**
 * Lấy danh sách Quận/Huyện của một Tỉnh/Thành phố
 * @param provinceCode Mã code của tỉnh/thành
 * @returns Promise chứa mảng các District
 */
// export const getDistrictsApi = async (provinceCode: number): Promise<District[]> => { ... }; // Sẽ dùng sau cho Event

/**
 * Lấy danh sách Phường/Xã của một Quận/Huyện
 * @param districtCode Mã code của quận/huyện
 * @returns Promise chứa mảng các Ward
 */
// export const getWardsApi = async (districtCode: number): Promise<Ward[]> => { ... }; // Sẽ dùng sau cho Event