import { app } from "../../../server";
import { seedDatabase } from "../../../server/seeders/seeder";

const request = require("supertest");

jest.mock("http-terminator");

beforeEach(async () => {
  await seedDatabase();
});

describe("Standard item POST endpoint success", () => {
  it("should create a new standard item", async () => {
    const res = await request(app).post("/api/v2/standardItem").send({
      name: "test1",
      categoryId: "1",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(1);
  });
});

describe("Standard item POST endpoint failure", () => {
  it("should not accept the standard item creation request, as name is missing", async () => {
    const res = await request(app).post("/api/v2/standardItem").send({
      url: "test",
      quantity: "test",
      categoryId: 1,
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the standard item creation request, as categoryId is missing", async () => {
    const res = await request(app).post("/api/v2/standardItem").send({
      name: "test",
      url: "test",
      quantity: "test",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the standard item creation request, as multiple properties are missing", async () => {
    const res = await request(app).post("/api/v2/standardItem").send({
      url: "test",
      quantity: "test",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the standard item creation request, as categoryId is not a number", async () => {
    const res = await request(app).post("/api/v2/standardItem").send({
      name: "test",
      categoryId: "NotANumber",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should fail to find the standard item route, as it is not available for POST", async () => {
    const res = await request(app).post("/api/v2/standardItem/1");
    expect(res.statusCode).toEqual(404);
  });
});
