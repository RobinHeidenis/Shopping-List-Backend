import { app } from "../../../../server";
import { Item } from "../../../../server/models/item.model";
import { seedDatabase } from "../../../../server/seeders/seeder";

const request = require("supertest");

jest.mock("http-terminator");

describe("Item GET-all endpoint success", () => {
  it("should return an empty array, as there are no categories", async () => {
    const res = await request(app).get("/api/v2/item/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return an array with two items, as the database is seeded", async () => {
    await seedDatabase();
    await Item.create({
      name: "test",
      quantity: "test",
      url: "test",
      sequence: 1,
      categoryId: 1,
    });
    await Item.create({
      name: "test",
      quantity: "test",
      url: "test",
      sequence: 2,
      categoryId: 1,
    });

    const res = await request(app).get("/api/v2/item/all");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
  });
});
