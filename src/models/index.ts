import { Sequelize } from 'sequelize';
const { DB_NAME, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

export const sequelize = new Sequelize(String(DB_NAME), String(DB_USERNAME), String(DB_PASSWORD), {
  port: Number(DB_PORT),
  host: DB_HOST as string,
  dialect: 'postgres',
});
