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

describe('Standard item PATCH endpoint success', () => {
  beforeEach(async () => {
    await StandardItem.create({
      name: 'test',
      quantity: 'test',
      url: 'test',
      categoryId: 1,
    });
  });

  it('should update standard item 1 name only', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/1')
      .send({
        name: 'updated',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('updated');
    expect(res.body.quantity).toEqual('test');
    expect(res.body.url).toEqual('test');
    expect(res.body.categoryId).toEqual(1);
  });

  it('should update standard item 1 quantity only', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/1')
      .send({
        quantity: 'updated',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.quantity).toEqual('updated');
    expect(res.body.url).toEqual('test');
    expect(res.body.categoryId).toEqual(1);
  });

  it('should update standard item 1 url only', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/1')
      .send({
        url: 'updated',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('test');
    expect(res.body.quantity).toEqual('test');
    expect(res.body.url).toEqual('updated');
    expect(res.body.categoryId).toEqual(1);
  });

  it('should update all standard item 1 properties', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/1')
      .send({
        name: 'updated',
        quantity: 'updated',
        url: 'updated',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.name).toEqual('updated');
    expect(res.body.quantity).toEqual('updated');
    expect(res.body.url).toEqual('updated');
    expect(res.body.categoryId).toEqual(1);
  });
});

describe('Standard item PATCH endpoint failure', () => {
  it('should refuse the standard item 1 update request because there are no properties to update', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/1');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not find the category with the provided id', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/3')
      .send({
        name: 'updated',
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should refuse the request, as id is not a number', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem/NotANumber');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail to find the standard item route, as it is not available for PATCH', async () => {
    const res = await request(app)
      .patch('/api/v2/standardItem');
    expect(res.statusCode).toEqual(404);
  });
});
