import { Optional } from 'sequelize/types';
import { CategoryAttributes } from './category.type';

export interface StandardItemAttributes {
  id: number;
  name: string;
  quantity: string;
  url: string;
  categoryId: number;
  category: CategoryAttributes;
}

export interface StandardItemsCreationAttributes
  extends Optional<StandardItemAttributes, 'id' | 'quantity' | 'url' | 'category'> {}
