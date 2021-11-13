import express from "express";
import {
  checkRequest,
  createOneRequest,
  deleteAllRequest,
  deleteCheckedRequest,
  deleteOneRequest,
  readAllRequest,
  readOneRequest,
  uncheckRequest,
  updateOneRequest,
  updateSequencesRequest,
} from "../controllers/item.controller";
import { authenticateJWTMiddleware } from "../middlewares/JWT.middleware";
import { validate } from "../middlewares/validate.middleware";
import { idOnlyValidationRules } from "../validators/default.validator";
import {
  createItemValidationRules,
  SequencesValidationRules,
  UpdateItemValidationRules,
} from "../validators/item.validator";

export const itemRouter = express.Router();

itemRouter.use(authenticateJWTMiddleware);

itemRouter.post("/", createItemValidationRules(), validate, createOneRequest);

itemRouter.route("/all").get(readAllRequest).delete(deleteAllRequest);

itemRouter.post(
  "/sequences",
  SequencesValidationRules(),
  validate,
  updateSequencesRequest
);

itemRouter.delete("/checked", deleteCheckedRequest);

itemRouter.patch("/:id/check", idOnlyValidationRules(), validate, checkRequest);

itemRouter.patch(
  "/:id/uncheck",
  idOnlyValidationRules(),
  validate,
  uncheckRequest
);

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
