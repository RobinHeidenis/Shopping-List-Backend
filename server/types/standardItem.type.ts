import { CategoryAttributes } from './category.type';
import { Optional } from 'sequelize/types';

export interface StandardItemAttributes {
  id: number;
  name: string;
  quantity: string;
  url: string;
  category: CategoryAttributes;
}

export interface StandardItemsCreationAttributes
  extends Optional<StandardItemAttributes, "id" | "quantity" | "url"> {}
