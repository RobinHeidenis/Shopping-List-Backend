import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { Category } from './category.model';
import {
  StandardItemAttributes,
  StandardItemsCreationAttributes,
} from '../types/standardItem.type';

@Table
export class StandardItem extends Model<StandardItemAttributes, StandardItemsCreationAttributes> {
  @AllowNull(false)
  @Column
  name: string

  @AllowNull
  @Column(DataTypes.STRING(15))
  quantity: string

  @AllowNull
  @Column(DataTypes.STRING(500))
  url: string

  @Default(1)
  @ForeignKey(() => Category)
  @Column
  categoryId: number

  @BelongsTo(() => Category)
  category: Category
}
