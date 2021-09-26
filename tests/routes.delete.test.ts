import { DBInitTest, sequelize } from '../server/db';
import { Category } from '../server/models/category.model';
import { app } from '../server';
import { Item } from '../server/models/item.model';
import { StandardItem } from '../server/models/standardItem.model';

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

describe('Delete Endpoints Success', () => {
  describe('Category Endpoint', () => {
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

    it('should successfully delete item 1', async () => {
      let res = await request(app)
        .delete('/api/v2/item/1');
      expect(res.statusCode).toEqual(204);

      res = await request(app)
        .get('/api/v2/item/1');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
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

    it('should successfully delete item 1', async () => {
      let res = await request(app)
        .delete('/api/v2/standardItem/1');
      expect(res.statusCode).toEqual(204);

      res = await request(app)
        .get('/api/v2/standardItem/1');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});

describe('Delete Endpoints Failure', () => {
  describe('Category Endpoint', () => {
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

  describe('Item Endpoint', () => {
    it('should not find an item with the provided id', async () => {
      const res = await request(app)
        .delete('/api/v2/item/1');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should refuse the request, as id is not a number', async () => {
      const res = await request(app)
        .delete('/api/v2/item/NotANumber');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Standard Item Endpoint', () => {
    it('should not find a standard item with the provided id', async () => {
      const res = await request(app)
        .delete('/api/v2/standardItem/1');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
    });

    it('should refuse the request, as id is not a number', async () => {
      const res = await request(app)
        .delete('/api/v2/standardItem/NotANumber');
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});
