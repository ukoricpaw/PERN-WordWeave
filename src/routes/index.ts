import { Router } from 'express';
import { userRouter } from './userRoutes.js';

export const ownRouter = Router();

ownRouter.use('/user', userRouter);
