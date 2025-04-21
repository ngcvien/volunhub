import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lấy URL từ biến môi trường Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: Thêm interceptors để tự động gắn token vào header cho các request cần xác thực sau này
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('authToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;