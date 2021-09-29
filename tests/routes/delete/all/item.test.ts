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
  await seedDatabase();
});

describe('Item DELETE-all endpoint success', () => {
  it('should successfully delete all items', async () => {
    await Item.create({ name: 'test1', sequence: 1, categoryId: 1 });
    await Item.create({ name: 'test2', sequence: 2, categoryId: 1 });
    await Item.create({ name: 'test3', sequence: 3, categoryId: 1 });

    expect(await Item.count()).toEqual(3);

    const res = await request(app)
      .delete('/api/v2/item/all');
    expect(res.statusCode).toEqual(204);

    expect(await Item.count()).toEqual(0);
  });
});
