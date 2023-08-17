import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index.js';
import { FriendContact } from './FriendContact.js';
import { Op } from 'sequelize';
import { SearchUserParams } from '../types/userTypes.js';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  avatar: string | null;
  isActivated: boolean;
  activationLink: string | null;
}

export interface UserInstance extends Model<UserAttributes, Optional<UserAttributes, 'id'>>, UserAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

const User = sequelize.define<UserInstance>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  isActivated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  activationLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
});

User.prototype.getFriends = async function (params: SearchUserParams) {
  const friends = await FriendContact.findAll({
    where: {
      [Op.or]: [{ user1Id: this.id }, { user2Id: this.id }],
    },
    limit: params.limit,
    offset: params.limit * params.page - params.limit,
  });

  const friendsIds = friends.map(friend => (friend.user1Id === this.id ? friend.user2Id : friend.user1Id));

  const usersByFriendsIds = await User.findAndCountAll({
    where: {
      email: `%${params.search}%`,
      id: friendsIds,
    },
  });
  return usersByFriendsIds;
};

export { User };
