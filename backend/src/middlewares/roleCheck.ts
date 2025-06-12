import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }
  next();
}; 