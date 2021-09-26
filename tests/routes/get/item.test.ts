import { sequelize } from '../../../server/db';
import { seedDatabase } from '../../../server/seeders/seeder';
import { Item } from '../../../server/models/item.model';
import { app } from '../../../server';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('Item GET endpoint success', () => {
  it('should find the first item', async () => {
    await Item.create({ name: 'test', categoryId: 1, sequence: 1 });
    const res = await request(app)
      .get('/api/v2/item/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.categoryId).toEqual(1);
    expect(res.body.url).toEqual(null);
  });
});

describe('Item GET endpoint failure', () => {
  it('should not find a category with the provided id', async () => {
    const res = await request(app)
      .get('/api/v2/item/1');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should refuse the request, as id is not a number', async () => {
    const res = await request(app)
      .delete('/api/v2/item/NotANumber');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find the item route, as it is not available for GET', async () => {
    const res = await request(app)
      .get('/api/v2/item');
    expect(res.statusCode).toEqual(404);
  });
});
