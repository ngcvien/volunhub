// backend/src/routes/user.routes.ts
import { Router, Request, Response, NextFunction } from 'express';
import userController from '../controllers/user.controller';
import { registerValidator, loginValidator, updateProfileValidator } from '../middlewares/validation.middleware';
import authenticateToken from '../middlewares/auth.middleware'; 
import User from '../models/User.model'; 

const router = Router();

router.post(
  '/register',
  registerValidator, 
  userController.register
);

router.post(
  '/login',
  loginValidator, 
  userController.login );

  router.get(
    '/me',
    authenticateToken,
    userController.getMe 
);

router.put(
    '/me',
    authenticateToken,      
    updateProfileValidator,   
    userController.updateProfile 
);

// Route tìm kiếm phải đặt trước các route có params
router.get(
    '/search',
    authenticateToken,
    userController.searchUsers
);

// Route username phải đặt trước route userId
router.get(
  '/username/:username', 
  userController.getUserProfileByUsername 
);

router.get(
  '/me/events/created',
  authenticateToken,
  userController.getMyCreatedEvents 
);

router.get(
    '/leaderboard/volunteers',
    userController.getLeaderboard
);

// Route với param id phải đặt cuối cùng
router.get(
  '/:userId', 
  userController.getUserProfile 
);

export default router;