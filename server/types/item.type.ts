import { CategoryAttributes } from './category.type';
import { Optional } from 'sequelize';

export interface ItemAttributes {
    id: number;
    name: string;
    quantity: string;
    url: string;
    status: number;
    sequence: number;
    category: CategoryAttributes;
}

export interface ItemCreationAttributes
  extends Optional<ItemAttributes, "id" | "quantity" | "url" | "status" | "sequence"> {}
