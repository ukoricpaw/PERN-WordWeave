import { Router } from 'express';
import { userRouter } from './userRoutes.js';
import searchRouter from './searchRouter.js';
import messagesRouter from './messagesRouter.js';

export const ownRouter = Router();

ownRouter.use('/user', userRouter);
ownRouter.use('/search', searchRouter);
ownRouter.use('/messages', messagesRouter);
