import ApiError from '../error/ApiError.js';
import { ParamsOfRequest } from '../types/requestTypes.js';

export const checkValidationOfLinkOtherwiseReturnLink = (params: ParamsOfRequest) => {
  const { link } = params;
  if (!link) {
    throw ApiError.badRequest('Ошибка запроса', null);
  }
  return link;
};
