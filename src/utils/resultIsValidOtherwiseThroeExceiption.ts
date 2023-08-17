import { Request } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../error/ApiError.js';

export const resultIsValidOtherwiseThrowException = (req: Request) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw ApiError.badRequest('Некорректные данные', result.array());
  }
  return true;
};
