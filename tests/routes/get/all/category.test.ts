import { sequelize } from "../../../../server/db";
import { app, sessionStore } from "../../../../server";
import { seedDatabase } from "../../../../server/seeders/seeder";

const request = require("supertest");

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe("Category GET-all endpoint success", () => {
  it("should return an empty array, as there are no categories", async () => {
    const res = await request(app).get("/api/v2/category/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return an array with two categories, as the database is seeded", async () => {
    await seedDatabase();
    const res = await request(app).get("/api/v2/category/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
  });
});
