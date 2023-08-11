import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index.js';

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

export const User = sequelize.define<UserInstance>('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  isActivated: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  activationLink: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
});
