import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index.js';

interface RoomAttributes {
  id: number;
  isGroup: boolean;
  avatar: string | null;
  description: string | null;
  name: string | null;
}

interface RoomInstance extends Model<RoomAttributes, Optional<RoomAttributes, 'id'>>, RoomAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const Room = sequelize.define<RoomInstance>('room', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  isGroup: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  description: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
  name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
});
