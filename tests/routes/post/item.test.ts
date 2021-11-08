import { app } from "../../../server";
import { seedDatabase } from "../../../server/seeders/seeder";

const request = require("supertest");

jest.mock("http-terminator");

beforeEach(async () => {
  await seedDatabase();
});

describe("Item POST endpoint success", () => {
  it("should create a new item", async () => {
    const res = await request(app).post("/api/v2/item").send({
      name: "test1",
      categoryId: "1",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(1);
  });
});

describe("Item POST endpoint failure", () => {
  it("should not accept the item creation request, as name is missing", async () => {
    const res = await request(app).post("/api/v2/item").send({
      url: "test",
      quantity: "test",
      categoryId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the item creation request, as categoryId is missing", async () => {
    const res = await request(app).post("/api/v2/item").send({
      name: "test",
      url: "test",
      quantity: "test",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the item creation request, as multiple properties are missing", async () => {
    const res = await request(app).post("/api/v2/item").send({
      url: "test",
      quantity: "test",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the item creation request, as categoryId is not a number", async () => {
    const res = await request(app).post("/api/v2/item").send({
      name: "test",
      categoryId: "NotANumber",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should fail to find the item route, as it is not available for POST", async () => {
    const res = await request(app).post("/api/v2/item/1");
    expect(res.statusCode).toEqual(404);
  });
});
