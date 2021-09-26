import { sequelize } from '../../../server/db';
import { seedDatabase } from '../../../server/seeders/seeder';
import { app } from '../../../server';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('Category DELETE endpoint success', () => {
  it('should successfully delete category 1', async () => {
    let res = await request(app)
      .delete('/api/v2/category/1');
    expect(res.statusCode).toEqual(204);

    res = await request(app)
      .get('/api/v2/category/1');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Category DELETE endpoint failure', () => {
  it('should not find a category with the provided id', async () => {
    const res = await request(app)
      .delete('/api/v2/category/3');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should refuse the request, as id is not a number', async () => {
    const res = await request(app)
      .delete('/api/v2/category/NotANumber');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
