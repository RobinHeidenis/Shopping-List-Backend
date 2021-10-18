import { CategorySeeder } from "./category.seeder";

export interface Seeder {
  seed: () => Promise<void>;
}

const seeders: Seeder[] = [new CategorySeeder()];

export async function seedDatabase() {
  await seeders[0].seed();
}
