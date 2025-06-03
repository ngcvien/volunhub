// backend/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './services/database.service';
import rootRouter from './routes/index.routes';
import errorMiddleware from './middlewares/error.middleware';

// --- THÊM CÁC IMPORT CHO SOCKET.IO ---
import http from 'http'; // Module HTTP gốc của Node.js
import { Server as SocketIOServer, Socket } from 'socket.io'; // Import Server và Socket từ socket.io
import { verifyToken, DecodedToken } from './utils/jwt.util'; // Import hàm verifyToken và DecodedToken
// --- KẾT THÚC IMPORT ---

dotenv.config();
connectDB(); // Kết nối DB và setup associations

const app = express();
const PORT = process.env.PORT || 4000;

// --- Tạo HTTP Server từ Express app ---
const httpServer = http.createServer(app); // <<<--- THAY ĐỔI QUAN TRỌNG

// --- Khởi tạo Socket.IO Server ---
// Cấu hình CORS cho Socket.IO để frontend (ví dụ: localhost:5173) có thể kết nối
export const io = new SocketIOServer(httpServer, { // <<<--- EXPORT io ĐỂ DÙNG Ở SERVICE
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL của frontend
        methods: ["GET", "POST"]
    }
});
// --- KẾT THÚC KHỞI TẠO SOCKET.IO ---


// Middlewares của Express (giữ nguyên)
app.use(cors()); // CORS cho HTTP requests
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes của Express (giữ nguyên)
app.get('/', (req: Request, res: Response) => { res.send('VolunHub API is running!'); });
app.use('/api', rootRouter);

// Error Handling Middleware của Express (giữ nguyên)
app.use(errorMiddleware);


// --- XỬ LÝ SOCKET.IO ---

// Middleware xác thực cho Socket.IO (chạy cho mỗi kết nối mới)
io.use((socket: Socket, next) => {
    // Client sẽ gửi token qua socket.handshake.auth.token
    const token = socket.handshake.auth.token as string | undefined;

    if (token) {
        const decoded = verifyToken(token); // Dùng hàm verifyToken đã có
        if (decoded && decoded.userId) {
            // Gắn thông tin user vào socket để sử dụng sau này
            (socket as any).user = { userId: decoded.userId, email: decoded.email }; // Ép kiểu socket
            console.log(`SOCKET: User ${decoded.userId} authenticated for socket ${socket.id}`);
            return next();
        } else {
            console.log('SOCKET: Authentication error - Invalid token');
            return next(new Error('Authentication error: Invalid token'));
        }
    } else {
        console.log('SOCKET: Authentication error - No token provided');
        return next(new Error('Authentication error: No token provided'));
    }
});

// Lắng nghe sự kiện 'connection' từ client
io.on('connection', (socket: Socket) => {
    const connectedUser = (socket as any).user; // Lấy thông tin user đã xác thực
    console.log(`SOCKET: User ${connectedUser?.userId} connected with socket ID ${socket.id}`);

    // Lắng nghe sự kiện client tham gia một cuộc trò chuyện
    socket.on('join_conversation', (conversationId: string | number) => {
        const roomName = `conversation_${conversationId}`;
        socket.join(roomName); // Cho socket này tham gia vào "phòng" của cuộc trò chuyện
        console.log(`SOCKET: User ${connectedUser?.userId} (socket ${socket.id}) joined room ${roomName}`);
        // Có thể emit lại cho client biết đã join thành công
        // socket.emit('joined_conversation_success', { conversationId });
    });

    // Lắng nghe sự kiện client rời một cuộc trò chuyện (nếu cần)
    socket.on('leave_conversation', (conversationId: string | number) => {
        const roomName = `conversation_${conversationId}`;
        socket.leave(roomName);
        console.log(`SOCKET: User ${connectedUser?.userId} (socket ${socket.id}) left room ${roomName}`);
    });

    // Lắng nghe sự kiện client gửi tin nhắn (nếu bạn muốn gửi qua socket thay vì HTTP)
    // socket.on('send_message_socket', async (data) => {
    //     // data = { conversationId, content, messageType, mediaUrl }
    //     // Tương tự như logic trong MessageController.sendMessage
    //     // Gọi messageService.createMessage, sau đó io.to(room).emit('new_message', ...)
    // });

    // Xử lý khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log(`SOCKET: User ${connectedUser?.userId} (socket ${socket.id}) disconnected`);
        // Có thể thêm logic xử lý user offline ở đây
    });
});
// --- KẾT THÚC XỬ LÝ SOCKET.IO ---


// --- Khởi động HTTP Server (thay vì app.listen) ---
httpServer.listen(PORT,() => { // <<<--- DÙNG httpServer.listen
    console.log(`🚀 Server (HTTP & WebSocket) is running on http://localhost:${PORT}`);
});