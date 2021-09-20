import { category, insertQueryResult, searchItem } from "../interfaces";
import { item, fullItem, itemSequence } from "../interfaces/item.interface";
import { DBConnect, sequelize } from "./db";
import { Item } from "./models/item.model";
import { StandardItem } from "./models/standard_item.model";
import { Category } from "./models/category.model";
import { logger } from "sequelize/types/lib/utils/logger";

const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");
const { query } = require("../utils/db");
const PORT = 3001;
const compression = require("compression");
const helmet = require("helmet");
const _fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const SSE = require("express-sse");
const cookieParser = require("cookie-parser");

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const itemRouter = require("./routes/item.routes");

app.use("/api/v2/item", itemRouter);

app.listen(PORT, () => {
    new Item();
    new Category();
    new StandardItem();
    sequelize.sync();
    console.log("All models were synchronized successfully.");
    console.log(`Shopping list backend listening at http://localhost:${PORT}`);
});
