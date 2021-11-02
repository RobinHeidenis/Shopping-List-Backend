import Joi from "joi";
import { loadConfig } from "./load-config";

const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("development", "test", "production")
      .default("development"),
    PORT: Joi.number().port().default(3001),
    DB_IP: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_IP_OLD: Joi.string().ip().required(),
    DB_NAME_OLD: Joi.string().required(),
    DB_USERNAME_OLD: Joi.string().required(),
    DB_PASSWORD_OLD: Joi.string().required(),
    accessTokenSecret: Joi.string().required(),
    refreshTokenSecret: Joi.string().required(),
    TEST_LOGIN_USERNAME: Joi.string().required(),
    TEST_LOGIN_PASSWORD: Joi.string().required(),
  })
  .unknown();

const env = loadConfig(schema);

export const config = {
  env: env.NODE_ENV as "development" | "test" | "production",
  port: env.PORT as number,
  db: {
    ip: env.DB_IP as string,
    name: env.DB_NAME as string,
    username: env.DB_USERNAME as string,
    password: env.DB_PASSWORD as string,
  },
  /**
   * @deprecated
   */
  db_old: {
    ip: env.DB_IP_OLD as string,
    name: env.DB_NAME_OLD as string,
    username: env.DB_USERNAME_OLD as string,
    password: env.DB_PASSWORD_OLD as string,
  },
  tokens: {
    access: env.accessTokenSecret as string,
    refresh: env.refreshTokenSecret as string,
  },
  test: {
    username: env.TEST_LOGIN_USERNAME as string,
    password: env.TEST_LOGIN_PASSWORD as string,
  },
};
