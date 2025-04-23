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
export default router;