require("dotenv").config();
const { Sequelize } = require("sequelize");

export const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_IP,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
});

export async function DBConnect () {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
