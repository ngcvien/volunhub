import { Request, Response, NextFunction } from 'express';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("MIDDLEWARE LỖI:", err.message); // Log lỗi ra console backend
  // console.error(err.stack); // Log cả stack trace nếu cần debug sâu

  let statusCode = 500;
  let message = 'Lỗi máy chủ nội bộ.';

  // Xử lý các loại lỗi cụ thể nếu cần
  if (err.message.includes('đã tồn tại')) {
      statusCode = 409; // Conflict
      message = err.message;
  } else if (err.message.includes('là bắt buộc') || err.message.includes('Lỗi validation')) {
      statusCode = 400; // Bad Request
      message = err.message;
  }
  // Thêm các xử lý lỗi khác ở đây (ví dụ: lỗi xác thực JWT, lỗi quyền truy cập...)

  // Chỉ gửi stack trace về client khi ở môi trường development
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    message: message,
    stack: stack, // Chỉ có giá trị khi development
  });
};

export default errorMiddleware;