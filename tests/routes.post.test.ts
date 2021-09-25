import { DBInitTest, sequelize } from '../server/db';
import { app } from '../server';
import { seedDatabase } from '../server/seeders/seeder';

const request = require('supertest');

beforeAll(() => DBInitTest(), 10000);

afterAll(async () => {
  await sequelize.close();
});

describe('Post Endpoints', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await seedDatabase();
  });

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

  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/v2/item')
      .send({
        name: 'test1',
        category: '1',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(1);
  });

  it('should create a new standard item', async () => {
    const res = await request(app)
      .post('/api/v2/standardItem')
      .send({
        name: 'test1',
        category: '1',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(1);
  });
});
