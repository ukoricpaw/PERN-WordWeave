import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/userController.js';

export const userRouter = Router();

userRouter.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 6, max: 20 }),
  userController.registration,
);
userRouter.post('/login', userController.login);
userRouter.get('/refresh', userController.refresh);
userRouter.get('/logout', userController.logout);
userRouter.get('/activate/:link', userController.activateEmail);
