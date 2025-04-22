// frontend/src/api/index.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THÊM INTERCEPTOR ---
// Tự động thêm token vào header Authorization cho mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
        if (token) {
            // Nếu có token, gắn vào header Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // Trả về config đã được sửa đổi (hoặc không)
    },
    (error) => {
        // Xử lý lỗi nếu có trong quá trình thiết lập request
        return Promise.reject(error);
    }
);
// --- KẾT THÚC THÊM INTERCEPTOR ---

// TODO: Có thể thêm response interceptor để xử lý lỗi 401 (token hết hạn) tự động logout sau này

export default api;