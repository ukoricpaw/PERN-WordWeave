import { Response } from 'express';
import { UserResponseType } from '../types/userTypes.js';

export const setCookiesToResponseByUserInfo = (user: UserResponseType, response: Response) => {
  response.cookie('accessToken', user.accessToken, { httpOnly: true, maxAge: 1000 * 60 * 30 });
  response.cookie('refreshToken', user.refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 });
};
