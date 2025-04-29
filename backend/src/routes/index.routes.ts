// backend/src/routes/index.routes.ts
import { Router } from 'express';
import userRoutes from './user.routes';
import eventRoutes from './event.routes';
import uploadRoutes from './upload.routes'; 
import postRoutes from './post.routes'; 
import adminRoutes from './admin.routes'; 


const router = Router();

router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/uploads', uploadRoutes); 
router.use('/posts', postRoutes);
router.use('/admin', adminRoutes);


export default router;