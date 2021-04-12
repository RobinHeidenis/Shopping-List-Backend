import { ServerlessMysql } from "serverless-mysql";

const db: ServerlessMysql = require("serverless-mysql")({
    backoff: "decorrelated",
    base: 5,
    cap: 200,
    config: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_IP,
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