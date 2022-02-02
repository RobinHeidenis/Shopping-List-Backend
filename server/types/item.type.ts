import { Optional } from "sequelize";
import { CategoryAttributes } from "./category.type";

export interface ItemAttributes {
  id: number;
  name: string;
  quantity: string;
  url: string;
  status: number;
  sequence: number;
  categoryId: number;
  category: CategoryAttributes;
}

export type ItemCreationAttributes = Optional<
  ItemAttributes,
  "id" | "quantity" | "url" | "status" | "sequence" | "category"
>;
