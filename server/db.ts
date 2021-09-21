import { Sequelize } from 'sequelize-typescript';

require('dotenv').config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_IP,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  models: [`${__dirname}/models`],
  modelMatch: (filename, member) => filename.substring(0, filename.indexOf('.model')).toLowerCase() === member.toLowerCase(),
});
