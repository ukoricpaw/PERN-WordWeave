import { Response, NextFunction } from 'express';
import tokenService from '../services/tokenService.js';
import { RequestWithUserPayload } from '../types/userTypes.js';

export const checkAuthMiddleware = (req: RequestWithUserPayload, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'OPTIONS') {
      next();
    } else {
      const { accessToken } = req.cookies;
      if (!accessToken) {
        throw new Error();
      }
      const verified = tokenService.validateAccessToken(accessToken);
      if (!verified) {
        throw new Error();
      }
      req.user = verified;
      next();
    }
  } catch (err) {
    res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};
