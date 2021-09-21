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
import { ItemAttributes, ItemCreationAttributes } from '../types/item.type';
import { Category } from './category.model';

@Table
export class Item extends Model<ItemAttributes, ItemCreationAttributes> {
  @AllowNull(false)
  @Column
  name: string

  @AllowNull
  @Column(DataTypes.STRING(15))
  quantity: string

  @AllowNull
  @Column(DataTypes.STRING(500))
  url: string

  @AllowNull(false)
  @Default(1)
  @Column
  status: number

  @AllowNull(false)
  @Column
  sequence: number

  @Default(1)
  @ForeignKey(() => Category)
  @Column
  categoryId: number

  @BelongsTo(() => Category)
  category: Category
}
