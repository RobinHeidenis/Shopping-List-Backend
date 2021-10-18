import { ServerlessMysql } from "serverless-mysql";

require("dotenv").config();

const db: ServerlessMysql = require("serverless-mysql")({
  backoff: "decorrelated",
  base: 5,
  cap: 200,
  config: {
    database: process.env.DB_NAME_OLD,
    user: process.env.DB_USERNAME_OLD,
    password: process.env.DB_PASSWORD_OLD,
    host: process.env.DB_IP_OLD,
  },
});

export const query = async (q: string, values: any[]) => {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (e) {
    throw Error(e.message);
  }
};
