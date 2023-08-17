import { NextFunction, Response } from 'express';
import { RequestWithUserPayload } from '../types/userTypes.js';
import searchService from '../services/searchService.js';
import { checkUserPayload } from '../utils/checkUserPayload.js';
import { createSearchParamsByQuery } from '../utils/createSearchParamsByQuery.js';

class SearchController {
  async getAllUsers(req: RequestWithUserPayload, res: Response, next: NextFunction) {
    try {
      checkUserPayload(req.user);
      const userParams = createSearchParamsByQuery(req.query, req.user.id);
      const users = await searchService.getAllUsersWithoutUserThatRequested(userParams);
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
}

export default new SearchController();
