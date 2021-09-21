import { categorySeeder } from './category.seeder';

export interface seeder {
  seed: () => void;
}

const seeders: seeder[] = [
  new categorySeeder(),
];

export function seedDatabase() {
  seeders.forEach((seeder) => seeder.seed())
}
