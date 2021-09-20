import { sequelize } from "../db";
import { DataTypes } from "sequelize";
export const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
});
