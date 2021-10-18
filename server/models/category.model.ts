import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import {
  CategoryAttributes,
  CategoryCreationAttributes,
} from "../types/category.type";
import { Item } from "./item.model";
import { StandardItem } from "./standardItem.model";

@Table
export class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
> {
  @Column
  name: string;

  @Column(DataTypes.STRING(10))
  color: string;

  @HasMany(() => Item, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  items: Item[];

  @HasMany(() => StandardItem)
  standardItems: StandardItem[];
}
