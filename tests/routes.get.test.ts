import { DBInitTest, sequelize } from '../server/db';
import { app } from '../server';
import { Item } from '../server/models/item.model';
import { StandardItem } from '../server/models/standardItem.model';
import { Category } from '../server/models/category.model';

const request = require('supertest');

beforeAll(async () => { await DBInitTest(); }, 10000);

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await Category.create({
    name: 'Albert Heijn',
    color: '#179EDA',
  });
});

describe('Get Endpoints Success', () => {
  it('should get the first category', async () => {
    const res = await request(app)
      .get('/api/v2/category/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
  });

  it('should get the first item', async () => {
    await Item.create({ name: 'test', categoryId: 1, sequence: 1 });
    const res = await request(app)
      .get('/api/v2/item/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.categoryId).toEqual(1);
    expect(res.body.url).toEqual(null);
  });

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

describe('Get Endpoints Failure', () => {
  it('should fail to find category 3', async () => {
    const res = await request(app)
      .get('/api/v2/category/3');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find item 1', async () => {
    const res = await request(app)
      .get('/api/v2/item/1');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find standard item 1', async () => {
    const res = await request(app)
      .get('/api/v2/standardItem/1');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find the category route, as it is not available for GET', async () => {
    const res = await request(app)
      .get('/api/v2/category');
    expect(res.statusCode).toEqual(404);
  });

  it('should fail to find the item route, as it is not available for GET', async () => {
    const res = await request(app)
      .get('/api/v2/item');
    expect(res.statusCode).toEqual(404);
  });

  it('should fail to find the standard item route, as it is not available for GET', async () => {
    const res = await request(app)
      .get('/api/v2/standardItem');
    expect(res.statusCode).toEqual(404);
  });
});
