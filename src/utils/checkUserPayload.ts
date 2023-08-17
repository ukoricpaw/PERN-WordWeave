import UserDto from '../dtos/userDto.js';
import ApiError from '../error/ApiError.js';

export const checkUserPayload = (user: UserDto) => {
  if (!user) {
    throw ApiError.notAuthorized('Нет доступа', null);
  }
};
