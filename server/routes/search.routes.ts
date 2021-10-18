import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";

const express = require("express");

const router = express.Router();

const controller = require("../controllers/search.controller");

router.use(authenticateJWTMiddleware);

router.get("/:query", controller.search);

module.exports = router;
