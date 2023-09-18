import { Response, NextFunction } from 'express';
import ApiError from '../error/ApiError.js';
import messagesService from '../services/messagesService.js';
import { RequestWithUserPayload } from '../types/userTypes.js';

class MessagesController {
  async getMessagesOfRoom(req: RequestWithUserPayload, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      let { limit, page } = req.query;
      if (!id) {
        throw ApiError.badRequest('Комната не найдена', null);
      }
      if (!req.user) {
        throw ApiError.notAuthorized('Пользователь не авторизован', null);
      }
      limit = limit || '20';
      page = page || '1';

      const messages = await messagesService.getMessagesByRoom(Number(id), Number(page), Number(limit));
      res.json(messages);
    } catch (err) {
      next(err);
    }
  }
}

export default new MessagesController();
