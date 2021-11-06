import { app, sessionStore } from "../../../../server";
import { sequelize } from "../../../../server/db";
import { Item } from "../../../../server/models/item.model";
import { seedDatabase } from "../../../../server/seeders/seeder";

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

describe("Item POST endpoint success", () => {
  it("should set the sequence correctly of one item", async () => {
    await Item.create({
      name: "test1",
      sequence: 1,
      categoryId: 1,
    });

    const res = await request(app)
      .post("/api/v2/item/sequences")
      .send([
        {
          id: 1,
          sequence: 3,
        },
      ]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        id: 1,
        sequence: 3,
      },
    ]);
  });

  it("should set the sequences correctly of multiple items", async () => {
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

    const res = await request(app)
      .post("/api/v2/item/sequences")
      .send([
        {
          id: 1,
          sequence: 3,
        },
        {
          id: 2,
          sequence: 5,
        },
        {
          id: 3,
          sequence: 1,
        },
      ]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        id: 1,
        sequence: 3,
      },
      {
        id: 2,
        sequence: 5,
      },
      {
        id: 3,
        sequence: 1,
      },
    ]);
  });

  it("should set the sequences correctly of multiple items, even though some ids do not exist", async () => {
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

    const res = await request(app)
      .post("/api/v2/item/sequences")
      .send([
        {
          id: 1,
          sequence: 3,
        },
        {
          id: 2,
          sequence: 5,
        },
        {
          id: 3,
          sequence: 1,
        },
        {
          id: 4,
          sequence: 6,
        },
      ]);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
      {
        id: 1,
        sequence: 3,
      },
      {
        id: 2,
        sequence: 5,
      },
      {
        id: 3,
        sequence: 1,
      },
      {
        id: 4,
        sequence: 6,
        error: {
          key: "NOT_FOUND",
          message: "Item not found",
        },
      },
    ]);
  });
});

describe("Item POST endpoint failure", () => {
  it("should not accept the request, as there is no array sent as payload", async () => {
    const res = await request(app).post("/api/v2/item/sequences").send({
      id: 1,
      sequence: 3,
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should not accept the request, as nothing is sent", async () => {
    const res = await request(app).post("/api/v2/item/sequences");
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should not accept the request, as one of the objects is missing the sequence property", async () => {
    const res = await request(app)
      .post("/api/v2/item/sequences")
      .send([{ id: 1 }]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should not accept the request, as one of the objects is missing the id property", async () => {
    const res = await request(app)
      .post("/api/v2/item/sequences")
      .send([{ sequence: 1 }]);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });
});
