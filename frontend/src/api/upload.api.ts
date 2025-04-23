// frontend/src/api/upload.api.ts
import api from './index'; // Import instance axios đã cấu hình interceptor

// Kiểu dữ liệu trả về từ API upload (theo code controller trước đó)
interface UploadResponse {
    message: string;
    url: string; // URL của file trên Cloudinary
    fileType: 'image' | 'video';
    publicId: string;
}

/**
 * Gọi API để tải một file lên Cloudinary thông qua backend
 * @param file Đối tượng File cần tải lên
 * @returns Promise chứa thông tin file đã upload
 */
export const uploadFileApi = async (file: File): Promise<UploadResponse> => {
    // Dùng FormData để gửi file
    const formData = new FormData();
    formData.append('file', file);

    try {
        
        const response = await api.post<UploadResponse>('/uploads', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Lỗi API Upload File:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Tải file lên thất bại.');
    }
};