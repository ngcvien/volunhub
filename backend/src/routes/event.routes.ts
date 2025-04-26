// backend/src/routes/event.routes.ts
import { Router } from 'express';
import eventController from '../controllers/event.controller';
import participationController from '../controllers/participation.controller';
import authenticateToken from '../middlewares/auth.middleware'; 
import { eventValidator } from '../middlewares/validation.middleware';
import optionalAuthenticateToken from '../middlewares/optionalAuth.middleware';

const router = Router();


router.get(
    '/',
    optionalAuthenticateToken, 
    eventController.getAll
);

router.post('/', authenticateToken, eventValidator, eventController.create);

router.post('/:eventId/join', authenticateToken, participationController.join);
router.delete('/:eventId/leave', authenticateToken, participationController.leave);

export default router;