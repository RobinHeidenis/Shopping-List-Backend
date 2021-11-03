import express = require("express");
import controller = require("../controllers/events.controller");
import { authenticateJWTMiddleware } from "../middlewares/JWT.middleware";

export const eventsRouter = express.Router();

eventsRouter.use(authenticateJWTMiddleware);

eventsRouter.get("/", controller.events);
