import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index.js';

interface MessageAttributes {
  id: number;
  text: string;
  isChanged: boolean;
  isFixed: boolean;
  dateOfFix: Date | null;
  receiverId: number;
  roomId: number;
}

export interface MessageInstance
  extends Model<MessageAttributes, Optional<MessageAttributes, 'id'>>,
    MessageAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const Message = sequelize.define<MessageInstance>('message', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
  text: { type: DataTypes.TEXT, allowNull: false },
  isChanged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  isFixed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  dateOfFix: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  receiverId: { type: DataTypes.INTEGER, allowNull: false },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
});
