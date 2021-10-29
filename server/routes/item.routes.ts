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
import { authenticateJWTMiddleware } from "../middlewares/JWTMiddleware";
import { validate } from "../middlewares/validate";
import {
  createItemValidationRules,
  idOnlyValidationRules,
  updateItemValidationRules,
} from "../validators/item.validator";

export const itemRouter = express.Router();

itemRouter.use(authenticateJWTMiddleware);

itemRouter.post("/", createItemValidationRules(), validate, createOneRequest);

itemRouter.route("/all").get(readAllRequest).delete(deleteAllRequest);

itemRouter.post("/sequences", updateSequencesRequest);

itemRouter
  .route("/:id")
  .get(idOnlyValidationRules(), validate, readOneRequest)
  .patch(updateItemValidationRules(), validate, updateOneRequest)
  .delete(idOnlyValidationRules(), validate, deleteOneRequest);
