import UserDto from '../dtos/userDto.js';
import jwt from 'jsonwebtoken';
import { Token } from '../models/Token.js';
import ApiError from '../error/ApiError.js';

class TokenService {
  createTokens(userInfo: UserDto) {
    const accessToken = jwt.sign({ ...userInfo }, String(process.env.ACCESS_KEY), { expiresIn: '30m' });
    const refreshToken = jwt.sign({ ...userInfo }, String(process.env.REFRESH_KEY), { expiresIn: '30d' });
    return { accessToken, refreshToken };
  }

  async addOrChangeRefreshTokenInDatabase(refreshToken: string, userId: number) {
    let candidateToken = await Token.findOne({ where: { userId } });
    if (candidateToken) {
      candidateToken.refreshToken = refreshToken;
    } else {
      candidateToken = await Token.create({ refreshToken, userId });
    }
    await candidateToken.save();
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const verified = jwt.verify(refreshToken, String(process.env.REFRESH_KEY));
      return verified as UserDto;
    } catch (err) {
      throw ApiError.notAuthorized('Пользователь не авторизован', null);
    }
  }

  validateAccessToken(accessToken: string) {
    try {
      const verified = jwt.verify(accessToken, String(process.env.ACCESS_KEY));
      return verified as UserDto;
    } catch (err) {
      return null;
    }
  }

  async deleteTokenFromDatabase(refreshToken: string, userId: number) {
    const token = await Token.findOne({ where: { refreshToken, userId } });
    if (!token) {
      throw ApiError.notAuthorized('Пользователь не авторизован', null);
    }
    await token.destroy();
    return { message: 'Пользователь вышел из системы' };
  }
}

export default new TokenService();
