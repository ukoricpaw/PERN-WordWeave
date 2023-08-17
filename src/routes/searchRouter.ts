import { Router } from 'express';
import { checkAuthMiddleware } from '../middlewares/checkAuthMiddleware.js';
import searchController from '../controllers/searchController.js';
import { MiddlewareType, RequestType } from '../types/requestTypes.js';

const searchRouter = Router();

searchRouter.get('/getusers', checkAuthMiddleware as MiddlewareType, searchController.getAllUsers as RequestType);
searchRouter.get(
  '/getfriendcontacts',
  checkAuthMiddleware as MiddlewareType,
  searchController.getAllFriends as RequestType,
);

export default searchRouter;
