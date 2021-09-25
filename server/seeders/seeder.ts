import { CategorySeeder } from './category.seeder';

export interface Seeder {
  seed: () => Promise<void>;
}

const seeders: Seeder[] = [
  new CategorySeeder(),
];

export async function seedDatabase() {
  seeders.forEach(async (seederClass) => { await seederClass.seed(); });
}
