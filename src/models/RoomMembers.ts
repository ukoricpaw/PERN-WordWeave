import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index.js';

interface RoomMembersAttributes {
  id: number;
  roomId: number;
  memberId: number;
}

interface RoomMembersInstance
  extends Model<RoomMembersAttributes, Optional<RoomMembersAttributes, 'id'>>,
    RoomMembersAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const RoomMembers = sequelize.define<RoomMembersInstance>('room_members', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  memberId: { type: DataTypes.INTEGER, allowNull: false },
});
