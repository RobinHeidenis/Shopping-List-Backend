import express from "express";
import {
  createOneRequest,
  deleteAllRequest,
  deleteOneRequest,
  readAllRequest,
  readOneRequest,
  updateOneRequest,
  updateSequencesRequest,
} from "../controllers/item.controller";
import { authenticateJWTMiddleware } from "../middlewares/JWT.middleware";
import { validate } from "../middlewares/validate.middleware";
import { idOnlyValidationRules } from "../validators/default.validator";
import {
  createItemValidationRules,
  UpdateItemValidationRules,
} from "../validators/item.validator";

export const itemRouter = express.Router();

itemRouter.use(authenticateJWTMiddleware);

itemRouter.post("/", createItemValidationRules(), validate, createOneRequest);

itemRouter.route("/all").get(readAllRequest).delete(deleteAllRequest);

itemRouter.post("/sequences", updateSequencesRequest);

itemRouter
  .route("/:id")
  .get(idOnlyValidationRules(), validate, readOneRequest)
  .patch(
    idOnlyValidationRules(),
    UpdateItemValidationRules(),
    validate,
    updateOneRequest
  )
  .delete(idOnlyValidationRules(), validate, deleteOneRequest);
