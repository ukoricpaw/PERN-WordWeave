import { NextFunction, Response } from 'express';
import { RequestWithUserPayload } from '../types/userTypes.js';
import ApiError from '../error/ApiError.js';
import userActionsService from '../services/userActionsService.js';

class UserActionsController {
  async makeFriendsWith(req: RequestWithUserPayload, res: Response, next: NextFunction) {
    try {
      const { userId } = req.body;
      if (!req.user || !userId) {
        throw ApiError.badRequest('Ошибка запроса', null);
      }
      const message = await userActionsService.makeFriendsWith({ possibleFriendId: userId, userId: req.user.id });
      res.json(message);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserActionsController();
