import { Request } from 'express';
import UserDto from '../dtos/userDto.js';

export type CreateNewUserType = {
  email: string;
  password: string;
  activationLink: string;
};

export interface UserResponseType {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface RequestWithUserPayload extends Request {
  user: UserDto;
}

export type SearchUserParams = {
  limit: number;
  page: number;
  search: string;
  userId: number;
};

export type UserSessionParams = {
  userId: number;
};

export const userExcludeAttributes = {
  exclude: ['password', 'isActivated', 'activationLink', 'createdAt', 'updatedAt'],
};

export type UserType = {
  email: string;
  id: number;
};
