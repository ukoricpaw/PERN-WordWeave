import userRepository from '../repositories/userRepository.js';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import UserDto from '../dtos/userDto.js';
import tokenService from './tokenService.js';
import mailService from './mailService.js';
import { UserInstance } from '../models/User.js';
import { UserResponseType } from '../types/userTypes.js';
import ApiError from '../error/ApiError.js';

class UserService {
  async registration(email: string, password: string): Promise<UserResponseType> {
    await userRepository.checkCandidateForRegistration(email);
    const newPassword = await bcrypt.hash(password, 5);
    const activationLink = v4();
    const newUser = await userRepository.createNewUser({ email, password: newPassword, activationLink });
    const { tokenData, userDto } = await this.createTokenDataForUser(newUser);
    mailService.sendMail(email, activationLink);
    return { accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken, user: { ...userDto } };
  }

  async login(email: string, password: string): Promise<UserResponseType> {
    const candidate = await userRepository.checkCandidateForLogin(email);
    await userRepository.comparePassword(password, candidate.password);
    const { tokenData, userDto } = await this.createTokenDataForUser(candidate);
    return { accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken, user: { ...userDto } };
  }

  async createTokenDataForUser(newUser: UserInstance) {
    const userDto = new UserDto(newUser);
    const tokenData = tokenService.createTokens(userDto);
    await tokenService.addOrChangeRefreshTokenInDatabase(tokenData.refreshToken, newUser.id);
    return { tokenData, userDto };
  }

  async checkTokenValidationAndUser(refreshToken: string) {
    const verified = tokenService.validateRefreshToken(refreshToken);
    const user = await userRepository.findUserById(verified.id);
    if (!user) {
      throw ApiError.notAuthorized('Пользователя не существует', null);
    }
    return user;
  }

  async refresh(refreshToken: string) {
    const user = await this.checkTokenValidationAndUser(refreshToken);
    const { tokenData, userDto } = await this.createTokenDataForUser(user);
    return { accessToken: tokenData.accessToken, refreshToken: tokenData.refreshToken, user: { ...userDto } };
  }

  async logout(refreshToken: string) {
    const user = await this.checkTokenValidationAndUser(refreshToken);
    const message = await tokenService.deleteTokenFromDatabase(refreshToken, user.id);
    return message;
  }

  async activateAccoutByLink(link: string) {
    const user = await userRepository.getUserByLink(link);
    user.activationLink = null;
    user.isActivated = true;
    await user.save();
    return { message: 'Аккаунт активирован' };
  }
}

export default new UserService();
