import ApiError from '../error/ApiError.js';
import { CookiesOfRequest } from '../types/requestTypes.js';

export const checkRefreshTokenIfIsNotEmptyReturnToken = ({ refreshToken }: CookiesOfRequest) => {
  if (!refreshToken) {
    throw ApiError.notAuthorized('Пользователь не авторизован', null);
  }
  return refreshToken;
};
