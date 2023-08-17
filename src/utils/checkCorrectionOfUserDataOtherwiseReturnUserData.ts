import ApiError from '../error/ApiError.js';
import { BodyOfRequest } from '../types/requestTypes.js';

export const checkCorrectionOfUserDataOtherwiseReturnUserData = ({ email, password }: BodyOfRequest) => {
  if (!email || !password) {
    throw ApiError.badRequest('Некорректные данные', null);
  }
  return { email, password };
};
