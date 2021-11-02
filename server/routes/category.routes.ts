import express from "express";
import {
  createOneRequest,
  deleteAllRequest,
  deleteOneRequest,
  readAllRequest,
  readOneRequest,
  updateOneRequest,
} from "../controllers/category.controller";
import { authenticateJWTMiddleware } from "../middlewares/JWT.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createCategoryValidationRules,
  updateCategoryValidationRules,
} from "../validators/category.validator";
import { idOnlyValidationRules } from "../validators/default.validator";

export const categoryRouter = express.Router();

categoryRouter.use(authenticateJWTMiddleware);

categoryRouter.post(
  "/",
  createCategoryValidationRules(),
  validate,
  createOneRequest
);

categoryRouter.route("/all").get(readAllRequest).delete(deleteAllRequest);

categoryRouter
  .route("/:id")
  .get(idOnlyValidationRules(), validate, readOneRequest)
  .patch(
    idOnlyValidationRules(),
    updateCategoryValidationRules(),
    validate,
    updateOneRequest
  )
  .delete(idOnlyValidationRules(), validate, deleteOneRequest);
