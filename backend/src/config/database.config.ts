import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_DATABASE!;
const dbUser = process.env.DB_USERNAME!;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST!;
const dbDialect = process.env.DB_DIALECT! as 'mysql';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: dbDialect,
    logging: false,
});