import { sequelize } from '../server/db';
import { app } from '../server';
import { seedDatabase } from '../server/seeders/seeder';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('Post Endpoints Success', () => {
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
        categoryId: '1',
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
        categoryId: '1',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(1);
  });
});

describe('Post Endpoint Failure', () => {
  describe('Category Endpoint', () => {
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

  describe('Item Endpoint', () => {
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

  describe('Standard Item Endpoint', () => {
    it('should not accept the standard item creation request due to missing name', async () => {
      const res = await request(app)
        .post('/api/v2/standardItem')
        .send({
          url: 'test',
          quantity: 'test',
          categoryId: 1,
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  it('should not accept the standard item creation request due to missing categoryId', async () => {
    const res = await request(app)
      .post('/api/v2/standardItem')
      .send({
        name: 'test',
        url: 'test',
        quantity: 'test',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not accept the standard item creation request due to multiple missing properties', async () => {
    const res = await request(app)
      .post('/api/v2/standardItem')
      .send({
        url: 'test',
        quantity: 'test',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not accept the standard item creation request due to categoryId not being a number', async () => {
    const res = await request(app)
      .post('/api/v2/standardItem')
      .send({
        name: 'test',
        categoryId: 'NotANumber',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not find the route', async () => {
    const res = await request(app)
      .post('/api/v2/standardItem/1');
    expect(res.statusCode).toEqual(404);
  });
});
