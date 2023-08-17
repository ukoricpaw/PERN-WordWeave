import { Response } from 'express';

export const clearCookie = (res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
};
