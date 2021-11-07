import { app } from "../../../../server";
import { sessionStore } from "../../../../server/config/sessionStore.config";
import { sequelize } from "../../../../server/db";
import { Item } from "../../../../server/models/item.model";
import { seedDatabase } from "../../../../server/seeders/seeder";

const request = require("supertest");

jest.mock("http-terminator");

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe("Item DELETE-all endpoint success", () => {
  it("should successfully delete all items", async () => {
    await Item.create({
      name: "test1",
      sequence: 1,
      categoryId: 1,
    });
    await Item.create({
      name: "test2",
      sequence: 2,
      categoryId: 1,
    });
    await Item.create({
      name: "test3",
      sequence: 3,
      categoryId: 1,
    });

    expect(await Item.count()).toEqual(3);

    const res = await request(app).delete("/api/v2/item/all");
    expect(res.statusCode).toEqual(204);

    expect(await Item.count()).toEqual(0);
  });
});
