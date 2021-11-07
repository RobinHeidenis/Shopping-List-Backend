import { app } from "../../../server";
import { sessionStore } from "../../../server/config/sessionStore.config";
import { sequelize } from "../../../server/db";
import { Item } from "../../../server/models/item.model";
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

describe("Item PATCH endpoint success", () => {
  beforeEach(async () => {
    await Item.create({
      name: "test",
      quantity: "test",
      url: "test",
      categoryId: 1,
      sequence: 1,
    });
  });

  it("should update item 1 name only", async () => {
    const res = await request(app).patch("/api/v2/item/1").send({
      name: "updated",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("updated");
    expect(res.body.quantity).toEqual("test");
    expect(res.body.url).toEqual("test");
    expect(res.body.status).toEqual(1);
    expect(res.body.sequence).toEqual(1);
    expect(res.body.categoryId).toEqual(1);
  });

  it("should update item 1 quantity only", async () => {
    const res = await request(app).patch("/api/v2/item/1").send({
      quantity: "updated",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("test");
    expect(res.body.quantity).toEqual("updated");
    expect(res.body.url).toEqual("test");
    expect(res.body.status).toEqual(1);
    expect(res.body.sequence).toEqual(1);
    expect(res.body.categoryId).toEqual(1);
  });

  it("should update item 1 url only", async () => {
    const res = await request(app).patch("/api/v2/item/1").send({
      url: "https://updated.com",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("test");
    expect(res.body.quantity).toEqual("test");
    expect(res.body.url).toEqual("https://updated.com");
    expect(res.body.status).toEqual(1);
    expect(res.body.sequence).toEqual(1);
    expect(res.body.categoryId).toEqual(1);
  });

  it("should update item 1 status only", async () => {
    const res = await request(app).patch("/api/v2/item/1").send({
      status: 2,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("test");
    expect(res.body.quantity).toEqual("test");
    expect(res.body.url).toEqual("test");
    expect(res.body.status).toEqual(2);
    expect(res.body.sequence).toEqual(1);
    expect(res.body.categoryId).toEqual(1);
  });

  it("should update all item 1 properties", async () => {
    const res = await request(app).patch("/api/v2/item/1").send({
      name: "updated",
      quantity: "updated",
      url: "https://updated.com",
      status: 2,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual("updated");
    expect(res.body.quantity).toEqual("updated");
    expect(res.body.url).toEqual("https://updated.com");
    expect(res.body.status).toEqual(2);
    expect(res.body.sequence).toEqual(1);
    expect(res.body.categoryId).toEqual(1);
  });
});

describe("Item PATCH endpoint failure", () => {
  it("should refuse the item 1 update request because there are no properties to update", async () => {
    const res = await request(app).patch("/api/v2/item/1");
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should not find the item with the provided id", async () => {
    const res = await request(app).patch("/api/v2/item/3").send({
      name: "updated",
      quantity: "updated",
      url: "https://updated.com",
      status: 1,
    });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should refuse the request, as id is not a number", async () => {
    const res = await request(app).patch("/api/v2/item/NotANumber");
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should fail to find the item route, as it is not available for PATCH", async () => {
    const res = await request(app).patch("/api/v2/item");
    expect(res.statusCode).toEqual(404);
  });
});
