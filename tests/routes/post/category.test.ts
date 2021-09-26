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

describe('Category POST endpoint success', () => {
  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/v2/category')
      .send({
        name: 'test',
        color: '#123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(3);
  });
});

describe('Category POST endpoint failure', () => {
  it('should not accept the category creation request due to missing color property', async () => {
    const res = await request(app)
      .post('/api/v2/category')
      .send({
        name: 'test',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not accept the category creation request due to missing name', async () => {
    const res = await request(app)
      .post('/api/v2/category')
      .send({
        color: 'test',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not find the route', async () => {
    const res = await request(app)
      .post('/api/v2/category/1');
    expect(res.statusCode).toEqual(404);
  });
});
