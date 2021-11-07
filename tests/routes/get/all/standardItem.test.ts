import { app } from "../../../../server";
import { StandardItem } from "../../../../server/models/standardItem.model";
import { seedDatabase } from "../../../../server/seeders/seeder";

const request = require("supertest");

jest.mock("http-terminator");

describe("Standard item GET-all endpoint success", () => {
  it("should return an empty array, as there are no categories", async () => {
    const res = await request(app).get("/api/v2/standardItem/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return an array with two items, as the database is seeded", async () => {
    await seedDatabase();
    await StandardItem.create({
      name: "test",
      quantity: "test",
      url: "test",
      categoryId: 1,
    });
    await StandardItem.create({
      name: "test",
      quantity: "test",
      url: "test",
      categoryId: 1,
    });

    const res = await request(app).get("/api/v2/standardItem/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
  });
});
