import { sequelize } from "../../../server/db";
import { seedDatabase } from "../../../server/seeders/seeder";
import { app, sessionStore } from "../../../server";
import { StandardItem } from "../../../server/models/standardItem.model";

const request = require("supertest");

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe("Standard item DELETE endpoint success", () => {
  beforeEach(async () => {
    await StandardItem.create({
      name: "test",
      quantity: "test",
      url: "test",
      categoryId: 1,
    });
  });

  it("should delete standard item 1", async () => {
    let res = await request(app).delete("/api/v2/standardItem/1");
    expect(res.statusCode).toEqual(204);

    res = await request(app).get("/api/v2/standardItem/1");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });
});

describe("Standard item DELETE endpoint failure", () => {
  it("should not find a standard item with the provided id", async () => {
    const res = await request(app).delete("/api/v2/standardItem/1");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should refuse the request, as id is not a number", async () => {
    const res = await request(app).delete("/api/v2/standardItem/NotANumber");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should fail to find the standard item route, as it is not available for DELETE", async () => {
    const res = await request(app).get("/api/v2/standardItem");
    expect(res.statusCode).toEqual(404);
  });
});
