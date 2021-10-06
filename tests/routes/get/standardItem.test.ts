import { sequelize } from '../../../server/db';
import { seedDatabase } from '../../../server/seeders/seeder';
import { StandardItem } from '../../../server/models/standardItem.model';
import { app, sessionStore } from '../../../server';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('Standard item GET endpoint success', () => {
  it('should get the first standard item', async () => {
    await StandardItem.create({ name: 'test', categoryId: 1 });
    const res = await request(app)
      .get('/api/v2/standardItem/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.categoryId).toEqual(1);
    expect(res.body.url).toEqual(null);
  });
});

describe('Standard item GET endpoint failure', () => {
  it('should not find a category with the provided id', async () => {
    const res = await request(app)
      .get('/api/v2/standardItem/1');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should refuse the request, as id is not a number', async () => {
    const res = await request(app)
      .delete('/api/v2/standardItem/NotANumber');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find the standard item route, as it is not available for GET', async () => {
    const res = await request(app)
      .get('/api/v2/standardItem');
    expect(res.statusCode).toEqual(404);
  });
});
