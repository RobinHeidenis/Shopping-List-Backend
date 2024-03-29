import { sequelize } from "../../../server/db";
import { seedDatabase } from "../../../server/seeders/seeder";
import { app, sessionStore } from "../../../server";
import { Item } from "../../../server/models/item.model";

const request = require("supertest");

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe("Item DELETE endpoint success", () => {
  beforeEach(async () => {
    await Item.create({
      name: "test",
      quantity: "test",
      url: "test",
      categoryId: 1,
      sequence: 1,
    });
  });

  it("should delete item 1", async () => {
    let res = await request(app).delete("/api/v2/item/1");
    expect(res.statusCode).toEqual(204);

    res = await request(app).get("/api/v2/item/1");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Item DELETE endpoint failure", () => {
  it("should not find an item with the provided id", async () => {
    const res = await request(app).delete("/api/v2/item/1");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should refuse the request, as id is not a number", async () => {
    const res = await request(app).delete("/api/v2/item/NotANumber");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to find the item route, as it is not available for DELETE", async () => {
    const res = await request(app).get("/api/v2/item");
    expect(res.statusCode).toEqual(404);
  });
});
