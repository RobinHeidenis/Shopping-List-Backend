import { sequelize } from '../server/db';
import { app } from '../server';
import { Item } from '../server/models/item.model';
import { StandardItem } from '../server/models/standardItem.model';
import { seedDatabase } from '../server/seeders/seeder';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
  await seedDatabase();
});

describe('Patch Endpoints Success', () => {
  describe('Category Endpoint', () => {
    it('should update category 1 name and color', async () => {
      const res = await request(app)
        .patch('/api/v2/category/1')
        .send({
          name: 'test',
          color: '#123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('test');
      expect(res.body.color).toEqual('#123');
    });

    it('should update category 1 name only', async () => {
      const res = await request(app)
        .patch('/api/v2/category/1')
        .send({
          name: 'test',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('test');
      expect(res.body.color).toEqual('#179EDA');
    });

    it('should update category 1 color only', async () => {
      const res = await request(app)
        .patch('/api/v2/category/1')
        .send({
          color: '#123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('id');
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('Albert Heijn');
      expect(res.body.color).toEqual('#123');
    });
  });

  describe('Item Endpoint', () => {
    beforeEach(async () => {
      await Item.create({
        name: 'test',
        quantity: 'test',
        url: 'test',
        categoryId: 1,
        sequence: 1,
      });
    });

    it('should update item 1 name only', async () => {
      const res = await request(app)
        .patch('/api/v2/item/1')
        .send({
          name: 'updated',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('updated');
      expect(res.body.quantity).toEqual('test');
      expect(res.body.url).toEqual('test');
      expect(res.body.status).toEqual(1);
      expect(res.body.sequence).toEqual(1);
      expect(res.body.categoryId).toEqual(1);
    });

    it('should update item 1 quantity only', async () => {
      const res = await request(app)
        .patch('/api/v2/item/1')
        .send({
          quantity: 'updated',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('test');
      expect(res.body.quantity).toEqual('updated');
      expect(res.body.url).toEqual('test');
      expect(res.body.status).toEqual(1);
      expect(res.body.sequence).toEqual(1);
      expect(res.body.categoryId).toEqual(1);
    });

    it('should update item 1 url only', async () => {
      const res = await request(app)
        .patch('/api/v2/item/1')
        .send({
          url: 'updated',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('test');
      expect(res.body.quantity).toEqual('test');
      expect(res.body.url).toEqual('updated');
      expect(res.body.status).toEqual(1);
      expect(res.body.sequence).toEqual(1);
      expect(res.body.categoryId).toEqual(1);
    });

    it('should update item 1 status only', async () => {
      const res = await request(app)
        .patch('/api/v2/item/1')
        .send({
          status: 2,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('test');
      expect(res.body.quantity).toEqual('test');
      expect(res.body.url).toEqual('test');
      expect(res.body.status).toEqual(2);
      expect(res.body.sequence).toEqual(1);
      expect(res.body.categoryId).toEqual(1);
    });

    it('should update all item 1 properties', async () => {
      const res = await request(app)
        .patch('/api/v2/item/1')
        .send({
          name: 'updated',
          quantity: 'updated',
          url: 'updated',
          status: 2,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(1);
      expect(res.body.name).toEqual('updated');
      expect(res.body.quantity).toEqual('updated');
      expect(res.body.url).toEqual('updated');
      expect(res.body.status).toEqual(2);
      expect(res.body.sequence).toEqual(1);
      expect(res.body.categoryId).toEqual(1);
    });
  });

  describe('Standard Item Endpoint', () => {
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
});

describe('Patch Endpoints Failure', () => {
  describe('Category Endpoint', () => {
    it('should refuse the category 1 update request because there are no properties to update', async () => {
      const res = await request(app)
        .patch('/api/v2/category/1');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not be able to find the category by the given id', async () => {
      const res = await request(app)
        .patch('/api/v2/category/3')
        .send({
          name: 'updated',
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should refuse the request because id is not a number', async () => {
      const res = await request(app)
        .patch('/api/v2/category/NotANumber');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not find the route, because it is not available for PATCH', async () => {
      const res = await request(app)
        .patch('/api/v2/category');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Item Endpoints', () => {
    beforeEach(async () => {
      await Item.create({
        name: 'test',
        quantity: 'test',
        url: 'test',
        categoryId: 1,
        sequence: 1,
      });
    });

    it('should refuse the item 1 update request because there are no properties to update', async () => {
      const res = await request(app)
        .patch('/api/v2/item/1');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not be able to find the item by the given id', async () => {
      const res = await request(app)
        .patch('/api/v2/item/3')
        .send({
          name: 'updated',
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should refuse the request because id is not a number', async () => {
      const res = await request(app)
        .patch('/api/v2/item/NotANumber');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not find the route, because it is not available for PATCH', async () => {
      const res = await request(app)
        .patch('/api/v2/item');
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('Standard Item Endpoint', () => {
    beforeEach(async () => {
      await StandardItem.create({
        name: 'test',
        quantity: 'test',
        url: 'test',
        categoryId: 1,
      });
    });

    it('should refuse the standard item 1 update request because there are no properties to update', async () => {
      const res = await request(app)
        .patch('/api/v2/standardItem/1');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not be able to find the standard item by the given id', async () => {
      const res = await request(app)
        .patch('/api/v2/standardItem/3')
        .send({
          name: 'updated',
        });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should refuse the request because id is not a number', async () => {
      const res = await request(app)
        .patch('/api/v2/standardItem/NotANumber');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should not find the route, because it is not available for PATCH', async () => {
      const res = await request(app)
        .patch('/api/v2/standardItem');
      expect(res.statusCode).toEqual(404);
    });
  });
});
