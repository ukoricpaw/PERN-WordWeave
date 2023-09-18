import { Router } from 'express';
import { checkAuthMiddleware } from '../middlewares/checkAuthMiddleware.js';
import messagesController from '../controllers/messagesController.js';
import { MiddlewareType, RequestType } from '../types/requestTypes.js';

const messagesRouter = Router();

messagesRouter.get(
  '/:roomId',
  checkAuthMiddleware as MiddlewareType,
  messagesController.getMessagesOfRoom as RequestType,
);

export default messagesRouter;
