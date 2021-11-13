import { Logger } from "../logging/logger";
import { CategorySeeder } from "./category.seeder";

export interface Seeder {
  seed: () => Promise<void>;
}

const seeders: Seeder[] = [new CategorySeeder()];

export async function seedDatabase(): Promise<void> {
  await seeders[0].seed();
  Logger.success("Seeding complete");
}
