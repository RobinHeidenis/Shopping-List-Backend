import { Sequelize } from 'sequelize-typescript';
import { Category } from './models/category.model';
import { seedDatabase } from './seeders/seeder';

require('dotenv').config();

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_IP,
  database: process.env.NODE_ENV === 'test' ? 'shoppinglist_test' : process.env.DB_NAME,
  port: process.env.NODE_ENV === 'test' ? 3305 : 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  models: [`${__dirname}/models`],
  modelMatch: (filename, member) => filename.substring(0, filename.indexOf('.model')).toLowerCase() === member.toLowerCase(),
  logging: process.env.NODE_ENV === 'test' ? false : console.log,
});

export async function DBInit() {
  await sequelize.authenticate()
    .catch((e) => {
      console.log(e);
      process.kill(process.pid, 'SIGTERM');
    });

  const categoryCount = await Category.count()
    .catch((e) => {
      console.log(e);
      sequelize.sync({ force: true });
    });

  if (categoryCount === 0) {
    await sequelize.sync({ force: true })
      .then(() => console.log('All models were synchronized successfully.'))
      .then(async () => {
        console.log('Seeding database');
        await seedDatabase();
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    await sequelize.sync()
      .then(() => console.log('All models were synchronized successfully.'))
      .catch((e) => {
        console.log(e);
      });
  }
}
