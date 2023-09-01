import ApiError from '../error/ApiError.js';
import { RoomInstance } from '../models/Room.js';
import { User, UserInstance } from '../models/User.js';
import { CreateNewUserType, SearchUserParams, userExcludeAttributes } from '../types/userTypes.js';
import bcrypt from 'bcrypt';

class UserRepository {
  async checkCandidateForRegistration(email: string) {
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.badRequest('Пользователь с таким email уже существует', null);
    }
  }

  async checkCandidateForLogin(email: string) {
    const candidate = await User.findOne({ where: { email } });
    if (!candidate) {
      throw ApiError.badRequest('Пользователя с таким email не существует', null);
    }
    return candidate;
  }

  async checkCandidateById(id: number) {
    const candidate = await User.findOne({ where: { id } });
    if (!candidate) {
      throw ApiError.badRequest('Пользователя с таким id не существует', null);
    }
    return candidate;
  }

  async createNewUser(user: CreateNewUserType) {
    const newUser = User.create({
      email: user.email,
      password: user.password,
      activationLink: user.activationLink,
      isActivated: false,
    });

    return newUser;
  }

  async findUserById(id: number) {
    const user = User.findOne({ where: { id } });
    return user as Promise<UserInstance & { getFriends: (params: SearchUserParams) => Promise<UserInstance[]> }>;
  }

  async findUserByEmail(email: string) {
    const userContact = await User.findOne({
      where: { email },
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'activationLink', 'isActivated'],
      },
    });
    return userContact;
  }

  async comparePassword(password: string, hashedPassword: string) {
    const compared = await bcrypt.compare(password, hashedPassword);
    if (!compared) {
      throw ApiError.badRequest('Неверный пароль', null);
    }
  }

  async getUserByLink(link: string) {
    const user = await User.findOne({ where: { activationLink: link } });
    if (!user) {
      throw ApiError.badRequest('Ошибка запроса', null);
    }
    return user;
  }

  async findUserByRoomsIds(userId: number, room: RoomInstance) {
    const user = await User.findOne({
      where: {
        id: room.user1Id === userId ? room.user2Id : room.user1Id,
      },
      attributes: userExcludeAttributes,
    });
    return user;
  }
}

export default new UserRepository();
