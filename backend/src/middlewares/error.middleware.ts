// backend/src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => { // Thay Error thành any để nhận statusCode tùy chỉnh
  console.error("MIDDLEWARE LỖI:", err.message);
  // console.error(err.stack);

  // Ưu tiên statusCode gắn vào lỗi, nếu không có thì xét lỗi Sequelize hoặc mặc định 500
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi máy chủ nội bộ.';

  // Giữ lại các xử lý lỗi cụ thể nếu cần
  if (err.name === 'SequelizeValidationError' || err.message.includes('Validation error')) {
      statusCode = 400; // Bad Request cho lỗi validation
      message = `Lỗi validation: ${err.message}`;
  } else if (err.message.includes('đã tồn tại')) {
      statusCode = 409; // Conflict
  } else if (err.message.includes('không chính xác')) { // Lỗi login sai pass
       statusCode = 401; // Unauthorized
  }
  // Các lỗi 401, 403 từ authenticateToken sẽ được giữ nguyên statusCode

  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    message: message,
    stack: stack,
  });
};

export default errorMiddleware;