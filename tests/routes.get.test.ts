import { DBInitTest, sequelize } from '../server/db';
import { app } from '../server';
import { seedDatabase } from '../server/seeders/seeder';
import { Item } from '../server/models/item.model';
import { StandardItem } from '../server/models/standardItem.model';

const request = require('supertest');

beforeAll(() => DBInitTest(), 10000);

afterAll(async () => {
  await sequelize.close();
  // server.close();
});

describe('Get Endpoints', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await seedDatabase();
  });

  it('should get the first category', async () => {
    const res = await request(app)
      .get('/api/v2/category/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
  });

  it('should get the first item', async () => {
    await Item.create({ name: 'test', categoryId: 2, sequence: 1 });
    const res = await request(app)
      .get('/api/v2/item/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.categoryId).toEqual(2);
    expect(res.body.url).toEqual(null);
  });

  it('should get the first standard item', async () => {
    await StandardItem.create({ name: 'test', categoryId: 2 });
    const res = await request(app)
      .get('/api/v2/standardItem/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.categoryId).toEqual(2);
    expect(res.body.url).toEqual(null);
  });
});
