import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";

export {};

const express = require("express");

const router = express.Router();

const controller = require("../controllers/events.controller");

router.use(authenticateJWTMiddleware);

router.get("/", controller.events);

module.exports = router;
