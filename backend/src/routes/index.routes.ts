// backend/src/routes/index.routes.ts
import { Router } from 'express';
import userRoutes from './user.routes';
import eventRoutes from './event.routes';
import uploadRoutes from './upload.routes'; // <<<--- IMPORT UPLOAD ROUTES

const router = Router();

router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/uploads', uploadRoutes); // <<<--- SỬ DỤNG UPLOAD ROUTES VỚI TIỀN TỐ /uploads

export default router;