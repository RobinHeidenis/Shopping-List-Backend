import { Sequelize } from "sequelize-typescript";
import { sequelizeOptions } from "./config/sequelize.config";
import { Logger } from "./logging/logger";
import { Category } from "./models/category.model";
import { seedDatabase } from "./seeders/seeder";

export const sequelize = new Sequelize(sequelizeOptions);

export async function DBInit(): Promise<void> {
  await sequelize.authenticate().catch((e) => {
    Logger.error(e);
    process.kill(process.pid, "SIGTERM");
  });

  try {
    await Category.count();
  } catch {
    await sequelize.sync({ force: true });
    await DBInit();
    return;
  }

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
