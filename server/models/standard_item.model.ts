import { sequelize } from "../db";
import { DataTypes } from "sequelize";
export const StandardItem = sequelize.define("StandardItem", {
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
    }
});
