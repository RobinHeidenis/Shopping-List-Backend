import express, { Application } from "express";
import { SessionOptions } from "express-session";
import helmet from "helmet";
import MySqlSessionStore = require("express-mysql-session");
import { config } from "./config/env.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { authenticationRouter } from "./routes/authentication.routes";
import { categoryRouter } from "./routes/category.routes";
import { urlRoutes as deprecatedRoutesRouter } from "./routes/deprecated.routes";
import { eventsRouter } from "./routes/events.routes";
import { itemRouter } from "./routes/item.routes";
import { searchRouter } from "./routes/search.routes";
import { standardItemRouter } from "./routes/standardItem.routes";

const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");

const app: Application = express();

const MysqlStore = MySqlSessionStore(session);

const sessionStoreOptions: MySqlSessionStore.Options = {
  host: config.db.ip,
  port: 3306,
  user: config.db.username,
  password: config.db.password,
  database: "sessions",
  createDatabaseTable: true,
};

export const sessionStore = new MysqlStore(sessionStoreOptions);

const sessionOptions: SessionOptions = {
  secret: config.tokens.access || "",
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

app.use("/api/v2/item", itemRouter);
app.use("/api/v2/category", categoryRouter);
app.use("/api/v2/standardItem", standardItemRouter);
app.use("/api/v2/search", searchRouter);
app.use("/api/v2/events", eventsRouter);
app.use("/api/v2/authentication", authenticationRouter);
app.get("/api/health", (req, res) => res.send({ message: "Service OK" }));
app.use("", deprecatedRoutesRouter);

app.use([notFoundMiddleware, errorMiddleware]);

export { app };
