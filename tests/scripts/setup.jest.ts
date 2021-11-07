import { sessionStore } from "../../server/config/sessionStore.config";
import { sequelize } from "../../server/db";

global.beforeEach(async () => {
  await sequelize.sync({ force: true });
});
global.afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});
