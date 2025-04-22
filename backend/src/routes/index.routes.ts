import { Router } from 'express';
import userRoutes from './user.routes';
import eventRoutes from './event.routes'; // Thêm sau

const router = Router();

// Tất cả các route trong user.routes.ts sẽ có tiền tố /users
// Ví dụ: /api/users/register
router.use('/users', userRoutes);
router.use('/events', eventRoutes); 

// Thêm các route khác sau này
// router.use('/events', eventRoutes);

export default router;