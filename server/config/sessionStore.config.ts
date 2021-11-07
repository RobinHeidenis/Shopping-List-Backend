import MySqlSessionStore = require("express-mysql-session");
import { config } from "./env.config";

const session = require("express-session");

const MysqlStore = MySqlSessionStore(session);

export const sessionStoreOptions: MySqlSessionStore.Options = {
  host: config.db.ip,
  port: 3306,
  user: config.db.username,
  password: config.db.password,
  database: "sessions",
  createDatabaseTable: true,
};

export const sessionStore = new MysqlStore(sessionStoreOptions);
