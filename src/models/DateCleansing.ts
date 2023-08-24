import { Model, Optional, DataTypes } from 'sequelize';
import { sequelize } from './index.js';

interface DateCleansingAttributes {
  id: number;
  roomId: number;
  userId: number;
  date: Date;
}

interface DateCleansingInstance
  extends Model<DateCleansingAttributes, Optional<DateCleansingAttributes, 'id'>>,
    DateCleansingAttributes {
  createdAt?: Date;
  updatedAt?: Date;
}

export const DateCleansing = sequelize.define<DateCleansingInstance>('date_cleansing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
  roomId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
});
