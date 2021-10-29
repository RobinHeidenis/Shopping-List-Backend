import express from "express";
import {
  createOneRequest,
  deleteAllRequest,
  deleteOneRequest,
  readAllRequest,
  readOneRequest,
  updateOneRequest,
} from "../controllers/category.controller";
import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";
import { validate } from "../middlewares/validate";
import {
  createCategoryValidationRules,
  idOnlyValidationRules,
  updateCategoryValidationRules,
} from "../validators/category.validator";

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
  .patch(updateCategoryValidationRules(), validate, updateOneRequest)
  .delete(idOnlyValidationRules(), validate, deleteOneRequest);
