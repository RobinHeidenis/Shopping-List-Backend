import { Sequelize } from "sequelize-typescript";
import { config } from "./config/env.config";
import { Logger } from "./logging/logger";
import { Category } from "./models/category.model";
import { seedDatabase } from "./seeders/seeder";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: config.db.ip,
  database: config.env === "test" ? "shoppinglist_test" : config.db.name,
  port: config.env === "test" ? 3305 : 3306,
  username: config.db.username,
  password: config.db.password,
  models: [`${__dirname}/models`],
  modelMatch: (filename, member) =>
    filename.substring(0, filename.indexOf(".model")).toLowerCase() ===
    member.toLowerCase(),
  logging: config.env === "test" ? false : Logger.query,
});

export async function DBInit(): Promise<void> {
  await sequelize.authenticate().catch((e) => {
    Logger.error(e);
    process.kill(process.pid, "SIGTERM");
  });

  const categoryCount = await Category.count().catch((e) => {
    Logger.error(e);
    sequelize.sync({ force: true });
  });

  if (categoryCount === 0) {
    await sequelize
      .sync({ force: true })
      .then(() => Logger.success("All models were synchronized successfully."))
      .then(async () => {
        Logger.info("Seeding database");
        await seedDatabase();
      })
      .catch((e) => {
        Logger.error(e);
      });
  } else {
    await sequelize
      .sync()
      .then(() => Logger.success("All models were synchronized successfully."))
      .catch((e) => {
        Logger.error(e);
      });
  }
}
