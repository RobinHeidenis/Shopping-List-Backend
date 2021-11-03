import { Category } from "../models/category.model";
import { Seeder } from "./seeder";

export class CategorySeeder implements Seeder {
  async seed(): Promise<void> {
    await Category.create({
      name: "Albert Heijn",
      color: "#179EDA",
    });
    await Category.create({
      name: "Snackbar",
      color: "yellow",
    });
  }
}
