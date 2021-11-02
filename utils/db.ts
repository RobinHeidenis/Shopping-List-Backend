import { ServerlessMysql } from "serverless-mysql";
import { config } from "../server/config/env.config";

require("dotenv").config();

const db: ServerlessMysql = require("serverless-mysql")({
  backoff: "decorrelated",
  base: 5,
  cap: 200,
  config: {
    database: config.db_old.name,
    user: config.db_old.username,
    password: config.db_old.password,
    host: config.db_old.ip,
  },
});

export const query = async (q: string, values: any[]): Promise<any> => {
  try {
    const results = await db.query(q, values);
    await db.end();
    return results;
  } catch (e: any) {
    throw Error(e.message);
  }
};
