import { sequelize } from '../../../server/db';
import { seedDatabase } from '../../../server/seeders/seeder';
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

describe('Category GET endpoint success', () => {
  it('should find the first category', async () => {
    const res = await request(app)
      .get('/api/v2/category/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
  });
});

describe('Category GET endpoint failure', () => {
  it('should not find a category with the provided id', async () => {
    const res = await request(app)
      .get('/api/v2/category/3');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should refuse the request, as id is not a number', async () => {
    const res = await request(app)
      .get('/api/v2/category/NotANumber');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find the category route, as it is not available for GET', async () => {
    const res = await request(app)
      .get('/api/v2/category');
    expect(res.statusCode).toEqual(404);
  });
});
