import { Optional } from "sequelize/types";

export interface CategoryAttributes {
  id: number;
  name: string;
  color: string;
}

export interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}
