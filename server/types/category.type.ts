import { Optional } from "sequelize/types";

export interface CategoryAttributes {
  id: number;
  name: string;
  color: string;
}

export type CategoryCreationAttributes = Optional<CategoryAttributes, "id">;
