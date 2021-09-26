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

describe('Item POST endpoint success', () => {
  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/v2/item')
      .send({
        name: 'test1',
        categoryId: '1',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(1);
  });
});

describe('Item POST endpoint failure', () => {
  it('should not accept the item creation request due to missing name', async () => {
    const res = await request(app)
      .post('/api/v2/item')
      .send({
        url: 'test',
        quantity: 'test',
        categoryId: 1,
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not accept the item creation request due to missing categoryId', async () => {
    const res = await request(app)
      .post('/api/v2/item')
      .send({
        name: 'test',
        url: 'test',
        quantity: 'test',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not accept the item creation request due to multiple missing properties', async () => {
    const res = await request(app)
      .post('/api/v2/item')
      .send({
        url: 'test',
        quantity: 'test',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not accept the item creation request due to categoryId not being a number', async () => {
    const res = await request(app)
      .post('/api/v2/item')
      .send({
        name: 'test',
        categoryId: 'NotANumber',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not find the route', async () => {
    const res = await request(app)
      .post('/api/v2/item/1');
    expect(res.statusCode).toEqual(404);
  });
});
