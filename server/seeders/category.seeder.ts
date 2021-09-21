import { Category } from '../models/category.model';
import { seeder } from './seeder';

export class categorySeeder implements seeder {
  seed() {
    Category.create({
      name: 'Albert Heijn',
      color: '#179EDA',
    });
    Category.create({
      name: 'Snackbar',
      color: 'yellow',
    });
  }
}
