import express = require("express");
import controller = require("../controllers/authentication.controller");

export const authenticationRouter = express.Router();

authenticationRouter.post("/login", controller.login);
