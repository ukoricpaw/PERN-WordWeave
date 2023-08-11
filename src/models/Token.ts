import { Optional, Model, DataTypes } from 'sequelize';
import { sequelize } from './index.js';

interface TokenAttributes {
  id: number;
  userId: number;
  refreshToken: string;
}

interface TokenInstance extends Model<TokenAttributes, Optional<TokenAttributes, 'id'>>, TokenAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const Token = sequelize.define<TokenInstance>('token', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  refreshToken: { type: DataTypes.STRING, allowNull: false },
});
