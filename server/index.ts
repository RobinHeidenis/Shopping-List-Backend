import { Application } from "express";
import { SessionOptions } from "express-session";
import helmet from "helmet";
import dotenv = require("dotenv");
import express = require("express");
import MySqlSessionStore = require("express-mysql-session");
import { authenticationRouter } from "./routes/authentication.routes";
import { urlRoutes as deprecatedRoutesRouter } from "./routes/deprecated.routes";
import { eventsRouter } from "./routes/events.routes";
import { itemRouter } from "./routes/item.routes";
import { createStandardRoutes } from "./routes/routeCreator.routes";
import { searchRouter } from "./routes/search.routes";

const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");

dotenv.config();

export const app: Application = express();

const MysqlStore = MySqlSessionStore(session);

const sessionStoreOptions: MySqlSessionStore.Options = {
  host: process.env.DB_IP,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "sessions",
  createDatabaseTable: true,
};

export const sessionStore = new MysqlStore(sessionStoreOptions);

const sessionOptions: SessionOptions = {
  secret: process.env.accessTokenSecret || "",
  store: sessionStore,
  resave: false,
  cookie: {
    secure: false,
  },
  saveUninitialized: true,
  name: "sessionId",
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  if (sessionOptions && sessionOptions.cookie) {
    sessionOptions.cookie.secure = true;
  }
}

app.use(session(sessionOptions));

const corsOptions = {
  origin: "*",
};

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// TODO: place these in their own files for consistency
const categoryRouter = createStandardRoutes(
  "../controllers/category.controller"
);
const standardItemRouter = createStandardRoutes(
  "../controllers/standardItem.controller"
);

app.use("/api/v2/item", itemRouter);
app.use("/api/v2/category", categoryRouter);
app.use("/api/v2/standardItem", standardItemRouter);
app.use("/api/v2/search", searchRouter);
app.use("/api/v2/events", eventsRouter);
app.use("/api/v2/authentication", authenticationRouter);
app.use("", deprecatedRoutesRouter);
