import { sequelize } from "../db";
import { DataTypes } from "sequelize";
import { Category } from "./category.model";

export const Item = sequelize.define("Item", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    quantity: {
        type: DataTypes.STRING(15),
        defaultValue: null
    },
    url: {
        type: DataTypes.STRING(500),
        defaultValue: null
    },
    status: {
        type: DataTypes.INTEGER,
        values: [0, 1], // 0 = open, 1 = closed
        defaultValue: 0,
        allowNull: false
    },
    sequence: {
        type: DataTypes.INTEGER,
        maxLength: 11
    },
    category: {
        type: DataTypes.INTEGER,
        maxLength: 11,
        references: {
            model: Category,
            key: "id"
        },
        defaultValue: 1
    }
});
