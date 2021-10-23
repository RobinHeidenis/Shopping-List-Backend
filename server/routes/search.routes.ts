import express = require("express");
import controller = require("../controllers/search.controller");
import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";

export const searchRouter = express.Router();

searchRouter.use(authenticateJWTMiddleware);

searchRouter.get("/:query", controller.search);
