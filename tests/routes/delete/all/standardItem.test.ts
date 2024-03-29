import { sequelize } from "../../../../server/db";
import { app, sessionStore } from "../../../../server";
import { seedDatabase } from "../../../../server/seeders/seeder";
import { StandardItem } from "../../../../server/models/standardItem.model";

const request = require("supertest");

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe("Standard item DELETE-all endpoint success", () => {
  it("should successfully delete all standard items", async () => {
    await StandardItem.create({ name: "test1", categoryId: 1 });
    await StandardItem.create({ name: "test2", categoryId: 1 });
    await StandardItem.create({ name: "test3", categoryId: 1 });

    expect(await StandardItem.count()).toEqual(3);

    const res = await request(app).delete("/api/v2/standardItem/all");
    expect(res.statusCode).toEqual(204);

    expect(await StandardItem.count()).toEqual(0);
  });
});
