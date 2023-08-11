import { Request, Response, NextFunction } from 'express';
import ApiError from '../error/ApiError.js';
import { validationResult } from 'express-validator';
import userService from '../services/userService.js';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        throw ApiError.badRequest('Некорректные данные', result.array());
      }
      const { email, password } = req.body;
      if (!email || !password) {
        throw ApiError.badRequest('Некорректные данные', null);
      }
      const user = await userService.registration(email, password);
      res.cookie('accessToken', user.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.cookie('refreshToken', user.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
      res.json(user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw ApiError.badRequest('Некорректные данные', null);
      }
      const user = await userService.login(email, password);
      res.cookie('accessToken', user.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.cookie('refreshToken', user.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.notAuthorized('Пользователь не авторизован', null);
      }
      const user = await userService.refresh(refreshToken);
      res.cookie('accessToken', user.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 30 });
      res.cookie('refreshToken', user.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
      res.json(user);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw ApiError.notAuthorized('Пользователь не авторизован', null);
      }
      const message = await userService.logout(refreshToken);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json(message);
    } catch (err) {
      next(err);
    }
  }

  async activateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { link } = req.params;
      if (!link) {
        throw ApiError.badRequest('Ошибка запроса', null);
      }
      const message = await userService.activateAccoutByLink(link);
      res.json(message);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
