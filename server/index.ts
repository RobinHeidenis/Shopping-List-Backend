import { createStandardRoutes } from "./routes/routeCreator.routes";

require("dotenv").config();
const express = require("express");

export const app = express();
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: process.env.DB_IP,
  port: 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "sessions",
  createDatabaseTable: true,
};

export const sessionStore = new MySQLStore(options);

const sess = {
  secret: process.env.accessTokenSecret,
  store: sessionStore,
  resave: false,
  cookie: {
    secure: false,
  },
  saveUninitialized: true,
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));

const corsOptions = {
  origin: "*",
};

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

const itemRouter = require("./routes/item.routes");

const searchRouter = require("./routes/search.routes");

const eventsRouter = require("./routes/events.routes");

const authenticationRouter = require("./routes/authentication.routes");

const categoryRouter = createStandardRoutes(
  "../controllers/category.controller"
);
const standardItemRouter = createStandardRoutes(
  "../controllers/standardItem.controller"
);

const deprecatedRoutesRouter = require("./routes/deprecated.routes");

app.use("/api/v2/item", itemRouter);
app.use("/api/v2/category", categoryRouter);
app.use("/api/v2/standardItem", standardItemRouter);
app.use("/api/v2/search", searchRouter);
app.use("/api/v2/events", eventsRouter);
app.use("/api/v2/authentication", authenticationRouter);
app.use("", deprecatedRoutesRouter);
