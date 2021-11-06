import { app, sessionStore } from "../../../server";
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

describe("Category POST endpoint success", () => {
  it("should create a new category", async () => {
    const res = await request(app).post("/api/v2/category").send({
      name: "test",
      color: "#123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toEqual(3);
  });
});

describe("Category POST endpoint failure", () => {
  it("should not accept the category creation request, as color is missing", async () => {
    const res = await request(app).post("/api/v2/category").send({
      name: "test",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the category creation request, as name is missing", async () => {
    const res = await request(app).post("/api/v2/category").send({
      color: "test",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not accept the category creation request, as multiple properties are missing", async () => {
    const res = await request(app).post("/api/v2/category");
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should fail to find the category route, as it is not available for POST", async () => {
    const res = await request(app).post("/api/v2/category/1");
    expect(res.statusCode).toEqual(404);
  });
});
