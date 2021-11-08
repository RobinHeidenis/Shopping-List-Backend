import { SequelizeOptions } from "sequelize-typescript";
import { Logger } from "../logging/logger";
import { config } from "./env.config";

export const sequelizeOptions: SequelizeOptions = {
  dialect: "mysql",
  host: config.db.ip,
  database: config.env === "test" ? "shoppinglist_test" : config.db.name,
  port: config.env === "test" ? 3305 : 3306,
  username: config.db.username,
  password: config.db.password,
  models: [`${__dirname}/../models`],
  modelMatch: (filename, member) =>
    filename.substring(0, filename.indexOf(".model")).toLowerCase() ===
    member.toLowerCase(),
  logging: config.env === "test" ? false : Logger.query,
};
