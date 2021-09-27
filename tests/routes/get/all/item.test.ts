import { sequelize } from '../../../../server/db';
import { app } from '../../../../server';
import { seedDatabase } from '../../../../server/seeders/seeder';
import { Item } from '../../../../server/models/item.model';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Item GET-all endpoint success', () => {
  it('should return an empty array, as there are no categories', async () => {
    const res = await request(app)
      .get('/api/v2/item/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it('should return an array with two items, as the database is seeded', async () => {
    await seedDatabase();
    await Item.create({
      name: 'test', quantity: 'test', url: 'test', sequence: 1, categoryId: 1,
    });
    await Item.create({
      name: 'test', quantity: 'test', url: 'test', sequence: 2, categoryId: 1,
    });

    const res = await request(app)
      .get('/api/v2/item/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });
});