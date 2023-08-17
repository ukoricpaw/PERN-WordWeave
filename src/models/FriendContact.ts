import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index.js';

interface FriendContactAttributes {
  user1Id: number;
  user2Id: number;
}

interface FriendContactInstance extends Model<FriendContactAttributes>, FriendContactAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const FriendContact = sequelize.define<FriendContactInstance>('friend_contact', {
  user1Id: { type: DataTypes.INTEGER, allowNull: false },
  user2Id: { type: DataTypes.INTEGER, allowNull: false },
});
