import express, { Application } from "express";
import helmet from "helmet";
import { corsOptions } from "./config/cors.config";
import { sessionOptions } from "./config/sessionOptions.config";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/notFound.middleware";
import { authenticationRouter } from "./routes/authentication.routes";
import { categoryRouter } from "./routes/category.routes";
import { urlRoutes as deprecatedRoutesRouter } from "./routes/deprecated.routes";
import { eventsRouter } from "./routes/events.routes";
import { itemRouter } from "./routes/item.routes";
import { searchRouter } from "./routes/search.routes";
import { standardItemRouter } from "./routes/standardItem.routes";

require("express-async-errors");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const session = require("express-session");

export const app: Application = express();

app.options("*", cors(corsOptions));

app.use(session(sessionOptions));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(errorMiddleware);

app.use("/api/v2/item", itemRouter);
app.use("/api/v2/category", categoryRouter);
app.use("/api/v2/standardItem", standardItemRouter);
app.use("/api/v2/search", searchRouter);
app.use("/api/v2/events", eventsRouter);
app.use("/api/v2/authentication", authenticationRouter);
app.get("/health", (req, res) => res.send({ message: "Service OK" }));
app.use("", deprecatedRoutesRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
