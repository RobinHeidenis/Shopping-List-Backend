import { app } from "../../../../server";
import { Item } from "../../../../server/models/item.model";
import { seedDatabase } from "../../../../server/seeders/seeder";

const request = require("supertest");

jest.mock("http-terminator");

beforeEach(async () => {
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
