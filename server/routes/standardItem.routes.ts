import express from "express";
import {
  createOneRequest,
  deleteAllRequest,
  deleteOneRequest,
  readAllRequest,
  readOneRequest,
  updateOneRequest,
} from "../controllers/standardItem.controller";
import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";
import { validate } from "../middlewares/validate";
import { idOnlyValidationRules } from "../validators/default.validator";
import {
  createStandardItemValidationRules,
  updateStandardItemValidationRules,
} from "../validators/standardItem.validator";

export const standardItemRouter = express.Router();

standardItemRouter.use(authenticateJWTMiddleware);

standardItemRouter.post(
  "/",
  createStandardItemValidationRules(),
  validate,
  createOneRequest
);

standardItemRouter.route("/all").get(readAllRequest).delete(deleteAllRequest);

standardItemRouter
  .route("/:id")
  .get(idOnlyValidationRules(), validate, readOneRequest)
  .patch(
    idOnlyValidationRules(),
    updateStandardItemValidationRules(),
    validate,
    updateOneRequest
  )
  .delete(idOnlyValidationRules(), validate, deleteOneRequest);
