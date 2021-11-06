import Joi from "joi";

const dotenv = require("dotenv");

dotenv.config();

const schema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("development", "test", "production")
      .default("development"),
    PORT: Joi.number().port().default(3001),
    DB_IP: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
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

const { value: env, error } = schema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

export interface EnvConfig {
  env: "development" | "test" | "production";
  port: number;
  db: {
    ip: string;
    name: string;
    username: string;
    password: string;
  };
  db_old: {
    ip: string;
    name: string;
    username: string;
    password: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
  test: {
    username: string;
    password: string;
  };
}

export const config: EnvConfig = {
  env: env.NODE_ENV,
  port: env.PORT,
  db: {
    ip: env.DB_IP,
    name: env.DB_NAME,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
  },
  /**
   * @deprecated
   */
  db_old: {
    ip: env.DB_IP_OLD,
    name: env.DB_NAME_OLD,
    username: env.DB_USERNAME_OLD,
    password: env.DB_PASSWORD_OLD,
  },
  tokens: {
    access: env.accessTokenSecret,
    refresh: env.refreshTokenSecret,
  },
  test: {
    username: env.TEST_LOGIN_USERNAME,
    password: env.TEST_LOGIN_PASSWORD,
  },
};
