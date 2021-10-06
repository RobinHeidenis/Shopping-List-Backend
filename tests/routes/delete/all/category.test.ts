import { sequelize } from '../../../../server/db';
import { app, sessionStore } from '../../../../server';
import { Category } from '../../../../server/models/category.model';

const request = require('supertest');

afterAll(async () => {
  await sequelize.close();
  sessionStore.close();
});

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Category DELETE-all endpoint success', () => {
  it('should successfully delete all categories', async () => {
    await Category.create({ name: 'test1', color: 'test' });
    await Category.create({ name: 'test2', color: 'test' });
    await Category.create({ name: 'test2', color: 'test' });

    expect(await Category.count()).toEqual(3);

    const res = await request(app)
      .delete('/api/v2/category/all');
    expect(res.statusCode).toEqual(204);

    expect(await Category.count()).toEqual(0);
  });
});
