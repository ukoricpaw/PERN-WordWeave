import { Op } from 'sequelize';
import { User } from '../models/User.js';
import { SearchUserParams } from '../types/userTypes.js';

class SearchRepository {
  async getAllUsersExceptRequestedUser(userParams: SearchUserParams) {
    const users = await User.findAndCountAll({
      where: {
        email: {
          [Op.like]: `%${userParams.search}%`,
        },
        id: {
          [Op.ne]: userParams.userId,
        },
      },
      attributes: {
        exclude: ['activationLink', 'password', 'isActivated', 'createdAt', 'updatedAt'],
      },
      limit: userParams.limit,
      offset: userParams.page * userParams.limit - userParams.limit,
    });
    return users;
  }
}

export default new SearchRepository();
