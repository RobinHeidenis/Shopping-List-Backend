import { app } from "../../../server";
import { sessionStore } from "../../../server/config/sessionStore.config";
import { sequelize } from "../../../server/db";
import { seedDatabase } from "../../../server/seeders/seeder";

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

describe("Category PATCH endpoint success", () => {
  it("should update category 1 name only", async () => {
    const res = await request(app).patch("/api/v2/category/1").send({
      name: "test",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("test");
    expect(res.body.color).toEqual("#179EDA");
  });

  it("should update category 1 color only", async () => {
    const res = await request(app).patch("/api/v2/category/1").send({
      color: "#123456",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("Albert Heijn");
    expect(res.body.color).toEqual("#123456");
  });

  it("should update all category 1 properties", async () => {
    const res = await request(app).patch("/api/v2/category/1").send({
      name: "test",
      color: "#123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("test");
    expect(res.body.color).toEqual("#123");
  });
});

describe("Category PATCH endpoint failure", () => {
  it("should refuse the category 1 update request because there are no properties to update", async () => {
    const res = await request(app).patch("/api/v2/category/1");
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not find the category with the provided id", async () => {
    const res = await request(app).patch("/api/v2/category/3").send({
      name: "updated",
      color: "#123456",
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should refuse the request, as id is not a number", async () => {
    const res = await request(app).patch("/api/v2/category/NotANumber");
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should fail to find the category route, as it is not available for PATCH", async () => {
    const res = await request(app).patch("/api/v2/category");
    expect(res.statusCode).toEqual(404);
  });
});
