import express = require("express");
import controller = require("../controllers/authentication.controller");
import { validate } from "../middlewares/validate.middleware";
import { authenticationValidationRules } from "../validators/authentication.validator";

export const authenticationRouter = express.Router();

authenticationRouter.post(
  "/login",
  authenticationValidationRules(),
  validate,
  controller.login
);
