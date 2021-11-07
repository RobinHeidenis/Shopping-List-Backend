import { sessionStore } from "../../server/config/sessionStore.config";
import { DBInit, sequelize } from "../../server/db";
import { Category } from "../../server/models/category.model";

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

describe("DB Init Function", () => {
  it("should create two categories", async () => {
    await sequelize.sync({ force: true });
    expect(await Category.count()).toEqual(0);
    await DBInit();
    expect(await Category.count()).toEqual(2);
    await DBInit();
    expect(await Category.count()).toEqual(2);
  });
});
