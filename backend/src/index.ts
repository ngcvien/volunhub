import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './services/database.service';
import rootRouter from './routes/index.routes'; // Import root router
import errorMiddleware from './middlewares/error.middleware';
import './models/User.model'; // Import model User
import './models/Event.model'; // Import model Event
import './models/Participation.model'; // Import model Participation


// Tải biến môi trường
dotenv.config();

// Kết nối Database
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middlewares ---
// Cho phép truy cập từ mọi nguồn gốc (cần cấu hình chặt chẽ hơn cho production)
app.use(cors());
// Bảo mật cơ bản với các HTTP Headers
app.use(helmet());
// Log request ra console (format 'dev')
app.use(morgan('dev'));
// Parse request body dạng JSON
app.use(express.json());
// Parse request body dạng x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
// Route gốc để kiểm tra API hoạt động
app.get('/', (req: Request, res: Response) => {
  res.send('VolunHub API is running!');
});

// Gắn tất cả các route từ rootRouter với tiền tố /api
// Ví dụ: /api/users/register
app.use('/api', rootRouter);

// --- Error Handling Middleware ---
// Phải đặt SAU tất cả các routes và middlewares khác
app.use(errorMiddleware);

// --- Khởi động Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});