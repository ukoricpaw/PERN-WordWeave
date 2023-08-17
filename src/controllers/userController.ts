import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService.js';
import { checkCorrectionOfUserDataOtherwiseReturnUserData } from '../utils/checkCorrectionOfUserDataOtherwiseReturnUserData.js';
import { checkRefreshTokenIfIsNotEmptyReturnToken } from '../utils/checkRefreshTokenIfIsNotEmptyReturnToken.js';
import { setCookiesToResponseByUserInfo } from '../utils/setCookiesToResponseByUserInfo.js';
import { resultIsValidOtherwiseThrowException } from '../utils/resultIsValidOtherwiseThroeExceiption.js';
import { checkValidationOfLinkOtherwiseReturnLink } from '../utils/checkValidationOfLinkOtherwiseReturnLink.js';
import { clearCookie } from '../utils/clearCookie.js';

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      resultIsValidOtherwiseThrowException(req);
      const { email, password } = checkCorrectionOfUserDataOtherwiseReturnUserData(req.body);
      const user = await userService.registration(email, password);
      setCookiesToResponseByUserInfo(user, res);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = checkCorrectionOfUserDataOtherwiseReturnUserData(req.body);
      const user = await userService.login(email, password);
      setCookiesToResponseByUserInfo(user, res);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = checkRefreshTokenIfIsNotEmptyReturnToken(req.cookies);
      const user = await userService.refresh(refreshToken);
      setCookiesToResponseByUserInfo(user, res);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = checkRefreshTokenIfIsNotEmptyReturnToken(req.cookies);
      const message = await userService.logout(refreshToken);
      clearCookie(res);
      res.json(message);
    } catch (err) {
      next(err);
    }
  }

  async activateEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const link = checkValidationOfLinkOtherwiseReturnLink(req.params);
      const message = await userService.activateAccoutByLink(link);
      res.json(message);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
